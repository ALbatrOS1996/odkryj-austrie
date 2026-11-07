/* Odkryj Austrię! – silnik gry.
 * Czysta maszyna stanów: reduce(stan, akcja) -> stan. Bez sieci i DOM.
 * Używany przez aplikację (telefon gospodarza jest sędzią) i przez symulator (node).
 * Czas gry liczony jest "zegarem partii" (s.clock), który stoi, gdy ktoś jest offline.
 */
(function (root) {
  'use strict';
  const CATS = ['ZAB', 'GEO', 'HIS', 'KUL', 'SPO'];
  const FACES = ['ZAB', 'GEO', 'HIS', 'KUL', 'SPO', 'WYB'];
  const REGIONS = ['east', 'north', 'south', 'west'];
  const SPECIALS = ['luck', 'detour', 'ticket', 'express'];

  const DEFAULT_RULES = {
    timeLimit: 25,        // s na odpowiedź (15 / 25 / 40)
    intercepts: true,     // przechwyty
    fifty: true,          // koło ratunkowe 50/50
    specials: true,       // karty specjalne w talii
    fortress: true,       // twierdza
    timedGame: 0,         // 0 = wyłączona, 10 / 15 min
    choiceTime: 10,       // s na wybór kategorii przy ściance Wybór
    explainTime: 20,      // s na objaśnienie
    perRegion: 16,        // kart każdego regionu
    specialsPerType: 3,
    target: 2,            // ile kart każdego regionu trzeba zebrać (1 = jedna karta na region)
    reroute: true,        // Zmiana trasy
    offlineLimit: 120,    // s nieobecności w trakcie pytania, potem brak odpowiedzi
    rollDelay: 2.4        // s doliczane do limitu po rzucie kostką (animacja rzutu)
  };

  // ---------- RNG z ziarnem (mulberry32) ----------
  function rand(s) {
    let t = (s.rng = (s.rng + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function randInt(s, n) { return Math.floor(rand(s) * n); }
  function shuffle(s, arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(s, i + 1);
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // ---------- pomocnicze ----------
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const opp = (p) => 1 - p;
  function distinct(pl, tg) { tg = tg || 1; return REGIONS.filter((r) => pl.cards[r] >= tg).length; }
  function total(pl) { return REGIONS.reduce((a, r) => a + pl.cards[r], 0); }
  function inFortress(s, p) { return s.rules.fortress && distinct(s.players[p], s.rules.target) >= 3; }
  function ev(s, e) {
    s.evSeq = (s.evSeq || 0) + 1;
    e.n = s.evSeq;
    s.log.push(e);
    if (s.log.length > 30) s.log.shift();
  }
  function hasRegionCards(s) { return s.deck.some((c) => c.t === 'r'); }

  // ---------- tworzenie partii ----------
  /**
   * opts: { seed, players:[{id,name},{id,name}], rules, starter (0|1|null),
   *         bank:[{id,cat,diff,region,correct}], seen:{qid:count}, now }
   */
  let BANK = [];
  function setBank(b) { BANK = b || []; }

  function createGame(opts) {
    if (opts.bank) setBank(opts.bank);
    const rules = Object.assign({}, DEFAULT_RULES, opts.rules || {});
    const s = {
      v: 1,
      rules,
      rng: (opts.seed >>> 0) || 1,
      players: opts.players.map((p) => ({
        id: p.id, name: p.name,
        cards: { east: 0, north: 0, south: 0, west: 0 },
        ticket: false, fiftyUsed: false
      })),
      deck: [],
      active: 0, starter: 0, turnNo: 0,
      phase: 'TURN',
      top: null, rerouted: false, extra: 0,
      face: null, q: null, answers: [null, null], fiftyRm: [[], []],
      result: null, ready: [false, false], pending: null, tradeOpts: null,
      deadline: null, clock: 0, lastNow: opts.now || 0, off: [0, 0], online: [true, true],
      winner: null, overReason: null,
      used: {}, seen: opts.seen || {},
      hist: [], log: [], evSeq: 0
    };
    const deck = [];
    REGIONS.forEach((r) => { for (let i = 0; i < rules.perRegion; i++) deck.push({ t: 'r', r }); });
    if (rules.specials) SPECIALS.forEach((k) => { for (let i = 0; i < rules.specialsPerType; i++) deck.push({ t: 's', k }); });
    shuffle(s, deck);
    s.deck = deck;
    s.starter = (opts.starter === 0 || opts.starter === 1) ? opts.starter : randInt(s, 2);
    s.active = s.starter;
    ev(s, { type: 'start', p: s.active });
    beginTurn(s);
    return s;
  }

  function beginTurn(s) {
    s.rerouted = false;
    s.turnNo++;
    reveal(s);
  }

  function reveal(s) {
    s.top = null; s.face = null; s.q = null; s.result = null; s.pending = null; s.tradeOpts = null;
    if (!hasRegionCards(s)) return endByTiebreak(s, 'deck');
    s.top = s.deck.shift();
    if (s.top.t === 's') return startSpecial(s);
    s.phase = 'TURN';
    s.deadline = null;
  }

  // ---------- karty specjalne ----------
  function specialOptions(s) {
    const a = s.active, o = opp(a);
    const A = s.players[a], O = s.players[o], tg = s.rules.target;
    switch (s.top.k) {
      case 'luck': {
        if (inFortress(s, o)) return { options: [], note: 'fortress' };
        const opts = REGIONS.filter((r) => A.cards[r] < tg && O.cards[r] > 0);
        return { options: opts, note: opts.length ? null : 'nothing' };
      }
      case 'detour': {
        const dup = REGIONS.filter((r) => A.cards[r] > tg);
        const opts = dup.length ? dup : REGIONS.filter((r) => A.cards[r] > 0);
        return { options: opts, note: opts.length ? null : 'nothing' };
      }
      case 'ticket':
        return { options: [], note: A.ticket ? 'hasTicket' : null };
      default:
        return { options: [], note: null };
    }
  }

  function startSpecial(s) {
    s.phase = 'SPECIAL';
    s.pending = specialOptions(s);
    s.deadline = s.clock + 45000; // potem wybór automatyczny
    ev(s, { type: 'special', k: s.top.k, p: s.active });
  }

  function resolveSpecial(s, region) {
    const a = s.active, o = opp(a), k = s.top.k;
    const opts = s.pending.options;
    let r = null;
    if (opts.length) r = opts.includes(region) ? region : opts[0];
    if (k === 'luck' && r) {
      s.players[o].cards[r]--; s.players[a].cards[r]++;
      ev(s, { type: 'luck', p: a, r });
    } else if (k === 'detour' && r) {
      s.players[a].cards[r]--; s.players[o].cards[r]++;
      ev(s, { type: 'detour', p: a, r });
    } else if (k === 'ticket' && !s.players[a].ticket) {
      s.players[a].ticket = true;
      ev(s, { type: 'ticketGain', p: a });
    } else if (k === 'express') {
      s.extra++;
      ev(s, { type: 'express', p: a });
    }
    // Zdobyty Bilet zostaje u gracza; pozostałe karty wracają pod spód stosu
    const kept = k === 'ticket' && s.pending.note !== 'hasTicket';
    if (!kept) s.deck.push(s.top);
    s.top = null;
    if (checkWin(s)) { s.phase = 'OVER'; s.deadline = null; return; }
    reveal(s);
  }

  // ---------- pytanie ----------
  function pickQuestion(s, cat) {
    const region = s.top ? s.top.r : null;
    let cands = BANK.filter((q) => q.cat === cat && !s.used[q.id]);
    if (!cands.length) cands = BANK.filter((q) => q.cat === cat);
    if (!cands.length) return null;
    if (cat === 'GEO' || cat === 'ZAB') {
      const reg = cands.filter((q) => q.region === region);
      if (reg.length && (cat === 'GEO' || rand(s) < 0.5)) cands = reg;
    }
    // pytania widziane rzadziej mają większą wagę
    const w = cands.map((q) => 1 / (1 + 3 * (s.seen[q.id] || 0)));
    let sum = w.reduce((a, b) => a + b, 0), x = rand(s) * sum;
    for (let i = 0; i < cands.length; i++) { x -= w[i]; if (x <= 0) return cands[i]; }
    return cands[cands.length - 1];
  }

  function startDuel(s, cat, extraMs) {
    const q = pickQuestion(s, cat);
    s.used[q.id] = true;
    s.seen[q.id] = (s.seen[q.id] || 0) + 1;
    s.q = { id: q.id, cat, diff: q.diff, correct: q.correct, region: s.top.r };
    s.answers = [null, null];
    s.fiftyRm = [[], []];
    s.off = [0, 0];
    s.phase = 'DUEL';
    s.deadline = s.clock + s.rules.timeLimit * 1000 + (extraMs || 0);
  }

  function resolveDuel(s) {
    const a = s.active, o = opp(a), c = s.q.correct;
    const ok = s.answers.map((x) => !!x && x.o === c);
    let award = -1, kind = 'none';
    if (ok[a]) { award = a; kind = 'active'; }
    else if (ok[o] && s.rules.intercepts) { award = o; kind = 'intercept'; }
    s.result = { ok, award, kind, card: s.top.r };
    if (award >= 0) s.players[award].cards[s.top.r]++;
    s.hist.push({ q: s.q.id, cat: s.q.cat, r: s.top.r, a: s.answers.map((x) => (x ? x.o : -1)), c, act: a, award });
    ev(s, { type: 'award', kind, p: award, r: s.top.r });
    checkWin(s);
    s.phase = 'EXPLAIN';
    s.ready = [false, false];
    s.deadline = s.clock + s.rules.explainTime * 1000;
  }

  function afterExplain(s) {
    if (s.result && s.result.award === -1) s.deck.push(s.top);
    s.top = null;
    if (s.winner !== null) { s.phase = 'OVER'; s.deadline = null; return; }
    const t = tradeOptions(s);
    if (t) { s.phase = 'TRADE'; s.tradeOpts = t; s.deadline = s.clock + 30000; return; }
    endRound(s);
  }

  function tradeOptions(s) {
    const a = s.active, o = opp(a), A = s.players[a], O = s.players[o], tg = s.rules.target;
    const give = REGIONS.filter((r) => A.cards[r] >= tg + 2);
    const want = REGIONS.filter((r) => A.cards[r] < tg && O.cards[r] > tg);
    return give.length && want.length ? { give, want } : null;
  }

  function endRound(s) {
    s.tradeOpts = null;
    if (s.extra > 0) {
      s.extra--;
      ev(s, { type: 'walcRound', p: s.active });
      s.rerouted = false;
      return reveal(s);
    }
    if (s.rules.timedGame && s.clock >= s.rules.timedGame * 60000) return endByTiebreak(s, 'time');
    s.active = opp(s.active);
    beginTurn(s);
  }

  function checkWin(s) {
    if (s.winner !== null) return true;
    for (const p of [s.active, opp(s.active)]) {
      if (distinct(s.players[p], s.rules.target) === 4) {
        s.winner = p; s.overReason = 'map';
        ev(s, { type: 'win', p });
        return true;
      }
    }
    return false;
  }

  function endByTiebreak(s, reason) {
    const [A, B] = s.players;
    const da = distinct(A, s.rules.target), db = distinct(B, s.rules.target);
    let w;
    if (da !== db) w = da > db ? 0 : 1;
    else if (total(A) !== total(B)) w = total(A) > total(B) ? 0 : 1;
    else w = 'draw';
    s.winner = w; s.overReason = reason;
    s.phase = 'OVER'; s.deadline = null;
    ev(s, { type: 'win', p: w, reason });
  }

  // ---------- reduktor ----------
  // wersja mutująca (symulator) – ta sama logika co reduce
  function step(s, act) { return apply(s, act) !== false; }

  function reduce(s0, act) {
    const s = clone(s0);
    const ok = apply(s, act);
    return ok === false ? s0 : s;
  }

  function apply(s, act) {
    const p = act.p;
    if (s.phase === 'OVER' && act.type !== 'tick') return false;
    switch (act.type) {
      case 'tick': return tick(s, act);
      case 'reroute':
        if (s.phase !== 'TURN' || p !== s.active || s.rerouted || !s.rules.reroute) return false;
        if (!(s.players[p].cards[s.top.r] >= s.rules.target)) return false;
        s.deck.push(s.top); s.rerouted = true;
        ev(s, { type: 'reroute', p, r: s.top.r });
        reveal(s);
        return true;
      case 'roll': {
        if (s.phase !== 'TURN' || p !== s.active) return false;
        s.face = FACES[randInt(s, 6)];
        ev(s, { type: 'roll', p, face: s.face });
        const rd = (s.rules.rollDelay || 0) * 1000;
        if (s.face === 'WYB') { s.phase = 'CHOOSE'; s.deadline = s.clock + s.rules.choiceTime * 1000 + rd; }
        else startDuel(s, s.face, rd);
        return true;
      }
      case 'choose':
        if (s.phase !== 'CHOOSE' || p !== opp(s.active) || !CATS.includes(act.cat)) return false;
        ev(s, { type: 'chosen', p, cat: act.cat });
        startDuel(s, act.cat);
        return true;
      case 'answer':
        if (s.phase !== 'DUEL' || s.answers[p] || !(act.o >= 0 && act.o <= 3)) return false;
        if (act.qid && act.qid !== s.q.id) return false;
        s.answers[p] = { o: act.o, t: s.deadline - s.clock };
        if (s.answers[0] && s.answers[1]) resolveDuel(s);
        return true;
      case 'fifty': {
        if (s.phase !== 'DUEL' || !s.rules.fifty || s.players[p].fiftyUsed || s.answers[p]) return false;
        const wrong = [0, 1, 2, 3].filter((i) => i !== s.q.correct);
        shuffle(s, wrong);
        s.fiftyRm[p] = wrong.slice(0, 2).sort();
        s.players[p].fiftyUsed = true;
        return true;
      }
      case 'ticket':
        if (s.phase !== 'EXPLAIN' || p !== s.active || !s.players[p].ticket) return false;
        if (!s.result || s.result.award !== -1 || s.winner !== null) return false;
        s.players[p].ticket = false;
        s.players[p].cards[s.top.r]++;
        s.result.award = p; s.result.kind = 'ticket';
        ev(s, { type: 'award', kind: 'ticket', p, r: s.top.r });
        s.hist[s.hist.length - 1].award = p;
        checkWin(s);
        return true;
      case 'next':
        if (s.phase !== 'EXPLAIN') return false;
        s.ready[p] = true;
        if (s.ready[0] && s.ready[1]) afterExplain(s);
        return true;
      case 'special':
        if (s.phase !== 'SPECIAL' || p !== s.active) return false;
        resolveSpecial(s, act.region);
        return true;
      case 'trade': {
        if (s.phase !== 'TRADE' || p !== s.active) return false;
        const t = s.tradeOpts;
        if (!t.give.includes(act.give) || !t.want.includes(act.want)) return false;
        const o = opp(p);
        s.players[p].cards[act.give]--; s.players[o].cards[act.give]++;
        s.players[o].cards[act.want]--; s.players[p].cards[act.want]++;
        ev(s, { type: 'trade', p, give: act.give, want: act.want });
        if (checkWin(s)) { s.phase = 'OVER'; s.deadline = null; return true; }
        endRound(s);
        return true;
      }
      case 'skipTrade':
        if (s.phase !== 'TRADE' || p !== s.active) return false;
        endRound(s);
        return true;
      case 'resign':
        if (p !== 0 && p !== 1) return false;
        s.winner = opp(p); s.overReason = 'resign';
        s.phase = 'OVER'; s.deadline = null;
        ev(s, { type: 'win', p: opp(p), reason: 'resign' });
        return true;
      default:
        return false;
    }
  }

  function tick(s, act) {
    const now = act.now;
    const dt = Math.max(0, Math.min(1500, now - (s.lastNow || now)));
    s.lastNow = now;
    if (act.online) s.online = act.online.slice();
    if (s.phase === 'OVER') return true;
    if (s.phase === 'DUEL') {
      // zegar stoi, dopóki nieobecny gracz nie odpowiedział; po limicie liczy się brak odpowiedzi
      let blocked = false;
      for (const p of [0, 1]) {
        if (!s.online[p] && !s.answers[p]) {
          s.off[p] += dt;
          if (s.off[p] >= s.rules.offlineLimit * 1000) s.answers[p] = { o: -1, t: 0 };
          else blocked = true;
        }
      }
      if (s.answers[0] && s.answers[1]) { resolveDuel(s); return true; }
      if (!blocked) s.clock += dt;
    } else if (s.online[0] && s.online[1]) {
      s.clock += dt;
    }
    if (s.deadline === null || s.clock < s.deadline) return true;
    switch (s.phase) {
      case 'CHOOSE':
        ev(s, { type: 'chosen', p: opp(s.active), cat: null });
        startDuel(s, CATS[randInt(s, 5)]);
        break;
      case 'DUEL':
        for (const p of [0, 1]) if (!s.answers[p]) s.answers[p] = { o: -1, t: 0 };
        resolveDuel(s);
        break;
      case 'EXPLAIN':
        afterExplain(s);
        break;
      case 'SPECIAL':
        resolveSpecial(s, null);
        break;
      case 'TRADE':
        endRound(s);
        break;
    }
    return true;
  }

  // ---------- widok dla gracza (filtrowanie informacji) ----------
  function view(s, p) {
    const o = opp(p);
    const v = {
      phase: s.phase, me: p, active: s.active, turnNo: s.turnNo, rules: s.rules,
      players: s.players.map((pl) => ({ name: pl.name, cards: pl.cards, ticket: pl.ticket, fiftyUsed: pl.fiftyUsed })),
      deckLeft: s.deck.length, deckRegions: s.deck.filter((c) => c.t === 'r').length,
      top: s.top, rerouted: s.rerouted, extra: s.extra, face: s.face,
      deadlineIn: s.deadline === null ? null : Math.max(0, s.deadline - s.clock),
      paused: !(s.online[0] && s.online[1]), online: s.online,
      winner: s.winner, overReason: s.overReason, pending: s.pending, tradeOpts: s.tradeOpts,
      log: s.log.slice(-8), evSeq: s.evSeq, clock: s.clock, starter: s.starter
    };
    if (s.q) {
      const revealed = s.phase !== 'DUEL';
      v.q = { id: s.q.id, cat: s.q.cat, diff: s.q.diff, region: s.q.region };
      v.myAnswer = s.answers[p] ? s.answers[p].o : null;
      v.oppAnswered = !!s.answers[o];
      v.fiftyRm = s.fiftyRm[p];
      if (revealed && s.result) {
        v.q.correct = s.q.correct;
        v.oppAnswer = s.answers[o] ? s.answers[o].o : -1;
        v.result = s.result;
      }
    }
    if (s.phase === 'EXPLAIN') v.ready = s.ready;
    if (s.phase === 'OVER') v.hist = s.hist;
    return v;
  }

  const api = { setBank, step, CATS, FACES, REGIONS, SPECIALS, DEFAULT_RULES, createGame, reduce, view, distinct, total };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof self !== 'undefined' ? self : this);
