/* Odkryj Austrię! – łączność online bez własnego serwera.
 * Minimalny klient MQTT 3.1.1 przez WebSocket do publicznych, darmowych brokerów.
 * Wszystkie wiadomości są szyfrowane AES-GCM kluczem wyprowadzonym z kodu pokoju,
 * a temat (kanał) jest skrótem kodu, więc postronni nie widzą treści.
 * Łączymy się równolegle z dwoma brokerami; duplikaty wiadomości są odrzucane.
 */
(function () {
  'use strict';
  const BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt'
  ];
  const enc = new TextEncoder(), dec = new TextDecoder();

  function str(s) { const b = enc.encode(s); return [b.length >> 8, b.length & 255, ...b]; }
  function remLen(n) { const out = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; out.push(d); } while (n > 0); return out; }
  function packet(type, body) { return new Uint8Array([type, ...remLen(body.length), ...body]); }

  class MqttLink {
    constructor(url, clientId, handlers) {
      this.url = url; this.clientId = clientId; this.h = handlers;
      this.subs = new Set(); this.ok = false; this.buf = new Uint8Array(0); this.pid = 1;
      this.backoff = 1000; this.closed = false;
      this.connect();
    }
    connect() {
      if (this.closed) return;
      let ws;
      try { ws = new WebSocket(this.url, 'mqtt'); } catch (e) { return this.retry(); }
      ws.binaryType = 'arraybuffer';
      this.ws = ws;
      ws.onopen = () => {
        const body = [...str('MQTT'), 4, 0x02, 0, 30, ...str(this.clientId)];
        ws.send(packet(0x10, body));
      };
      ws.onmessage = (e) => this.onData(new Uint8Array(e.data));
      ws.onclose = () => { this.setOk(false); this.retry(); };
      ws.onerror = () => { try { ws.close(); } catch (e) {} };
    }
    retry() {
      clearInterval(this.ping);
      if (this.closed) return;
      clearTimeout(this.rt);
      this.rt = setTimeout(() => this.connect(), this.backoff);
      this.backoff = Math.min(this.backoff * 2, 15000);
    }
    setOk(v) { if (this.ok !== v) { this.ok = v; this.h.onStatus && this.h.onStatus(); } }
    onData(chunk) {
      const b = new Uint8Array(this.buf.length + chunk.length); b.set(this.buf); b.set(chunk, this.buf.length);
      let i = 0;
      while (i < b.length) {
        if (b.length - i < 2) break;
        let mult = 1, len = 0, j = i + 1, d;
        do { if (j >= b.length) { j = -1; break; } d = b[j++]; len += (d & 127) * mult; mult *= 128; } while (d & 128);
        if (j < 0 || j + len > b.length) break;
        this.onPacket(b[i], b.subarray(j, j + len));
        i = j + len;
      }
      this.buf = b.slice(i);
    }
    onPacket(type, body) {
      const t = type >> 4;
      if (t === 2) { // CONNACK
        if (body[1] === 0) {
          this.backoff = 1000; this.setOk(true);
          this.subs.forEach((s) => this.sendSub(s));
          clearInterval(this.ping);
          this.ping = setInterval(() => { try { this.ws.send(new Uint8Array([0xC0, 0])); } catch (e) {} }, 20000);
        }
      } else if (t === 3) { // PUBLISH (QoS 0)
        const tl = (body[0] << 8) | body[1];
        const topic = dec.decode(body.subarray(2, 2 + tl));
        let off = 2 + tl;
        if ((type >> 1) & 3) off += 2;
        this.h.onMessage(topic, body.slice(off));
      }
    }
    sendSub(topic) {
      if (!this.ok) return;
      const id = this.pid++ & 0xffff || 1;
      this.ws.send(packet(0x82, [id >> 8, id & 255, ...str(topic), 0]));
    }
    subscribe(topic) { this.subs.add(topic); this.sendSub(topic); }
    publish(topic, payload, retain) {
      if (!this.ok) return false;
      const body = new Uint8Array([...str(topic), ...payload]);
      try { this.ws.send(packet(0x30 | (retain ? 1 : 0), body)); return true; } catch (e) { return false; }
    }
    close() {
      this.closed = true; clearInterval(this.ping); clearTimeout(this.rt);
      try { this.ws.send(new Uint8Array([0xE0, 0])); this.ws.close(); } catch (e) {}
    }
  }

  async function sha(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s))); }
  const hex = (u) => Array.from(u, (x) => x.toString(16).padStart(2, '0')).join('');
  function b64(u) { let s = ''; u.forEach((x) => { s += String.fromCharCode(x); }); return btoa(s); }

  /** Kanał pokoju: szyfrowane wiadomości JSON między gospodarzem a gościem. */
  class RoomChannel {
    static async open(code, role, onMsg, onStatus) {
      const c = new RoomChannel();
      c.code = code; c.role = role; c.onMsg = onMsg; c.onStatusCb = onStatus;
      const base = 'odkryj-austrie/v1/' + hex(await sha('topic:' + code)).slice(0, 32);
      c.tHost = base + '/h'; c.tGuest = base + '/g';
      c.key = await crypto.subtle.importKey('raw', await sha('key:odkryj-austrie:' + code), 'AES-GCM', false, ['encrypt', 'decrypt']);
      c.seen = new Map();
      const cid = 'oa' + Math.random().toString(36).slice(2, 12);
      c.links = BROKERS.map((u, i) => new MqttLink(u, cid + i, {
        onMessage: (t, p) => c.onRaw(t, p),
        onStatus: () => c.onStatusCb && c.onStatusCb(c.connected())
      }));
      const listen = role === 'host' ? c.tGuest : c.tHost;
      c.links.forEach((l) => l.subscribe(listen));
      return c;
    }
    connected() { return this.links.some((l) => l.ok); }
    async onRaw(topic, payload) {
      if (!payload.length) return;
      try {
        const iv = payload.slice(0, 12), data = payload.slice(12);
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.key, data);
        const msg = JSON.parse(dec.decode(plain));
        // odrzucanie duplikatów z dwóch brokerów
        const k = msg.mid;
        if (k) {
          if (this.seen.has(k)) return;
          this.seen.set(k, Date.now());
          if (this.seen.size > 400) { const cut = Date.now() - 120000; this.seen.forEach((v, kk) => { if (v < cut) this.seen.delete(kk); }); }
        }
        this.onMsg(msg);
      } catch (e) { /* obce lub uszkodzone wiadomości ignorujemy */ }
    }
    async send(msg, retain) {
      msg.mid = msg.mid || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.key, enc.encode(JSON.stringify(msg))));
      const p = new Uint8Array(12 + ct.length); p.set(iv); p.set(ct, 12);
      const topic = this.role === 'host' ? this.tHost : this.tGuest;
      let any = false;
      this.links.forEach((l) => { if (l.publish(topic, p, retain)) any = true; });
      return any;
    }
    clearRetained() {
      this.links.forEach((l) => l.publish(this.tHost, new Uint8Array(0), true));
    }
    close() { this.links.forEach((l) => l.close()); }
  }

  const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // bez 0/O, 1/I/L
  function newCode() {
    const r = crypto.getRandomValues(new Uint8Array(6));
    return Array.from(r, (x) => ALPHABET[x % ALPHABET.length]).join('');
  }
  function normCode(s) {
    return (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
      .split('').filter((ch) => ALPHABET.includes(ch)).join('').slice(0, 6);
  }

  window.Net = { RoomChannel, newCode, normCode, ALPHABET, b64 };
})();
