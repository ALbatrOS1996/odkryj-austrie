/* Odkryj! – pojedynek wiedzy o krajach (PWA). Kraj = pakiet treści w docs/data/<kod>.js */
(function () {
  'use strict';
  const E = window.Engine, I = window.ICONS, Net = window.Net, REGISTRY = window.OA_REGISTRY;
  const $app = document.getElementById('app');
  const CATS = E.CATS;
  const CAT_NAMES = { ZAB: 'Zabytki i symbole', GEO: 'Geografia i miasta', HIS: 'Historia', KUL: 'Kultura i ludzie', SPO: 'Społeczeństwo i codzienność', WYB: 'Wybór' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- baza pytań ----------
  function decodeBank(b64) {
    const bin = atob(b64), key = 'odkryj-austrie';
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    return JSON.parse(new TextDecoder().decode(bytes)).map((r) => {
      let h = 0; for (const ch of r[0]) h += ch.charCodeAt(0);
      return { id: r[0], cat: r[1], diff: r[2], region: r[3], q: r[4], o: r[5], c: (r[6] - (h % 4) + 8) % 4, e: r[7], src: r[8], tags: r[9] };
    });
  }
  // ---------- aktywny kraj ----------
  // C – konfiguracja kraju, MAP – mapa, BANK/QB – pytania, REG – regiony, SPEC – karty specjalne
  let C = null, MAP = null, BANK = [], QB = {}, REG = {}, SPEC = {}, REGIONS = [], CC = null;
  window.OA_DATA = window.OA_DATA || {};
  const loading = {};
  function loadCountry(cc) {
    if (window.OA_DATA[cc]) return Promise.resolve();
    if (!REGISTRY.some((r) => r.code === cc)) return Promise.reject(new Error('nieznany kraj ' + cc));
    if (!loading[cc]) {
      loading[cc] = new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'data/' + cc + '.js?v=' + window.OA_VERSION;
        s.onload = () => (window.OA_DATA[cc] ? res() : rej(new Error('brak danych')));
        s.onerror = () => { delete loading[cc]; s.remove(); rej(new Error('nie udało się wczytać danych kraju')); };
        document.head.appendChild(s);
      });
    }
    return loading[cc];
  }
  function useCountry(cc) {
    if (CC === cc) return;
    const D = window.OA_DATA[cc];
    CC = cc; C = D.country; MAP = D.map;
    REG = {}; C.regions.forEach((r) => { REG[r.id] = Object.assign({ short: (C.regionShort || {})[r.id] || r.name }, r); });
    REGIONS = C.regions.map((r) => r.id);
    SPEC = C.specialCards;
    BANK = D.bank || (D.bank = decodeBank(D.bankData));
    QB = {}; BANK.forEach((q) => { QB[q.id] = q; });
    E.setBank(BANK.map((q) => ({ id: q.id, cat: q.cat, diff: q.diff, region: q.region, correct: q.c })));
    REGION_LABEL = null;
    const root = document.documentElement.style;
    root.setProperty('--red', C.palette.primary);
    C.regions.forEach((r) => root.setProperty('--r-' + r.id, r.color));
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = C.palette.primary;
    document.title = C.gameTitle;
    migrateStats();
  }
  const SK = () => 'stats.' + CC;
  function migrateStats() {
    // starsze wersje trzymały statystyki Austrii pod kluczem „stats”
    const old = store.get('stats', null);
    if (old && CC === 'at' && !store.get('stats.at', null)) { store.set('stats.at', old); store.del('stats'); }
  }
  const countryLogo = (cc) => I.LOGO[cc] || I.LOGO.any;

  // ---------- pamięć ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('oa.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('oa.' + k, JSON.stringify(v)); } catch (e) { /* brak miejsca lub tryb prywatny */ } },
    del(k) { try { localStorage.removeItem('oa.' + k); } catch (e) {} }
  };
  const rid = () => (crypto.getRandomValues(new Uint32Array(2)).join('').slice(0, 14));
  let profile = store.get('profile', null);
  if (!profile) { profile = { id: 'p' + rid(), name: '', vibrate: true, theme: 'auto' }; store.set('profile', profile); }
  function saveProfile() { store.set('profile', profile); applyTheme(); }
  function applyTheme() {
    if (profile.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', profile.theme);
  }
  applyTheme();

  // statystyki odpowiedzi
  function recordAnswer(qid, ok, mode) {
    const st = store.get(SK(), { a: {} });
    const x = st.a[qid] || { n: 0, k: 0 };
    x.n++; if (ok) x.k++; x.l = ok ? 1 : 0; x.t = Date.now(); x.m = mode;
    st.a[qid] = x; store.set(SK(), st);
  }

  // ---------- drobne narzędzia UI ----------
  let handlers = {};
  $app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-click]');
    if (!el || el.disabled) return;
    const fn = handlers[el.dataset.click];
    if (fn) { e.preventDefault(); fn(el.dataset.arg, el, e); }
  });
  function render(html, h) { handlers = h || {}; $app.innerHTML = html; }
  function toast(msg, ms) {
    const box = document.getElementById('toasts');
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
    box.appendChild(t); setTimeout(() => t.remove(), ms || 2600);
  }
  function vibrate(p) { try { if (profile.vibrate && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function top(title, back) {
    return `<div class="top"><button class="iconbtn" data-click="back" aria-label="Wstecz">${I.UI.back}</button><h2>${esc(title)}</h2></div>`;
  }
  const goBack = () => { location.hash = '#/'; };
  function catChip(cat) { return `<span class="cat" style="--cc:var(--c-${cat})">${I.CAT[cat]}${cat} · ${esc(CAT_NAMES[cat])}</span>`; }
  function diffDots(d) { return `<span class="diff" aria-label="Trudność ${d} z 3">${[1, 2, 3].map((i) => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span>`; }
  function modal(html, h) {
    const bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(bg);
    const close = () => bg.remove();
    bg.addEventListener('click', (e) => {
      if (e.target === bg) return close();
      const el = e.target.closest('[data-m]');
      if (el && h[el.dataset.m]) h[el.dataset.m](el.dataset.arg, close, bg);
    });
    return { close, el: bg };
  }

  // ---------- mapa ----------
  let mapUid = 0;
  let REGION_LABEL = null;
  const LABEL_SHIFT = { at: { east: [-40, 0], north: [0, -10] }, cz: { center: [0, 6], moravia: [10, 0] } };
  function regionLabels() {
    if (REGION_LABEL) return REGION_LABEL;
    const pts = {};
    MAP.states.forEach((s) => { (pts[s.region] = pts[s.region] || []).push([s.cx, s.cy]); });
    const out = {};
    Object.entries(pts).forEach(([r, p]) => { out[r] = [p.reduce((a, b) => a + b[0], 0) / p.length, p.reduce((a, b) => a + b[1], 0) / p.length]; });
    Object.entries(LABEL_SHIFT[CC] || {}).forEach(([r, d]) => { if (out[r]) { out[r][0] += d[0]; out[r][1] += d[1]; } });
    return (REGION_LABEL = out);
  }
  /** opts: {cards, target, highlight, progress, full, small, labels, pop:[regions], title} */
  function mapSVG(o) {
    const id = 'm' + (++mapUid);
    const tg = o.target || 2;
    let defs = '';
    REGIONS.forEach((r) => {
      defs += `<pattern id="${id}${r}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="16" height="16" fill="var(--r-${r})" opacity=".28"/><rect width="7" height="16" fill="var(--r-${r})"/></pattern>`;
    });
    const paths = MAP.states.map((s) => {
      const r = s.region;
      let fill = 'var(--r-none)', op = 1;
      if (o.full) fill = `var(--r-${r})`;
      else if (o.highlight) fill = r === o.highlight ? `var(--r-${r})` : 'var(--r-none)';
      else if (o.progress) { fill = `var(--r-${r})`; op = 0.18 + 0.82 * (o.progress[r] || 0); }
      else if (o.cards) { const n = o.cards[r] || 0; fill = n >= tg ? `var(--r-${r})` : n > 0 ? `url(#${id}${r})` : 'var(--r-none)'; }
      const pop = o.pop && o.pop.includes(r) ? ' pop' : '';
      return `<path class="st${pop}" d="${s.d}" fill="${fill}" fill-opacity="${op.toFixed(2)}"><title>${esc(s.name)} (${esc(REG[r].short)})</title></path>`;
    }).join('');
    const L = regionLabels();
    const labels = o.labels ? REGIONS.map((r) => `<text class="reg-label" x="${L[r][0]}" y="${L[r][1] + 14}">${esc(REG[r].short)}</text>`).join('') : '';
    const aria = o.title || 'Mapa ' + C.nameGen;
    return `<div class="map ${o.small ? 'small' : ''}"><svg viewBox="0 0 ${MAP.w} ${MAP.h}" role="img" aria-label="${esc(aria)}"><defs>${defs}</defs>${paths}${labels}</svg></div>`;
  }
  function cardsAria(cards, tg) {
    return REGIONS.map((r) => `${REG[r].short}: ${cards[r]}${cards[r] >= tg ? ' (komplet)' : ''}`).join(', ');
  }

  function regionCard(r, enter) {
    const R = REG[r];
    return `<div class="gcard${enter ? ' enter' : ''}" style="--rc:var(--r-${r})" aria-label="Karta regionu ${esc(R.name)}">
      <div class="art"><svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice">${(I.REGION_ART[CC] || {})[r] || ''}</svg></div>
      <div class="mini">${mapSVG({ highlight: r, small: true })}</div>
      <div class="nm">${esc(R.short)}</div>${R.short !== R.name ? `<div class="desc" style="margin-top:-8px">${esc(R.name)}</div>` : ''}</div>`;
  }
  function specialCard(k, enter) {
    const S = SPEC[k];
    return `<div class="gcard special${enter ? ' enter' : ''}" aria-label="Karta specjalna ${esc(S.name)}">
      <div class="art"><svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">${(I.SPECIAL_ART[CC] || I.SPECIAL_ART.at)[k]}</svg></div>
      <div class="nm" style="padding-top:8px">${esc(S.name)}</div><div class="desc">${esc(S.flavor)}</div></div>`;
  }

  // ---------- trasy ----------
  async function setCountry(cc) {
    try { await loadCountry(cc); } catch (e) { toast('Nie udało się wczytać pytań. Sprawdź internet.', 4000); return false; }
    useCountry(cc); return true;
  }
  async function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [p, a] = h.split('/');
    clearInterval(timerLoop);
    // pokój ustawia kraj sam (gospodarz – z zapisu, gość – z wiadomości gospodarza)
    if (p !== 'room') {
      if (!(await setCountry(profile.country || 'at'))) return;
    }
    if (!profile.name && p !== 'join' && p !== 'settings') return screenWelcome(h);
    switch (p) {
      case 'country': return screenCountry();
      case 'new': return screenNew();
      case 'join': return screenJoin(a);
      case 'room': return enterRoom(a);
      case 'train': return screenTrain(a === 'wrong');
      case 'history': return screenHistory(a);
      case 'rules': return screenRules();
      case 'settings': return screenSettings();
      default: return screenHome();
    }
  }
  window.addEventListener('hashchange', route);

  // ---------- powitanie ----------
  function screenWelcome(next) {
    render(`<div class="hero"><div class="logo">${countryLogo(CC)}</div><h1>${esc(C.gameTitle)}</h1><p>Pojedynek wiedzy o ${esc(C.nameLoc)} na dwa telefony</p></div>
      <div class="hero-map">${mapSVG({ full: true, labels: true })}</div>
      <div class="panel stack"><div class="field"><label for="nm">Jak masz na imię?</label>
      <input id="nm" type="text" maxlength="20" autocomplete="nickname" placeholder="np. Marcin"></div>
      <button class="btn primary" data-click="ok">Dalej</button></div>`, {
      ok: () => {
        const v = document.getElementById('nm').value.trim();
        if (!v) return toast('Wpisz imię');
        profile.name = v.slice(0, 20); saveProfile();
        if (!profile.country && REGISTRY.length > 1) location.hash = '#/country'; else route();
      }
    });
  }

  // ---------- start ----------
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
  function screenHome() {
    const rooms = store.get('rooms', []).slice(0, 3);
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const tipSeen = store.get('tipSeen', false);
    let tip = '';
    if (!standalone && !tipSeen) {
      tip = ios
        ? `<div class="install-tip">Zainstaluj grę: dotknij <b>Udostępnij</b> w Safari, a potem <b>Do ekranu początkowego</b>. <button class="btn small ghost" data-click="tipx">OK</button></div>`
        : `<div class="install-tip">Grę możesz dodać do ekranu głównego jak aplikację. <div class="row" style="margin-top:8px">${deferredInstall ? '<button class="btn small primary" data-click="install">Zainstaluj</button>' : '<span class="small muted">Menu przeglądarki → Zainstaluj aplikację</span>'}<button class="btn small ghost" data-click="tipx">Ukryj</button></div></div>`;
    }
    const resume = rooms.map((r) => `<button class="btn resume" data-click="resume" data-arg="${r.code}">
      <span class="logo-sm">${countryLogo(r.cc || 'at')}</span><span class="grow" style="text-align:left">Wróć do gry<br><span class="small muted">${r.opp ? 'z: ' + esc(r.opp) : 'pokój'} · ${r.code}</span></span></button>`).join('');
    render(`<div class="hero"><div class="logo">${countryLogo(CC)}</div><h1>${esc(C.gameTitle)}</h1><p>Cześć, ${esc(profile.name)}! Zbierz pełną mapę ${esc(C.nameGen)}.</p></div>
      <div class="hero-map">${mapSVG({ full: true, labels: true })}</div>
      <div class="stack">${tip}${resume}
      ${REGISTRY.length > 1 ? `<button class="btn ghost" data-click="go" data-arg="country"><span class="logo-sm">${countryLogo(CC)}</span>Kraj: ${esc(C.name)} · zmień</button>` : ''}
      <div class="menu">
        <button class="btn primary wide" data-click="go" data-arg="new">Nowy pojedynek</button>
        <button class="btn wide" data-click="go" data-arg="join">Dołącz do pojedynku</button>
        <button class="btn" data-click="go" data-arg="train">Trening</button>
        <button class="btn" data-click="go" data-arg="history">Historia</button>
        <button class="btn" data-click="go" data-arg="rules">Zasady</button>
        <button class="btn" data-click="go" data-arg="settings">Ustawienia</button>
      </div></div>`, {
      go: (a) => { location.hash = '#/' + a; },
      resume: (code) => { location.hash = '#/room/' + code; },
      tipx: () => { store.set('tipSeen', true); screenHome(); },
      install: async () => { if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; store.set('tipSeen', true); screenHome(); } }
    });
  }

  // ---------- wybór kraju ----------
  function screenCountry() {
    const items = REGISTRY.map((r) => `<button class="btn country-pick ${r.code === CC ? 'on' : ''}" data-click="pick" data-arg="${r.code}">
      <span class="logo-md">${countryLogo(r.code)}</span><span class="grow" style="text-align:left"><b>${esc(r.gameTitle)}</b><br>
      <span class="small muted">${r.count} pytań · ${esc(r.regions.join(', '))}</span></span>${r.code === CC ? I.UI.check : ''}</button>`).join('');
    render(`${top('Wybierz kraj')}<div class="stack">${items}
      <div class="small muted center">Kolejne kraje to nowe pakiety pytań; zasady gry są wspólne.</div></div>`, {
      back: goBack,
      pick: async (cc) => { profile.country = cc; saveProfile(); if (await setCountry(cc)) goBack(); }
    });
  }

  // ---------- nowy pojedynek ----------
  function screenNew() {
    const rules = Object.assign({}, E.DEFAULT_RULES, store.get('lastRules', {}));
    const sw = (k, t, d) => `<label class="switch"><span><span class="t">${t}</span><br><span class="d">${d}</span></span>
      <span class="tog"><input type="checkbox" data-r="${k}" ${rules[k] ? 'checked' : ''}><span></span></span></label>`;
    const seg = (k, vals, lab) => `<div class="seg" role="group">${vals.map((v) => `<button data-click="seg" data-arg="${k}:${v}" class="${rules[k] === v ? 'on' : ''}">${lab(v)}</button>`).join('')}</div>`;
    render(`${top('Nowy pojedynek')}
      <div class="stack">
      <button class="btn ghost" data-click="country"><span class="logo-sm">${countryLogo(CC)}</span>Gramy: ${esc(C.gameTitle)} · zmień</button>
      <div class="panel stack"><div class="field"><label for="nm">Twoje imię</label><input id="nm" type="text" maxlength="20" value="${esc(profile.name)}"></div></div>
      <div class="panel stack">
        <div class="lbl">Czas na odpowiedź</div>${seg('timeLimit', [15, 25, 40], (v) => v + ' s')}
        <div class="lbl">Ile kart każdego regionu trzeba zebrać</div>${seg('target', [1, 2], (v) => v === 1 ? '1 (krótka gra)' : '2 (zalecane)')}
        <div class="lbl">Gra na czas</div>${seg('timedGame', [0, 10, 15], (v) => v ? v + ' min' : 'wyłączona')}
      </div>
      <div class="panel">
        ${sw('intercepts', 'Przechwyty', 'Gdy gracz w turze się pomyli, a przeciwnik odpowie dobrze, kartę bierze przeciwnik.')}
        ${sw('fifty', 'Koło ratunkowe 50/50', 'Raz na partię usuwa dwie błędne odpowiedzi (tylko na twoim ekranie).')}
        ${sw('specials', 'Karty specjalne', ['luck', 'detour', 'ticket', 'express'].map((k) => SPEC[k].name).join(', ') + '.')}
        ${sw('fortress', 'Twierdza', 'Gracza z 3 skompletowanymi regionami nie można okraść kartą Szczęście.')}
        ${sw('reroute', 'Zmiana trasy', 'Raz na turę możesz pominąć kartę regionu, który już masz.')}
      </div>
      <button class="btn primary" data-click="create">Utwórz pokój</button></div>`, {
      back: goBack,
      seg: (a) => { const [k, v] = a.split(':'); rules[k] = +v; store.set('lastRules', pick(rules)); screenNewKeep(); },
      country: () => { location.hash = '#/country'; },
      create: async () => {
        const nm = document.getElementById('nm').value.trim();
        if (nm) { profile.name = nm.slice(0, 20); saveProfile(); }
        readSwitches(rules);
        store.set('lastRules', pick(rules));
        const code = Net.newCode();
        store.set('host.' + code, { code, country: CC, rules: pick(rules), me: { id: profile.id, name: profile.name }, guest: null, game: null, history: [], seen: {}, pair: { w: [0, 0], d: 0 }, lastLoser: null, created: Date.now() });
        addRoom(code, 'host', null);
        location.hash = '#/room/' + code;
      }
    });
    function screenNewKeep() { readSwitches(rules); store.set('lastRules', pick(rules)); screenNew(); }
  }
  function readSwitches(rules) { document.querySelectorAll('[data-r]').forEach((i) => { rules[i.dataset.r] = i.checked; }); }
  function pick(r) {
    const o = {}; ['timeLimit', 'target', 'timedGame', 'intercepts', 'fifty', 'specials', 'fortress', 'reroute'].forEach((k) => { o[k] = r[k]; });
    return o;
  }
  function addRoom(code, role, opp) {
    let rooms = store.get('rooms', []).filter((r) => r.code !== code);
    rooms.unshift({ code, role, opp, cc: CC, t: Date.now() });
    store.set('rooms', rooms.slice(0, 12));
  }

  // ---------- dołączanie ----------
  function screenJoin(code) {
    code = Net.normCode(code || '');
    render(`${top('Dołącz do pojedynku')}
      <div class="panel stack">
        <div class="field"><label for="cd">Kod pokoju (6 znaków)</label>
        <input id="cd" class="code-input" type="text" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(code)}"></div>
        <div class="field"><label for="nm">Twoje imię</label><input id="nm" type="text" maxlength="20" value="${esc(profile.name)}"></div>
        <button class="btn primary" data-click="join">Dołącz</button>
        <p class="small muted" style="margin:0">Kod pokoju dostaniesz od osoby, która utworzyła pojedynek. Możesz też po prostu otworzyć przesłany link.</p>
      </div>`, {
      back: goBack,
      join: () => {
        const c = Net.normCode(document.getElementById('cd').value);
        const nm = document.getElementById('nm').value.trim();
        if (c.length !== 6) return toast('Kod ma 6 znaków');
        if (!nm) return toast('Wpisz imię');
        profile.name = nm.slice(0, 20); saveProfile();
        if (!store.get('host.' + c)) {
          if (!store.get('guest.' + c)) store.set('guest.' + c, { code: c, joined: Date.now() });
          addRoom(c, 'guest', null);
        }
        location.hash = '#/room/' + c;
      }
    });
    const inp = document.getElementById('cd');
    inp.addEventListener('input', () => { const v = Net.normCode(inp.value); if (v !== inp.value) inp.value = v; });
  }

  // ======================================================================
  //  POKÓJ GRY (gospodarz = sędzia, gość = klient)
  // ======================================================================
  let R = null;
  let timerLoop = null;

  async function enterRoom(code) {
    code = Net.normCode(code);
    const hostData = store.get('host.' + code, null);
    const role = hostData ? 'host' : 'guest';
    // kraj pokoju: gospodarz zna go z zapisu, gość z ostatniej wiadomości (albo czeka na pierwszą)
    const gs = store.get('guest.' + code, {});
    const roomCC = role === 'host' ? (hostData.country || 'at') : ((gs.lobby && gs.lobby.country) || CC || profile.country || 'at');
    if (!(await setCountry(roomCC))) return;
    if (role === 'guest' && !store.get('guest.' + code)) { store.set('guest.' + code, { code, joined: Date.now() }); addRoom(code, 'guest', null); }
    if (!R || R.code !== code) {
      closeRoom();
      R = { code, role, me: role === 'host' ? 0 : 1, seq: 0, lastEv: 0, recorded: new Set(), aids: new Set(), lastGuest: 0, lastHost: 0, viewKey: '', prevCards: null, pubKey: '', rolledAt: 0, lastRoll: 0 };
      if (role === 'host') {
        R.H = hostData; R.H.country = R.H.country || 'at';
        R.lastEv = R.H.game ? R.H.game.evSeq : 0;
      } else {
        const g = store.get('guest.' + code, {});
        R.view = g.lastView || null; R.lobby = g.lobby || null; R.pair = g.pair || null;
        R.lastEv = R.view ? R.view.evSeq : 0;
      }
      renderRoom();
      try {
        R.ch = await Net.RoomChannel.open(code, role, onRoomMsg, () => renderRoomSoft());
      } catch (e) {
        toast('Ta przeglądarka nie obsługuje szyfrowania (wymagany HTTPS).', 5000);
        return;
      }
      if (!R || R.code !== code) return;
      if (role === 'host') {
        R.loop = setInterval(hostTick, 300);
        R.hb = setInterval(() => hostPublish(true), 3000);
      } else {
        const hello = () => R && R.ch && R.ch.send({ t: 'hello', pid: profile.id, name: profile.name });
        hello(); R.hb = setInterval(hello, 3000);
        R.loop = setInterval(() => renderRoomSoft(), 1000);
      }
    }
    renderRoom();
  }
  function closeRoom() {
    if (!R) return;
    clearInterval(R.loop); clearInterval(R.hb);
    if (R.ch) R.ch.close();
    R = null;
  }

  // ---------- gospodarz ----------
  const guestOnline = () => R && Date.now() - R.lastGuest < 10000;
  function hostSave() { store.set('host.' + R.code, R.H); }
  function hostPublish(force) {
    if (!R || !R.ch) return;
    const H = R.H;
    const msg = {
      t: 'state',
      lobby: { code: R.code, country: H.country || 'at', host: H.me.name, guest: H.guest ? H.guest.name : null, guestId: H.guest ? H.guest.id : null, rules: H.rules },
      view: H.game ? E.view(H.game, 1) : null,
      pair: { names: [H.me.name, H.guest ? H.guest.name : ''], w: H.pair.w, d: H.pair.d, n: H.history.length }
    };
    const key = JSON.stringify(msg);
    if (!force && key === R.pubKey) return;
    R.pubKey = key;
    msg.seq = ++R.seq; msg.ts = Date.now();
    R.ch.send(msg, true);
  }
  function hostTick() {
    if (!R || R.role !== 'host') return;
    const H = R.H;
    if (H.game && H.game.phase !== 'OVER') {
      H.game = E.reduce(H.game, { type: 'tick', now: Date.now(), online: [true, guestOnline()] });
    }
    hostAfterChange(false);
  }
  function hostAfterChange(force) {
    const H = R.H;
    if (H.game && H.game.phase === 'OVER' && !H.game.recorded) {
      const g = H.game;
      g.recorded = true;
      H.history.unshift({ t: Date.now(), winner: g.winner, reason: g.overReason, starter: g.starter, turns: g.turnNo,
        score: [0, 1].map((p) => g.hist.filter((x) => x.a[p] === x.c).length), n: g.hist.length, cards: g.players.map((p) => p.cards) });
      H.history = H.history.slice(0, 50);
      if (g.winner === 'draw') H.pair.d++; else H.pair.w[g.winner]++;
      H.lastLoser = g.winner === 0 ? 1 : g.winner === 1 ? 0 : null;
      H.seen = g.seen;
    }
    const v = H.game ? E.view(H.game, 0) : null;
    const key = v ? viewKey(v) : 'lobby:' + (H.guest ? H.guest.name : '') + guestOnline();
    if (key !== R.viewKey || force) {
      hostSave();
      hostPublish(false);
      renderRoom();
    } else {
      renderRoomSoft();
    }
  }
  function hostApply(p, act) {
    const H = R.H;
    if (act.type === 'rematch') {
      if (H.game && H.game.phase !== 'OVER') return;
      hostNewGame();
    } else if (act.type === 'start') {
      if (!H.guest || (H.game && H.game.phase !== 'OVER')) return;
      hostNewGame();
    } else if (H.game) {
      H.game = E.reduce(H.game, Object.assign({}, act, { p }));
    }
    hostAfterChange(true);
  }
  function hostNewGame() {
    const H = R.H;
    H.game = E.createGame({
      seed: crypto.getRandomValues(new Uint32Array(1))[0] || 7,
      players: [{ id: H.me.id, name: H.me.name }, { id: H.guest.id, name: H.guest.name }],
      rules: H.rules, starter: H.lastLoser, seen: H.seen || {}, now: Date.now(), regions: REGIONS
    });
    R.recorded = new Set();
  }

  // ---------- wiadomości ----------
  function onRoomMsg(msg) {
    if (!R) return;
    if (R.role === 'host') {
      const H = R.H;
      if (msg.t === 'hello') {
        if (!H.guest) {
          H.guest = { id: msg.pid, name: String(msg.name || 'Gość').slice(0, 20) };
          hostSave(); addRoom(R.code, 'host', H.guest.name);
          toast(`${H.guest.name} dołącza do pokoju`);
          vibrate(30);
        }
        if (H.guest.id === msg.pid) {
          const was = guestOnline();
          R.lastGuest = Date.now();
          if (msg.name && msg.name !== H.guest.name) { H.guest.name = String(msg.name).slice(0, 20); if (H.game) H.game.players[1].name = H.guest.name; hostSave(); }
          if (!was) hostAfterChange(true); else hostPublish(true);
        }
      } else if (msg.t === 'act') {
        if (!H.guest || msg.pid !== H.guest.id) return;
        R.lastGuest = Date.now();
        if (R.aids.has(msg.aid)) return;
        R.aids.add(msg.aid);
        hostApply(1, msg.act || {});
      }
    } else {
      if (msg.t !== 'state') return;
      // gospodarz gra w innym kraju niż wyświetlany – najpierw wczytaj jego pytania
      if (msg.lobby && msg.lobby.country && msg.lobby.country !== CC) {
        const code = R.code;
        setCountry(msg.lobby.country).then((ok) => { if (ok && R && R.code === code) { R.viewKey = ''; R.prevCards = null; onRoomMsg(msg); } });
        return;
      }
      R.lastHost = Date.now();
      if (msg.seq && R.lastSeq && msg.seq < R.lastSeq && msg.ts && R.lastTs && msg.ts < R.lastTs) return;
      R.lastSeq = msg.seq; R.lastTs = msg.ts;
      R.lobby = msg.lobby; R.pair = msg.pair;
      R.full = !!(msg.lobby && msg.lobby.guestId && msg.lobby.guestId !== profile.id);
      R.view = msg.view; R.viewAt = Date.now();
      if (msg.lobby) addRoom(R.code, 'guest', msg.lobby.host);
      store.set('guest.' + R.code, { code: R.code, lastView: msg.view, lobby: msg.lobby, pair: msg.pair, joined: Date.now() });
      const key = msg.view ? viewKey(msg.view) : 'lobby:' + JSON.stringify(msg.lobby) + R.full;
      if (key !== R.viewKey) renderRoom(); else renderRoomSoft();
    }
  }
  function myAct(act) {
    if (!R) return;
    if (R.role === 'host') return hostApply(0, act);
    const aid = rid();
    const m = { t: 'act', pid: profile.id, aid, act };
    R.ch.send(m);
    setTimeout(() => { if (R && R.ch) R.ch.send(Object.assign({}, m, { mid: undefined })); }, 1200);
  }

  function viewKey(v) {
    const c = Object.assign({}, v); delete c.clock; delete c.deadlineIn; delete c._at;
    return JSON.stringify(c);
  }
  function currentView() {
    if (!R) return null;
    if (R.role === 'host') { if (!R.H.game) return null; const v = E.view(R.H.game, 0); v._at = Date.now(); return v; }
    if (!R.view) return null;
    const v = R.view; v._at = R.viewAt || Date.now(); return v;
  }
  function peerOnline() { return R.role === 'host' ? guestOnline() : Date.now() - R.lastHost < 10000; }

  // ---------- rysowanie pokoju ----------
  function renderRoom() {
    if (!R || !location.hash.startsWith('#/room/')) return;
    const v = currentView();
    if (!v) return renderLobby();
    R.viewKey = viewKey(v);
    renderGame(v);
  }
  function renderRoomSoft() {
    // aktualizacje bez przebudowy ekranu: status połączenia
    if (!R || !location.hash.startsWith('#/room/')) return;
    const on = peerOnline();
    document.querySelectorAll('[data-peer]').forEach((el) => {
      el.className = 'pill ' + (on ? 'on' : 'off');
      el.innerHTML = I.UI.dot + (on ? 'online' : 'offline');
    });
    const net = document.querySelector('[data-net]');
    if (net) { const c = R.ch && R.ch.connected(); net.className = 'pill ' + (c ? 'on' : 'off'); net.innerHTML = I.UI.dot + (c ? 'połączono' : 'łączenie…'); }
    if (!currentView() && R.role === 'host') {
      const btn = document.querySelector('[data-click="start"]');
      if (btn) btn.disabled = !(R.H.guest && guestOnline());
    }
    const w = document.querySelector('[data-hostwait]');
    if (w) w.hidden = on;
  }

  function joinUrl() { return location.origin + location.pathname + '#/join/' + R.code; }

  function renderLobby() {
    const isHost = R.role === 'host';
    const netPill = `<span data-net class="pill">${I.UI.dot}łączenie…</span>`;
    if (isHost) {
      const H = R.H;
      let qrSvg = '';
      try { const q = window.qrcode(0, 'M'); q.addData(joinUrl()); q.make(); qrSvg = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) {}
      const guest = H.guest ? `<div class="row"><b class="grow">${esc(H.guest.name)}</b><span data-peer class="pill">${I.UI.dot}</span></div>` : `<div class="muted">Czekam na drugiego gracza…</div>`;
      render(`${top('Poczekalnia')}
        <div class="stack">
        <div class="panel stack center"><div class="lbl">Kod pokoju</div><div class="bigcode">${R.code}</div>
          <div class="qr">${qrSvg}</div>
          <div class="row"><button class="btn small grow" data-click="share">${I.UI.share}Udostępnij link</button><button class="btn small grow" data-click="copy">${I.UI.copy}Kopiuj</button></div>
          <div class="small muted">Wyślij link drugiej osobie albo pokaż jej kod QR.</div></div>
        <div class="panel stack"><div class="row"><div class="lbl grow">Przeciwnik</div>${netPill}</div>${guest}</div>
        <div class="panel small muted">${rulesSummary(H.rules)}</div>
        <button class="btn primary" data-click="start" ${H.guest && guestOnline() ? '' : 'disabled'}>Rozpocznij grę</button>
        </div>`, {
        back: goBack,
        share: () => shareLink(),
        copy: () => copyText(joinUrl()),
        start: () => myAct({ type: 'start' })
      });
    } else {
      const L = R.lobby;
      const body = R.full
        ? `<div class="panel stack"><b>Ten pokój jest już zajęty.</b><span class="muted">Do pojedynku dołączył inny gracz. Poproś o nowy kod.</span></div>`
        : L ? `<div class="panel stack"><div class="row"><div class="grow"><div class="lbl">Gospodarz</div><b>${esc(L.host)}</b></div><span data-peer class="pill">${I.UI.dot}</span></div>
            <div class="muted">Jesteś w pokoju ${R.code}. Czekaj, aż ${esc(L.host)} rozpocznie grę.</div></div>
            <div class="panel small muted">${rulesSummary(L.rules)}</div>`
          : `<div class="panel stack"><div class="row"><b class="grow">Łączę z pokojem ${R.code}…</b>${netPill}</div>
            <div class="small muted">Jeśli to trwa długo, sprawdź kod albo poproś gospodarza, by otworzył grę na swoim telefonie.</div></div>`;
      render(`${top('Pokój ' + R.code)}<div class="stack">${body}</div>`, { back: goBack });
    }
    renderRoomSoft();
  }
  function rulesSummary(r) {
    if (!r) return '';
    const on = (b) => b ? 'tak' : 'nie';
    return `Czas: ${r.timeLimit} s · karty na region: ${r.target} · przechwyty: ${on(r.intercepts)} · 50/50: ${on(r.fifty)} · karty specjalne: ${on(r.specials)} · twierdza: ${on(r.fortress)} · zmiana trasy: ${on(r.reroute)}${r.timedGame ? ' · gra na czas: ' + r.timedGame + ' min' : ''}`;
  }
  async function shareLink() {
    const url = joinUrl();
    const text = `Zagrajmy w „${C.gameTitle}”! Kod pokoju: ${R.code}`;
    if (navigator.share) { try { await navigator.share({ title: C.gameTitle, text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    copyText(url);
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); toast('Skopiowano'); }
    catch (e) { prompt('Skopiuj:', t); }
  }

  // ---------- ekran gry ----------
  const PHASE_TOTAL = (v) => ({ DUEL: v.rules.timeLimit * 1000, CHOOSE: v.rules.choiceTime * 1000, EXPLAIN: v.rules.explainTime * 1000, SPECIAL: 45000, TRADE: 30000 }[v.phase] || 0);

  function renderGame(v) {
    const me = v.me, op = 1 - me, P = v.players, tg = v.rules.target;
    const myTurn = v.active === me;
    // zdarzenia -> komunikaty
    const fresh = (v.log || []).filter((e) => e.n > R.lastEv);
    if (fresh.length) R.lastEv = Math.max(...fresh.map((e) => e.n));
    fresh.forEach((e) => eventToast(e, v));
    const rolled = fresh.find((e) => e.type === 'roll');
    // animacja odwrócenia tylko dla nowo odsłoniętej karty (nie przy każdym odświeżeniu ekranu)
    const cardKey = v.top ? v.turnNo + ':' + v.evSeq + ':' + JSON.stringify(v.top) : '';
    const topKey = v.top ? v.turnNo + ':' + JSON.stringify(v.top) + ':' + v.deckLeft : '';
    const enter = !!topKey && topKey !== R.lastTopKey;
    R.lastTopKey = topKey; void cardKey;
    // animacja nowej karty na mapie
    const pop = { 0: [], 1: [] };
    if (R.prevCards) [0, 1].forEach((p) => REGIONS.forEach((r) => { if (P[p].cards[r] > R.prevCards[p][r]) pop[p].push(r); }));
    R.prevCards = P.map((p) => Object.assign({}, p.cards));

    const oppBar = `<div class="opp-bar">${mapSVG({ cards: P[op].cards, target: tg, small: true, pop: pop[op], title: 'Mapa przeciwnika: ' + cardsAria(P[op].cards, tg) })}
      <div class="grow"><div class="nm">${esc(P[op].name)}</div>
      <div class="row wrap" style="gap:4px;margin-top:3px"><span data-peer class="pill">${I.UI.dot}</span>${!myTurn && v.phase !== 'OVER' ? '<span class="pill turn">tura przeciwnika</span>' : ''}
      ${P[op].ticket ? `<span class="pill" title="Ma kartę ${esc(SPEC.ticket.name)}">${I.UI.gondola}bilet</span>` : ''}
      <span class="pill">${E.distinct(P[op], tg)}/4 regiony</span></div></div></div>`;
    const counts = REGIONS.map((r) => `<div style="${P[me].cards[r] >= tg ? 'background:color-mix(in srgb,var(--r-' + r + ') 22%,transparent)' : ''}"><b>${P[me].cards[r]}/${tg}</b>${esc(REG[r].short)}</div>`).join('');
    const meBar = `<div class="me-bar"><div class="head"><b class="grow">${esc(P[me].name)} (ty)</b>
      ${myTurn && v.phase !== 'OVER' ? '<span class="pill turn">twoja tura</span>' : ''}
      ${P[me].ticket ? `<span class="pill on">${I.UI.gondola}bilet</span>` : ''}
      ${v.rules.fifty ? `<span class="pill ${P[me].fiftyUsed ? '' : 'on'}">${I.UI.fifty}50/50${P[me].fiftyUsed ? ' użyte' : ''}</span>` : ''}
      <button class="iconbtn" data-click="menu" aria-label="Menu gry">${I.UI.gear}</button></div>
      ${mapSVG({ cards: P[me].cards, target: tg, pop: pop[me], title: 'Twoja mapa: ' + cardsAria(P[me].cards, tg) })}<div class="counts">${counts}</div></div>`;

    let stage = '', h = {
      menu: () => gameMenu(v),
      roll: () => { myAct({ type: 'roll' }); },
      reroute: () => myAct({ type: 'reroute' }),
      choose: (c) => myAct({ type: 'choose', cat: c }),
      ans: (i) => { myAct({ type: 'answer', o: +i, qid: v.q.id }); markChosen(+i); },
      fifty: () => myAct({ type: 'fifty' }),
      next: () => myAct({ type: 'next' }),
      ticket: () => myAct({ type: 'ticket' }),
      special: (r) => myAct({ type: 'special', region: r || null }),
      tradeGo: () => {
        const g = document.querySelector('[data-give].on'), w = document.querySelector('[data-want].on');
        if (!g || !w) return toast('Wybierz oba regiony');
        myAct({ type: 'trade', give: g.dataset.give, want: w.dataset.want });
      },
      tradeSkip: () => myAct({ type: 'skipTrade' }),
      pickGive: (r, el) => { document.querySelectorAll('[data-give]').forEach((x) => x.classList.toggle('on', x === el)); },
      pickWant: (r, el) => { document.querySelectorAll('[data-want]').forEach((x) => x.classList.toggle('on', x === el)); },
      report: (qid) => reportModal(qid),
      rematch: () => myAct({ type: 'rematch' }),
      review: () => { location.hash = '#/history/wrong'; },
      home: goBack,
      src: () => {}
    };
    const timerBar = `<div class="timer ${v.paused ? 'paused' : ''}" data-timer><i style="width:100%"></i></div>`;
    const pausedNote = v.paused && v.phase !== 'OVER' ? `<div class="status-line small" style="color:var(--warn)">Pauza: czekamy na połączenie gracza…</div>` : '';

    switch (v.phase) {
      case 'TURN': {
        const canReroute = myTurn && v.rules.reroute && !v.rerouted && P[me].cards[v.top.r] >= tg;
        stage = `${regionCard(v.top.r, enter)}
          ${myTurn
            ? `<button class="btn primary" data-click="roll">Rzuć kostką</button>
               ${canReroute ? `<button class="btn ghost" data-click="reroute">${I.UI.route}Zmiana trasy (masz już ten region)</button>` : ''}`
            : `<div class="status-line">Tura gracza ${esc(P[op].name)}. Za chwilę rzut kostką…</div>`}
          ${v.extra ? `<div class="status-line small">${esc(SPEC.express.name)}: po tej rundzie jeszcze ${v.extra} dodatkowa runda.</div>` : ''}`;
        break;
      }
      case 'CHOOSE': {
        const iChoose = !myTurn;
        stage = `<div class="die" style="--dc:var(--c-WYB)">${I.CAT.WYB}</div><div class="die-label" style="--dc:var(--c-WYB)">Wybór!</div>${timerBar}
          ${iChoose
            ? `<div class="status-line">Wybierz kategorię pytania dla obu graczy:</div>
               <div class="cat-grid">${CATS.map((c) => `<button class="btn" style="--cc:var(--c-${c})" data-click="choose" data-arg="${c}">${I.CAT[c]}<span>${esc(CAT_NAMES[c])}</span></button>`).join('')}</div>`
            : `<div class="status-line">${esc(P[op].name)} wybiera kategorię…</div>`}`;
        break;
      }
      case 'DUEL': {
        const q = QB[v.q.id];
        const answered = v.myAnswer !== null && v.myAnswer !== undefined;
        const canFifty = v.rules.fifty && !P[me].fiftyUsed && !answered;
        stage = `<div class="qbox">
          <div class="qhead">${catChip(v.q.cat)}<span class="spacer"></span>${diffDots(v.q.diff)}</div>
          ${timerBar}${pausedNote}
          <div class="qtext">${esc(q.q)}</div>
          <div class="answers">${q.o.map((o, i) => `<button class="ans ${v.myAnswer === i ? 'chosen' : ''} ${v.fiftyRm && v.fiftyRm.includes(i) ? 'gone' : ''}" data-click="ans" data-arg="${i}" ${answered ? 'disabled' : ''}>
            <span class="k">${'ABCD'[i]}</span><span class="t">${esc(o)}</span></button>`).join('')}</div>
          <div class="helpers">${canFifty ? `<button class="btn small ghost" data-click="fifty">${I.UI.fifty}50/50</button>` : '<span></span>'}
            <span class="pill ${v.oppAnswered ? 'on' : ''}">${esc(P[op].name)}: ${v.oppAnswered ? 'gotowe' : 'myśli…'}</span></div>
          ${answered ? '<div class="status-line small">Twoja odpowiedź jest zapisana i ukryta przed przeciwnikiem.</div>' : ''}
        </div>`;
        break;
      }
      case 'EXPLAIN': {
        const q = QB[v.q.id], res = v.result;
        if (!R.recorded.has(v.q.id + ':' + v.turnNo)) {
          R.recorded.add(v.q.id + ':' + v.turnNo);
          const ok = v.myAnswer === v.q.correct;
          recordAnswer(v.q.id, ok, 'duel');
          vibrate(ok ? 40 : [80, 60, 80]);
        }
        const rn = REG[res.card].short;
        let cls = 'neutral', txt = 'Nikt nie zdobywa karty. Wraca pod spód stosu.';
        if (res.award === me) { cls = 'good'; txt = res.kind === 'intercept' ? `Przechwyt! Zdobywasz kartę: ${rn}` : res.kind === 'ticket' ? `${SPEC.ticket.name}! Mimo to zdobywasz kartę: ${rn}` : `Zdobywasz kartę: ${rn}`; }
        else if (res.award === op) { cls = 'bad'; txt = res.kind === 'intercept' ? `Przechwyt! ${P[op].name} zabiera kartę: ${rn}` : res.kind === 'ticket' ? `${P[op].name} używa karty „${SPEC.ticket.name}” i bierze kartę: ${rn}` : `${P[op].name} zdobywa kartę: ${rn}`; }
        const canTicket = myTurn && res.award === -1 && P[me].ticket && v.winner === null;
        const ready = v.ready && v.ready[me];
        const srcs = q.src.map((s) => `<a href="${esc(s[0])}" target="_blank" rel="noopener">${esc(s[1])}</a>`).join('');
        stage = `<div class="qbox">
          <div class="qhead">${catChip(v.q.cat)}<span class="spacer"></span>${diffDots(v.q.diff)}</div>
          <div class="result ${cls}">${cls === 'good' ? I.UI.check : cls === 'bad' ? I.UI.x : I.UI.route}<span>${esc(txt)}</span></div>
          <div class="qtext" style="font-size:17px">${esc(q.q)}</div>
          <div class="answers">${q.o.map((o, i) => {
            const c = i === v.q.correct ? 'correct' : (i === v.myAnswer || i === v.oppAnswer) ? 'wrong' : '';
            const tags = (i === v.myAnswer ? '<span class="tag">Ty</span>' : '') + (i === v.oppAnswer ? `<span class="tag">${esc(P[op].name.slice(0, 10))}</span>` : '');
            return `<div class="ans ${c}"><span class="k">${'ABCD'[i]}</span><span class="t">${esc(o)}</span><span class="tags">${tags}</span></div>`;
          }).join('')}</div>
          ${v.myAnswer === -1 ? '<div class="small muted">Brak twojej odpowiedzi w czasie.</div>' : ''}
          <div class="panel expl">${esc(q.e)}<div class="sources" style="margin-top:8px">Źródła: ${srcs}</div></div>
          ${canTicket ? `<button class="btn" data-click="ticket">${I.UI.gondola}Użyj karty „${esc(SPEC.ticket.name)}” i weź kartę</button>` : ''}
          <div class="row"><button class="btn small ghost" data-click="report" data-arg="${q.id}">${I.UI.flag}Zgłoś błąd</button><span class="spacer"></span>
          <button class="btn primary small" style="min-width:140px" data-click="next" ${ready ? 'disabled' : ''}>${ready ? 'Czekam…' : 'Dalej'}</button></div>
          ${timerBar}
        </div>`;
        break;
      }
      case 'SPECIAL': {
        const k = v.top.k, pend = v.pending || { options: [] };
        let info = '';
        if (pend.note === 'fortress') info = `${esc(P[op].name)} jest w twierdzy, więc karta nie działa.`;
        else if (pend.note === 'nothing') info = k === 'luck' ? 'Przeciwnik nie ma żadnej karty, której ci brakuje.' : 'Nie masz kart do oddania.';
        else if (pend.note === 'hasTicket') info = `Masz już kartę „${SPEC.ticket.name}”; ta wraca pod stos.`;
        let actions = '';
        if (myTurn) {
          if (pend.options.length > 1) {
            actions = `<div class="status-line">${k === 'luck' ? 'Wybierz region, który zabierasz:' : 'Wybierz kartę do oddania:'}</div>
              <div class="cat-grid">${pend.options.map((r) => `<button class="btn" style="--cc:var(--r-${r})" data-click="special" data-arg="${r}"><span>${esc(REG[r].short)} (${(k === 'luck' ? P[op] : P[me]).cards[r]})</span></button>`).join('')}</div>`;
          } else {
            const one = pend.options[0];
            const what = one ? (k === 'luck' ? `Zabierasz kartę: ${REG[one].short}.` : `Oddajesz kartę: ${REG[one].short}.`) : '';
            actions = `<div class="status-line">${esc(what || info)}</div><button class="btn primary" data-click="special" data-arg="${one || ''}">OK</button>`;
          }
        } else {
          actions = `<div class="status-line">${esc(P[op].name)} odsłania kartę specjalną${info ? '. ' + esc(info) : '.'}</div>`;
        }
        stage = `${specialCard(k, enter)}${myTurn && info ? `<div class="status-line small">${esc(info)}</div>` : ''}${actions}`;
        break;
      }
      case 'TRADE': {
        const t = v.tradeOpts;
        stage = myTurn
          ? `<div class="panel stack"><b>Wymiana</b><div class="small muted">Masz co najmniej ${tg + 2} karty jednego regionu. Możesz oddać jedną z nich za region, który ${esc(P[op].name)} ma w nadmiarze.</div>
             <div class="lbl">Oddajesz</div><div class="row wrap">${t.give.map((r) => `<button class="btn small" data-give="${r}" data-click="pickGive">${esc(REG[r].short)}</button>`).join('')}</div>
             <div class="lbl">Dostajesz</div><div class="row wrap">${t.want.map((r) => `<button class="btn small" data-want="${r}" data-click="pickWant">${esc(REG[r].short)}</button>`).join('')}</div>
             <div class="row"><button class="btn ghost" data-click="tradeSkip">Pomiń</button><button class="btn primary" data-click="tradeGo">Wymień</button></div></div>`
          : `<div class="status-line">${esc(P[op].name)} może zaproponować wymianę kart…</div>`;
        break;
      }
      case 'OVER': {
        const w = v.winner;
        const hist = v.hist || [];
        const sc = [0, 1].map((p) => hist.filter((x) => x.a[p] === x.c).length);
        const reason = { map: 'pełna mapa ' + C.nameGen + ' zebrana', deck: 'w talii zabrakło kart regionów', time: 'minął czas gry', resign: 'przeciwnik się poddał' }[v.overReason] || '';
        const title = w === 'draw' ? 'Remis!' : w === me ? 'Wygrywasz!' : `Wygrywa ${esc(P[w].name)}`;
        const wrong = hist.filter((x) => x.a[me] !== x.c).length;
        stage = `<div class="win-banner"><h2>${title}</h2><div class="muted">${w === 'draw' ? esc(reason) : (w === me ? 'Brawo: ' : '') + esc(reason)}</div></div>
          ${mapSVG({ cards: w === 'draw' ? P[me].cards : P[w].cards, target: tg, labels: true })}
          <div class="panel stack"><div class="row"><span class="grow">Dobre odpowiedzi: ${esc(P[me].name)}</span><b>${sc[me]}/${hist.length}</b></div>
          <div class="row"><span class="grow">Dobre odpowiedzi: ${esc(P[op].name)}</span><b>${sc[op]}/${hist.length}</b></div>
          ${R.pair || R.H ? `<div class="row small muted"><span class="grow">Bilans pojedynków</span>${pairLine()}</div>` : ''}</div>
          <button class="btn primary" data-click="rematch">Rewanż</button>
          ${wrong ? `<button class="btn" data-click="review">Pytania do powtórki (${wrong})</button>` : ''}
          <button class="btn ghost" data-click="home">Menu główne</button>`;
        if (!R.overShown) { R.overShown = true; vibrate(w === me ? [40, 40, 120] : 60); }
        break;
      }
    }
    if (v.phase !== 'OVER') R.overShown = false;
    const hostWait = R.role === 'guest' ? `<div data-hostwait class="install-tip small" hidden>Brak połączenia z gospodarzem. Gra zatrzymana; wróci, gdy ${esc(P[0].name)} otworzy aplikację.</div>` : '';
    render(`<div class="board">${oppBar}${hostWait}<div class="stage">${stage}</div>${meBar}</div>`, h);
    if (rolled && (v.phase === 'DUEL' || v.phase === 'CHOOSE')) showDie(rolled.face, rolled.p === me ? 'Twój rzut' : `Rzuca: ${P[rolled.p].name}`);
    renderRoomSoft();
    startTimer(v);
  }
  function markChosen(i) {
    document.querySelectorAll('.ans').forEach((b, j) => { b.disabled = true; if (j === i) b.classList.add('chosen'); });
  }
  function pairLine() {
    if (R.role === 'host') { const H = R.H; return `<b>${H.pair.w[0]} : ${H.pair.w[1]}</b>${H.pair.d ? ` (remisy ${H.pair.d})` : ''}`; }
    const p = R.pair; if (!p) return '';
    return `<b>${p.w[1]} : ${p.w[0]}</b>${p.d ? ` (remisy ${p.d})` : ''}`;
  }
  // Animacja rzutu: kostka „toczy się” przez kolejne ścianki, zwalnia i zatrzymuje na wyniku z serwera
  function showDie(face, who) {
    document.querySelectorAll('.die-overlay').forEach((x) => x.remove());
    const d = document.createElement('div');
    d.className = 'modal-bg die-overlay'; d.style.alignItems = 'center'; d.style.background = 'rgba(15,12,10,.82)';
    d.innerHTML = `<div class="die-stage" role="status" aria-live="polite"><div class="who">${esc(who || 'Rzut kostką')}</div>
      <div class="die tumble"></div><div class="die-label"></div></div>`;
    document.body.appendChild(d);
    const die = d.querySelector('.die'), lab = d.querySelector('.die-label');
    const show = (f) => { die.style.setProperty('--dc', `var(--c-${f})`); die.innerHTML = I.CAT[f]; };
    const finish = () => {
      show(face); die.classList.remove('tumble'); die.classList.add('land');
      lab.textContent = CAT_NAMES[face]; lab.style.color = `var(--c-${face})`; lab.classList.add('on');
      vibrate(25);
      setTimeout(() => d.remove(), 900);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    // sekwencja ścianek: coraz dłuższe przerwy (ok. 1,4 s), ostatnia to wynik
    const delays = [70, 70, 80, 80, 90, 100, 110, 130, 150, 180, 220];
    let last = null, i = 0;
    const step = () => {
      if (i >= delays.length) return finish();
      let f; do { f = E.FACES[Math.floor(Math.random() * 6)]; } while (f === last);
      last = f; show(f);
      setTimeout(step, delays[i++]);
    };
    step();
  }
  function startTimer(v) {
    clearInterval(timerLoop);
    const total = PHASE_TOTAL(v);
    if (!total || v.deadlineIn === null || v.deadlineIn === undefined) return;
    const at = v._at, base = v.deadlineIn;
    const tick = () => {
      const el = document.querySelector('[data-timer] i');
      if (!el) return clearInterval(timerLoop);
      const live = currentView();
      const paused = live ? live.paused : v.paused;
      const left = paused ? base : Math.max(0, base - (Date.now() - at));
      el.style.width = Math.min(100, 100 * left / total).toFixed(1) + '%';
      el.parentElement.classList.toggle('paused', !!paused);
      el.parentElement.setAttribute('aria-label', 'Pozostało ' + Math.ceil(left / 1000) + ' s');
    };
    tick(); timerLoop = setInterval(tick, 250);
  }
  function eventToast(e, v) {
    const nm = (p) => (p === v.me ? 'Ty' : v.players[p] ? v.players[p].name : '');
    const rn = (r) => REG[r] ? REG[r].short : '';
    switch (e.type) {
      case 'start': toast(e.p === v.me ? 'Zaczynasz!' : `Zaczyna ${nm(e.p)}`); break;
      case 'reroute': if (e.p !== v.me) toast(`${nm(e.p)}: zmiana trasy`); break;
      case 'luck': toast(e.p === v.me ? `${SPEC.luck.name}: zabierasz kartę ${rn(e.r)}` : `${SPEC.luck.name}: ${nm(e.p)} zabiera ci kartę ${rn(e.r)}`, 3500); break;
      case 'detour': toast(e.p === v.me ? `${SPEC.detour.name}: oddajesz kartę ${rn(e.r)}` : `${SPEC.detour.name}: dostajesz kartę ${rn(e.r)}`, 3500); break;
      case 'ticketGain': toast(e.p === v.me ? `Masz kartę „${SPEC.ticket.name}”!` : `${nm(e.p)} ma kartę „${SPEC.ticket.name}”`); break;
      case 'express': toast(`${SPEC.express.name}: będzie dodatkowa runda!`); break;
      case 'walcRound': toast('Jeszcze jeden takt: dodatkowa runda'); break;
      case 'chosen': if (e.cat === null) toast('Czas minął: kategoria losowa'); break;
      case 'trade': toast(`Wymiana: ${rn(e.give)} za ${rn(e.want)}`, 3500); break;
    }
  }
  function gameMenu(v) {
    const m = modal(`<div class="stack"><b>Menu gry</b>
      <div class="small muted">Pokój ${R.code} · ${rulesSummary(v.rules)}</div>
      <button class="btn" data-m="rules">Zasady</button>
      ${R.role === 'host' ? '<button class="btn" data-m="share">Wyślij link ponownie</button>' : ''}
      ${v.phase !== 'OVER' ? '<button class="btn ghost" data-m="resign">Poddaj się</button>' : ''}
      <button class="btn ghost" data-m="home">Menu główne (gra zostaje zapisana)</button>
      <button class="btn primary" data-m="close">Wróć do gry</button></div>`, {
      close: (a, c) => c(),
      rules: (a, c) => { c(); rulesModal(); },
      share: (a, c) => { c(); shareLink(); },
      resign: (a, c) => { if (confirm('Na pewno się poddajesz? Partia trafi do historii jako wygrana przeciwnika.')) { c(); myAct({ type: 'resign' }); } },
      home: (a, c) => { c(); goBack(); }
    });
    return m;
  }
  function reportModal(qid) {
    const q = QB[qid];
    modal(`<div class="stack"><b>Zgłoś błąd w pytaniu</b><div class="small muted">${esc(q.q)}</div>
      <textarea id="rep" rows="4" placeholder="Co jest nie tak? (np. inna data w źródłach)"></textarea>
      <div class="small muted">Zgłoszenie zapisze się na tym telefonie (Historia → Zgłoszenia), skąd można je skopiować i przesłać.</div>
      <div class="row"><button class="btn ghost" data-m="close">Anuluj</button><button class="btn primary" data-m="save">Zapisz</button></div></div>`, {
      close: (a, c) => c(),
      save: (a, c, bg) => {
        const t = bg.querySelector('#rep').value.trim();
        const reps = store.get('reports', []);
        reps.unshift({ qid, text: t, t: Date.now() });
        store.set('reports', reps.slice(0, 200));
        c(); toast('Zgłoszenie zapisane. Dziękuję!');
      }
    });
  }

  // ======================================================================
  //  TRENING SOLO
  // ======================================================================
  let T = null;
  function mastery() {
    const st = store.get(SK(), { a: {} }).a;
    const reg = {}, cat = {};
    REGIONS.forEach((r) => { reg[r] = [0, 0]; });
    CATS.forEach((c) => { cat[c] = [0, 0]; });
    BANK.forEach((q) => {
      const ok = st[q.id] && st[q.id].l === 1 ? 1 : 0;
      cat[q.cat][0] += ok; cat[q.cat][1]++;
      if (q.region) { reg[q.region][0] += ok; reg[q.region][1]++; }
    });
    return { reg, cat, st };
  }
  function screenTrain(onlyWrong) {
    const cfg = store.get('trainCfg', { cats: CATS.slice(), diff: 0 });
    const ms = mastery();
    const prog = {}; REGIONS.forEach((r) => { prog[r] = ms.reg[r][0] / ms.reg[r][1]; });
    const bars = CATS.map((c) => `<div><div class="row small"><span class="grow">${I.CAT[c].replace('<svg', '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px;color:var(--c-' + c + ')"')} ${esc(CAT_NAMES[c])}</span><span>${ms.cat[c][0]}/${ms.cat[c][1]}</span></div>
      <div class="bar" style="--cc:var(--c-${c})"><i style="width:${(100 * ms.cat[c][0] / ms.cat[c][1]).toFixed(1)}%"></i></div></div>`).join('');
    const wrongN = Object.entries(ms.st).filter(([k, x]) => x.l === 0 && QB[k]).length;
    render(`${top('Trening')}
      <div class="stack">
      <div class="panel"><div class="lbl" style="margin-bottom:6px">Mapa postępu: region zapełnia się, gdy opanowujesz jego pytania</div>
        ${mapSVG({ progress: prog, labels: true })}</div>
      <div class="panel stack"><div class="lbl">Kategorie</div>
        <div class="cat-grid">${CATS.map((c) => `<button class="btn ${cfg.cats.includes(c) ? '' : 'ghost'}" style="--cc:var(--c-${c})" data-click="cat" data-arg="${c}" aria-pressed="${cfg.cats.includes(c)}">${I.CAT[c]}<span>${esc(CAT_NAMES[c])}</span></button>`).join('')}</div>
        <div class="lbl">Poziom</div>
        <div class="seg">${[0, 1, 2, 3].map((d) => `<button data-click="diff" data-arg="${d}" class="${cfg.diff === d ? 'on' : ''}">${d ? ['', 'łatwe', 'średnie', 'trudne'][d] : 'wszystkie'}</button>`).join('')}</div>
        <button class="btn primary" data-click="start">Zacznij trening</button>
        ${wrongN ? `<button class="btn" data-click="wrong">Powtórz pomyłki (${wrongN})</button>` : ''}
      </div>
      <div class="panel stack"><div class="lbl">Opanowane pytania</div>${bars}</div></div>`, {
      back: goBack,
      cat: (c) => { const i = cfg.cats.indexOf(c); if (i >= 0) { if (cfg.cats.length > 1) cfg.cats.splice(i, 1); } else cfg.cats.push(c); store.set('trainCfg', cfg); screenTrain(); },
      diff: (d) => { cfg.diff = +d; store.set('trainCfg', cfg); screenTrain(); },
      start: () => startTraining(cfg, false),
      wrong: () => startTraining(cfg, true)
    });
    if (onlyWrong) startTraining(cfg, true);
  }
  function startTraining(cfg, wrongOnly) {
    const st = store.get(SK(), { a: {} }).a;
    let pool = BANK.filter((q) => cfg.cats.includes(q.cat) && (!cfg.diff || q.diff === cfg.diff));
    if (wrongOnly) pool = BANK.filter((q) => st[q.id] && st[q.id].l === 0);
    if (!pool.length) return toast('Brak pytań dla tych ustawień');
    T = { pool: pool.map((q) => q.id), due: [], n: 0, ok: 0, done: 0, cur: null, picked: null, wrongOnly };
    nextTraining();
  }
  function nextTraining() {
    T.n++;
    const st = store.get(SK(), { a: {} }).a;
    const dueIdx = T.due.findIndex((d) => d.at <= T.n);
    let id;
    if (dueIdx >= 0) { id = T.due[dueIdx].id; T.due.splice(dueIdx, 1); }
    else {
      // najpierw nieopanowane, potem rzadziej widziane
      const cands = T.pool.filter((x) => x !== (T.cur && T.cur.id) && !T.due.some((d) => d.id === x));
      const score = (x) => (st[x] && st[x].l === 1 ? 2 : 0) + (st[x] ? Math.min(st[x].n, 5) * 0.2 : 0) + Math.random() * 0.8;
      cands.sort((a, b) => score(a) - score(b));
      id = cands[0] || T.pool[0];
    }
    T.cur = QB[id]; T.picked = null;
    renderTraining();
  }
  function renderTraining() {
    const q = T.cur, picked = T.picked !== null;
    render(`${top(T.wrongOnly ? 'Powtórka pomyłek' : 'Trening')}
      <div class="qbox">
        <div class="qhead">${catChip(q.cat)}<span class="spacer"></span>${diffDots(q.diff)}</div>
        <div class="small muted">Pytanie ${T.done + (picked ? 0 : 1)} · dobrze: ${T.ok}/${T.done}${T.due.length ? ` · w kolejce powtórek: ${T.due.length}` : ''}</div>
        <div class="qtext">${esc(q.q)}</div>
        <div class="answers">${q.o.map((o, i) => {
          const c = picked ? (i === q.c ? 'correct' : i === T.picked ? 'wrong' : '') : '';
          return `<button class="ans ${c}" data-click="ans" data-arg="${i}" ${picked ? 'disabled' : ''}><span class="k">${'ABCD'[i]}</span><span class="t">${esc(o)}</span></button>`;
        }).join('')}</div>
        ${picked ? `<div class="result ${T.picked === q.c ? 'good' : 'bad'}">${T.picked === q.c ? I.UI.check + '<span>Dobrze!</span>' : I.UI.x + '<span>Niestety nie. To pytanie wróci po 3, 7 i 15 kolejnych.</span>'}</div>
          <div class="panel expl">${esc(q.e)}<div class="sources" style="margin-top:8px">Źródła: ${q.src.map((s) => `<a href="${esc(s[0])}" target="_blank" rel="noopener">${esc(s[1])}</a>`).join('')}</div></div>
          <div class="row"><button class="btn small ghost" data-click="report">${I.UI.flag}Zgłoś błąd</button><span class="spacer"></span><button class="btn small ghost" data-click="end">Zakończ</button><button class="btn primary small" style="min-width:120px" data-click="next">Dalej</button></div>` : ''}
      </div>`, {
      back: () => { T = null; screenTrain(); },
      ans: (i) => {
        if (T.picked !== null) return;
        T.picked = +i; T.done++;
        const ok = T.picked === q.c;
        if (ok) T.ok++;
        else [3, 7, 15].forEach((k) => T.due.push({ id: q.id, at: T.n + k }));
        recordAnswer(q.id, ok, 'train');
        vibrate(ok ? 30 : [70, 50, 70]);
        renderTraining();
      },
      next: () => nextTraining(),
      end: () => { toast(`Wynik: ${T.ok}/${T.done}`); T = null; screenTrain(); },
      report: () => reportModal(q.id)
    });
  }

  // ======================================================================
  //  HISTORIA I STATYSTYKI
  // ======================================================================
  function screenHistory(tab) {
    tab = tab || 'duels';
    const tabs = [['duels', 'Pojedynki'], ['stats', 'Skuteczność'], ['wrong', 'Pomyłki'], ['reports', 'Zgłoszenia']];
    let body = '';
    const h = { back: goBack, tab: (t) => { location.hash = '#/history/' + t; } };
    if (tab === 'duels') {
      const rooms = store.get('rooms', []);
      const items = rooms.map((r) => {
        if (r.role === 'host') {
          const H = store.get('host.' + r.code); if (!H) return '';
          const last = H.history.slice(0, 5).map((g) => `<div class="small muted">${new Date(g.t).toLocaleDateString('pl-PL')} · ${g.winner === 'draw' ? 'remis' : g.winner === 0 ? 'wygrana' : 'przegrana'} · dobre odp. ${g.score[0]}:${g.score[1]} · ${g.turns} tur</div>`).join('');
          return `<div class="item"><div class="row"><b class="grow">${esc(H.guest ? H.guest.name : 'bez przeciwnika')}</b><span>${H.pair.w[0]} : ${H.pair.w[1]}</span></div>
            <div class="small muted">Pokój ${r.code} (gospodarz)</div>${last}${streak(H.history, 0)}
            <div class="row" style="margin-top:8px"><button class="btn small" data-click="open" data-arg="${r.code}">Otwórz</button><button class="btn small ghost" data-click="del" data-arg="${r.code}">Usuń</button></div></div>`;
        }
        const G = store.get('guest.' + r.code, {});
        const p = G.pair;
        return `<div class="item"><div class="row"><b class="grow">${esc(G.lobby ? G.lobby.host : 'pokój ' + r.code)}</b><span>${p ? p.w[1] + ' : ' + p.w[0] : ''}</span></div>
          <div class="small muted">Pokój ${r.code} (gość)${p ? ` · rozegrane: ${p.n}` : ''}</div>
          <div class="row" style="margin-top:8px"><button class="btn small" data-click="open" data-arg="${r.code}">Otwórz</button><button class="btn small ghost" data-click="del" data-arg="${r.code}">Usuń</button></div></div>`;
      }).join('');
      body = items || '<div class="panel muted">Nie rozegrano jeszcze żadnego pojedynku.</div>';
      h.open = (c) => { location.hash = '#/room/' + c; };
      h.del = (c) => {
        if (!confirm('Usunąć ten pokój i jego historię z tego telefonu?')) return;
        if (R && R.code === c) closeRoom();
        store.del('host.' + c); store.del('guest.' + c);
        store.set('rooms', store.get('rooms', []).filter((r) => r.code !== c));
        screenHistory('duels');
      };
    } else if (tab === 'stats') {
      const st = store.get(SK(), { a: {} }).a;
      const agg = (key) => {
        const o = {};
        Object.entries(st).forEach(([id, x]) => { const q = QB[id]; if (!q) return; const k = q[key]; if (!k) return; o[k] = o[k] || [0, 0]; o[k][0] += x.k; o[k][1] += x.n; });
        return o;
      };
      const bc = agg('cat'), br = agg('region');
      const bar = (lab, v, col) => `<div><div class="row small"><span class="grow">${esc(lab)}</span><span>${v ? Math.round(100 * v[0] / v[1]) + '% (' + v[0] + '/' + v[1] + ')' : 'brak'}</span></div>
        <div class="bar" style="--cc:${col}"><i style="width:${v ? (100 * v[0] / v[1]).toFixed(1) : 0}%"></i></div></div>`;
      const total = Object.values(st).reduce((a, x) => [a[0] + x.k, a[1] + x.n], [0, 0]);
      body = `<div class="panel stack"><div class="row"><b class="grow">Wszystkie odpowiedzi</b><span>${total[1] ? Math.round(100 * total[0] / total[1]) : 0}% dobrych (${total[1]})</span></div></div>
        <div class="panel stack"><div class="lbl">Według kategorii</div>${CATS.map((c) => bar(CAT_NAMES[c], bc[c], `var(--c-${c})`)).join('')}</div>
        <div class="panel stack"><div class="lbl">Według regionu (pytania przypisane do regionu)</div>${REGIONS.map((r) => bar(REG[r].short, br[r], `var(--r-${r})`)).join('')}</div>
        <div class="small muted center">Statystyki dotyczą twoich odpowiedzi w pojedynkach i treningu na tym telefonie.</div>`;
    } else if (tab === 'wrong') {
      const st = store.get(SK(), { a: {} }).a;
      const ws = Object.entries(st).filter(([k, x]) => x.l === 0 && QB[k]).sort((a, b) => b[1].t - a[1].t);
      body = ws.length ? `<button class="btn primary" data-click="drill">Powtórz w treningu (${ws.length})</button>` + ws.map(([id]) => {
        const q = QB[id];
        return `<div class="item stack" style="gap:6px">${catChip(q.cat)}<b>${esc(q.q)}</b><div style="color:var(--ok);font-weight:700">${I.UI.check.replace('<svg', '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px"')} ${esc(q.o[q.c])}</div><div class="small muted">${esc(q.e)}</div></div>`;
      }).join('') : '<div class="panel muted">Brak pomyłek do powtórki. Świetnie!</div>';
      h.drill = () => { location.hash = '#/train/wrong'; };
    } else {
      const reps = store.get('reports', []);
      body = reps.length ? `<button class="btn" data-click="copyrep">${I.UI.copy}Kopiuj wszystkie zgłoszenia</button>` + reps.map((r, i) => {
        const q = QB[r.qid];
        return `<div class="item stack" style="gap:4px"><div class="small muted">${new Date(r.t).toLocaleString('pl-PL')} · ${esc(r.qid)}</div><b>${esc(q ? q.q : r.qid)}</b><div>${esc(r.text || '(bez komentarza)')}</div>
          <button class="btn small ghost" data-click="delrep" data-arg="${i}">Usuń</button></div>`;
      }).join('') : '<div class="panel muted">Brak zgłoszeń. Przycisk „Zgłoś błąd” jest pod każdym objaśnieniem.</div>';
      h.copyrep = () => copyText(reps.map((r) => `${r.qid}: ${QB[r.qid] ? QB[r.qid].q : ''}\n> ${r.text}`).join('\n\n'));
      h.delrep = (i) => { reps.splice(+i, 1); store.set('reports', reps); screenHistory('reports'); };
    }
    render(`${top('Historia')}<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${k === tab}" class="${k === tab ? 'on' : ''}" data-click="tab" data-arg="${k}">${l}</button>`).join('')}</div>
      <div class="list">${body}</div>`, h);
  }
  function streak(hist, me) {
    let s = 0; const first = hist[0]; if (!first || first.winner === 'draw') return '';
    for (const g of hist) { if (g.winner === first.winner) s++; else break; }
    return s > 1 ? `<div class="small" style="margin-top:4px">Seria: ${s} ${first.winner === me ? 'wygranych' : 'przegranych'} z rzędu</div>` : '';
  }

  // ======================================================================
  //  ZASADY
  // ======================================================================
  const RULE_SLIDES = [
    { t: () => 'Zbierz mapę ' + C.nameGen, art: () => mapSVG({ full: true, labels: true }), d: () => `${C.name} ${C.verbHas || 'ma'} ${C.unitsCount} ${C.unitsLabel}, które w grze tworzą 4 regiony: ${C.regions.map((r) => r.name).join(', ')}. Wygrywa, kto pierwszy zbierze komplet kart wszystkich regionów (domyślnie po 2 karty każdego).` },
    { t: 'Twoja tura', art: () => regionCard('north'), d: 'Odsłaniasz kartę regionu i rzucasz kostką: 5 kategorii albo Wybór (wtedy kategorię wskazuje przeciwnik). Jeśli masz już ten region, możesz raz na turę użyć Zmiany trasy.' },
    { t: 'Pojedynek', art: () => `<div class="die" style="--dc:var(--c-HIS)">${I.CAT.HIS}</div>`, d: 'Pytanie widzą obaj gracze naraz i obaj odpowiadają. Odpowiesz dobrze w swojej turze: karta jest twoja. Pomylisz się, a przeciwnik trafi: to przechwyt. Po każdym pytaniu jest krótkie objaśnienie.' },
    { t: 'Karty specjalne', art: () => specialCard('ticket'), d: () => `${SPEC.luck.name} zabiera kartę przeciwnikowi, ${SPEC.detour.name} każe oddać kartę, ${SPEC.ticket.name} ratuje po złej odpowiedzi, a ${SPEC.express.name} daje dodatkową rundę. Gracz z 3 kompletnymi regionami jest w twierdzy.` }
  ];
  function screenRules(i) {
    i = i || 0; const s = RULE_SLIDES[i];
    render(`${top('Zasady')}<div class="stack slide">
      <div>${s.art()}</div><h3>${esc(typeof s.t === 'function' ? s.t() : s.t)}</h3><p style="margin:0">${esc(typeof s.d === 'function' ? s.d() : s.d)}</p>
      <div class="dots">${RULE_SLIDES.map((x, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="row"><button class="btn ghost" data-click="prev" ${i === 0 ? 'disabled' : ''}>Wstecz</button>
      <button class="btn primary" data-click="next">${i === RULE_SLIDES.length - 1 ? 'Gotowe' : 'Dalej'}</button></div>
      ${i === RULE_SLIDES.length - 1 ? `<details class="panel small" style="text-align:left"><summary><b>Wszystkie zasady</b></summary>${fullRules()}</details>` : ''}
      </div>`, {
      back: goBack,
      prev: () => screenRules(i - 1),
      next: () => (i === RULE_SLIDES.length - 1 ? goBack() : screenRules(i + 1))
    });
  }
  function rulesModal() {
    modal(`<div class="stack"><b>Zasady w skrócie</b><div class="small">${fullRules()}</div><button class="btn primary" data-m="c">Zamknij</button></div>`, { c: (a, c) => c() });
  }
  const fullRules = () => `<ol style="padding-left:18px;margin:8px 0">
    <li>Gracze wykonują tury na zmianę, ale na każde pytanie odpowiadają obaj, równocześnie i bez podglądania.</li>
    <li>Wynik pytania: gracz w turze dobrze → bierze kartę; gracz w turze źle, przeciwnik dobrze → przechwyt (kartę bierze przeciwnik); obaj źle → karta wraca pod stos.</li>
    <li>Zmiana trasy: raz na turę możesz odłożyć pod stos kartę regionu, który już skompletowałeś.</li>
    <li>Wybór na kostce: kategorię wskazuje przeciwnik w ciągu 10 s, potem losuje gra.</li>
    <li>Wymiana: mając co najmniej o 2 karty więcej niż potrzeba w jednym regionie, możesz na koniec tury wymienić jedną z nich na region, którego ci brakuje, jeśli przeciwnik ma go w nadmiarze.</li>
    <li>Twierdza: gracza z 3 kompletnymi regionami nie dotyczy karta „${esc(SPEC.luck.name)}”.</li>
    <li>Gdy w talii zabraknie kart regionów albo minie czas gry, wygrywa więcej kompletnych regionów, a przy remisie więcej kart.</li>
    <li>Utrata połączenia zatrzymuje zegar. Po 2 minutach nieobecności w trakcie pytania liczy się brak odpowiedzi.</li></ol>`;

  // ======================================================================
  //  USTAWIENIA
  // ======================================================================
  function screenSettings() {
    const sw = (k, t, d) => `<label class="switch"><span><span class="t">${t}</span><br><span class="d">${d}</span></span><span class="tog"><input type="checkbox" data-p="${k}" ${profile[k] ? 'checked' : ''}><span></span></span></label>`;
    render(`${top('Ustawienia')}<div class="stack">
      <div class="panel stack"><div class="field"><label for="nm">Imię w grze</label><input id="nm" type="text" maxlength="20" value="${esc(profile.name)}"></div></div>
      <div class="panel">${sw('vibrate', 'Wibracje', 'Przy dobrej i złej odpowiedzi (Android). iPhone ich nie obsługuje.')}</div>
      <div class="panel stack"><div class="lbl">Motyw</div><div class="seg">${[['auto', 'jak w telefonie'], ['light', 'jasny'], ['dark', 'ciemny']].map(([k, l]) => `<button data-click="theme" data-arg="${k}" class="${profile.theme === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
      <button class="btn primary" data-click="save">Zapisz</button>
      <div class="panel small muted stack">
        <div><b>Jak działa gra online?</b> Telefon osoby, która tworzy pokój, jest sędzią: przechowuje stan gry i rozstrzyga pytania. Wiadomości między telefonami płyną przez darmowe, publiczne przekaźniki MQTT (EMQX, HiveMQ) i są szyfrowane kluczem z kodu pokoju. Nie ma kont ani haseł.</div>
        <div><b>Treść:</b> ${BANK.length} pytań w 5 kategoriach, wersja ${esc(C.contentVersion)}, fakty według stanu na ${esc(C.factsAsOf)}.</div>
        <div><b>Mapa:</b> ${esc(MAP.credit)}</div>
        <div>Ilustracje i pytania: własne. Inspiracją była mechanika kolekcjonowania regionów z gier karcianych; nazwy, teksty i grafika są oryginalne.</div>
      </div>
      <button class="btn ghost" data-click="wipe">Usuń wszystkie dane z tego telefonu</button></div>`, {
      back: goBack,
      theme: (k) => { profile.theme = k; saveProfile(); screenSettingsKeep(); },
      save: () => {
        const nm = document.getElementById('nm').value.trim();
        if (nm) profile.name = nm.slice(0, 20);
        document.querySelectorAll('[data-p]').forEach((i) => { profile[i.dataset.p] = i.checked; });
        saveProfile(); toast('Zapisano'); goBack();
      },
      wipe: () => {
        if (!confirm('Usunąć wszystkie pokoje, historię i statystyki z tego telefonu?')) return;
        closeRoom();
        try { Object.keys(localStorage).filter((k) => k.startsWith('oa.')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
        location.hash = '#/'; location.reload();
      }
    });
    function screenSettingsKeep() {
      const nm = document.getElementById('nm').value.trim(); if (nm) profile.name = nm.slice(0, 20);
      document.querySelectorAll('[data-p]').forEach((i) => { profile[i.dataset.p] = i.checked; });
      saveProfile(); screenSettings();
    }
  }

  // ---------- start ----------
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && R && R.role === 'guest' && R.ch) R.ch.send({ t: 'hello', pid: profile.id, name: profile.name });
    if (document.visibilityState === 'visible' && R) renderRoom();
  });
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  window.__OA = { E, store, get BANK() { return BANK; }, get CC() { return CC; }, get R() { return R; } };
})();
