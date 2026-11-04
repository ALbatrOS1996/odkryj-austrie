// Testy silnika: node tools/test_engine.js
const assert = require('assert');
const E = require('../src/engine.js');

const bank = [];
E.CATS.forEach((cat) => { for (let i = 0; i < 20; i++) bank.push({ id: `${cat}-${i}`, cat, diff: 1, region: E.REGIONS[i % 4], correct: i % 4 }); });
E.setBank(bank);
const P = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }];
let passed = 0;
function t(name, fn) { try { fn(); passed++; console.log('✔', name); } catch (e) { console.log('✘', name, '\n  ', e.message); process.exitCode = 1; } }
function game(rules, seed) { return E.createGame({ seed: seed || 42, players: P, rules: Object.assign({ specials: false }, rules), starter: 0, now: 0 }); }
// ustawia na wierzchu kartę regionu r w fazie TURN
function forceTop(s, r) { s.top = { t: 'r', r }; s.phase = 'TURN'; s.rerouted = false; return s; }
function duel(s, cat) { s = E.reduce(s, { type: 'roll', p: s.active }); if (s.phase === 'CHOOSE') s = E.reduce(s, { type: 'choose', p: 1 - s.active, cat: cat || 'GEO' }); return s; }
const right = (s) => s.q.correct, wrong = (s) => (s.q.correct + 1) % 4;

t('talia: 64 karty regionów + 12 specjalnych', () => {
  const s = E.createGame({ seed: 1, players: P, rules: {}, now: 0 });
  const all = s.deck.concat(s.top ? [s.top] : []);
  assert.strictEqual(all.length + (s.players[0].ticket ? 1 : 0), 76);
});
t('dobra odpowiedź gracza w turze daje mu kartę', () => {
  let s = forceTop(game(), 'east'); s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: right(s) });
  s = E.reduce(s, { type: 'answer', p: 1, o: right(s) });
  assert.strictEqual(s.players[0].cards.east, 1); assert.strictEqual(s.result.kind, 'active');
});
t('przechwyt: zła odpowiedź w turze, dobra przeciwnika', () => {
  let s = forceTop(game(), 'north'); s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: wrong(s) });
  s = E.reduce(s, { type: 'answer', p: 1, o: right(s) });
  assert.strictEqual(s.players[1].cards.north, 1); assert.strictEqual(s.result.kind, 'intercept');
});
t('przechwyty wyłączone: nikt nie dostaje karty', () => {
  let s = forceTop(game({ intercepts: false }), 'north'); s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: wrong(s) });
  s = E.reduce(s, { type: 'answer', p: 1, o: right(s) });
  assert.strictEqual(s.players[1].cards.north, 0); assert.strictEqual(s.result.award, -1);
});
t('obaj źle: karta wraca pod spód stosu', () => {
  let s = forceTop(game(), 'south'); const n = s.deck.length; s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: wrong(s) });
  s = E.reduce(s, { type: 'answer', p: 1, o: wrong(s) });
  s = E.reduce(s, { type: 'next', p: 0 }); s = E.reduce(s, { type: 'next', p: 1 });
  assert.strictEqual(s.deck.length, n); // jedna zdjęta jako nowa wierzchnia, jedna wróciła
  assert.strictEqual(s.active, 1);
});
t('Bilet: po złej odpowiedzi gracz w turze bierze kartę', () => {
  let s = forceTop(game(), 'west'); s.players[0].ticket = true; s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: wrong(s) });
  s = E.reduce(s, { type: 'answer', p: 1, o: wrong(s) });
  s = E.reduce(s, { type: 'ticket', p: 0 });
  assert.strictEqual(s.players[0].cards.west, 1); assert.strictEqual(s.players[0].ticket, false);
});
t('Zmiana trasy tylko dla skompletowanego regionu, raz na turę', () => {
  let s = forceTop(game(), 'east');
  assert.strictEqual(E.reduce(s, { type: 'reroute', p: 0 }), s); // brak regionu – odrzucone
  s.players[0].cards.east = 2;
  const s2 = E.reduce(s, { type: 'reroute', p: 0 });
  assert.notStrictEqual(s2, s); assert.strictEqual(s2.rerouted, true);
  if (s2.phase === 'TURN') { s2.top = { t: 'r', r: 'east' }; assert.strictEqual(E.reduce(s2, { type: 'reroute', p: 0 }), s2); }
});
t('Tu felix Austria nie działa na gracza w twierdzy', () => {
  let s = forceTop(game(), 'east'); s.players[0].cards = { east: 2, north: 0, south: 0, west: 0 };
  s.players[1].cards = { east: 2, north: 2, south: 2, west: 0 };
  s.deck.unshift({ t: 's', k: 'luck' });
  s = E.reduce(s, { type: 'reroute', p: 0 });
  assert.strictEqual(s.phase, 'SPECIAL'); assert.strictEqual(s.pending.note, 'fortress');
  s = E.reduce(s, { type: 'special', p: 0 });
  assert.deepStrictEqual(s.players[1].cards, { east: 2, north: 2, south: 2, west: 0 });
});
t('Tu felix Austria zabiera brakujący region (bez twierdzy)', () => {
  let s = forceTop(game(), 'east'); s.players[0].cards = { east: 2, north: 0, south: 0, west: 0 };
  s.players[1].cards = { east: 0, north: 1, south: 0, west: 0 };
  s.deck.unshift({ t: 's', k: 'luck' });
  s = E.reduce(s, { type: 'reroute', p: 0 });
  s = E.reduce(s, { type: 'special', p: 0, region: 'north' });
  assert.strictEqual(s.players[0].cards.north, 1); assert.strictEqual(s.players[1].cards.north, 0);
});
t('Lawina: trzeba oddać duplikat', () => {
  let s = game(); s.players[0].cards = { east: 1, north: 3, south: 0, west: 0 };
  s.top = { t: 's', k: 'detour' }; s.phase = 'SPECIAL';
  s = E.reduce(s, { type: 'tick', now: 1, online: [true, true] });
  // wylicz opcje jak silnik
  const v = (function () { const x = JSON.parse(JSON.stringify(s)); return x; })();
  v.pending = { options: ['north'], note: null };
  const out = E.reduce(v, { type: 'special', p: 0, region: 'east' }); // próba oddania niedozwolonej
  assert.strictEqual(out.players[0].cards.north, 2); assert.strictEqual(out.players[0].cards.east, 1);
});
t('50/50 usuwa dwie błędne odpowiedzi tylko dla jednego gracza', () => {
  let s = forceTop(game(), 'east'); s = duel(s);
  s = E.reduce(s, { type: 'fifty', p: 1 });
  assert.strictEqual(s.fiftyRm[1].length, 2); assert.ok(!s.fiftyRm[1].includes(s.q.correct)); assert.strictEqual(s.fiftyRm[0].length, 0);
  assert.strictEqual(E.reduce(s, { type: 'fifty', p: 1 }), s); // drugi raz nie
});
t('widok gracza nie zawiera poprawnej odpowiedzi ani wyboru przeciwnika przed rozstrzygnięciem', () => {
  let s = forceTop(game(), 'east'); s = duel(s);
  s = E.reduce(s, { type: 'answer', p: 0, o: right(s) });
  const v = E.view(s, 1);
  assert.strictEqual(JSON.stringify(v).includes('"correct"'), false);
  assert.strictEqual(v.oppAnswer, undefined); assert.strictEqual(v.oppAnswered, true);
});
t('utrata połączenia zatrzymuje zegar, po 2 min brak odpowiedzi', () => {
  let s = forceTop(game(), 'east'); s = duel(s);
  const d = s.deadline; let now = 0;
  s = E.reduce(s, { type: 'tick', now, online: [true, true] });
  for (let i = 0; i < 60; i++) { now += 1000; s = E.reduce(s, { type: 'tick', now, online: [true, false] }); }
  assert.strictEqual(s.phase, 'DUEL'); assert.ok(s.clock < 1000, 'zegar stoi');
  for (let i = 0; i < 70; i++) { now += 1000; s = E.reduce(s, { type: 'tick', now, online: [true, false] }); }
  assert.ok(s.answers[1] && s.answers[1].o === -1, 'brak odpowiedzi po limicie');
  void d;
});
t('koniec czasu na odpowiedź rozstrzyga pytanie', () => {
  let s = forceTop(game({ timeLimit: 15 }), 'east'); s = duel(s); let now = 0;
  for (let i = 0; i < 40; i++) { now += 500; s = E.reduce(s, { type: 'tick', now, online: [true, true] }); }
  assert.strictEqual(s.phase, 'EXPLAIN'); assert.strictEqual(s.result.award, -1);
});
t('wymiana: oddajesz nadmiar, dostajesz brakujący region', () => {
  let s = forceTop(game(), 'east'); s.players[0].cards = { east: 3, north: 0, south: 2, west: 2 }; s.players[1].cards = { east: 0, north: 3, south: 0, west: 0 };
  s = duel(s); s = E.reduce(s, { type: 'answer', p: 0, o: right(s) }); s = E.reduce(s, { type: 'answer', p: 1, o: wrong(s) });
  s = E.reduce(s, { type: 'next', p: 0 }); s = E.reduce(s, { type: 'next', p: 1 });
  assert.strictEqual(s.phase, 'TRADE');
  s = E.reduce(s, { type: 'trade', p: 0, give: 'east', want: 'north' });
  assert.strictEqual(s.players[0].cards.north, 1); assert.strictEqual(s.players[1].cards.north, 2); assert.strictEqual(s.players[1].cards.east, 1);
});
t('wygrana po skompletowaniu 4 regionów', () => {
  let s = forceTop(game(), 'west'); s.players[0].cards = { east: 2, north: 2, south: 2, west: 1 };
  s = duel(s); s = E.reduce(s, { type: 'answer', p: 0, o: right(s) }); s = E.reduce(s, { type: 'answer', p: 1, o: right(s) });
  assert.strictEqual(s.winner, 0);
  s = E.reduce(s, { type: 'next', p: 0 }); s = E.reduce(s, { type: 'next', p: 1 });
  assert.strictEqual(s.phase, 'OVER');
});
t('pusty stos regionów: wygrywa więcej kompletnych regionów', () => {
  let s = forceTop(game(), 'east'); s.players[0].cards = { east: 1, north: 2, south: 0, west: 0 }; s.players[1].cards = { east: 2, north: 2, south: 1, west: 0 };
  s.deck = [];
  s = duel(s); s = E.reduce(s, { type: 'answer', p: 0, o: right(s) }); s = E.reduce(s, { type: 'answer', p: 1, o: right(s) });
  s = E.reduce(s, { type: 'next', p: 0 }); s = E.reduce(s, { type: 'next', p: 1 });
  assert.strictEqual(s.phase, 'OVER'); assert.strictEqual(s.overReason, 'deck');
  // A: east 2, north 2 = 2 regiony, 4 karty; B: 2 regiony, 5 kart -> wygrywa B
  assert.strictEqual(s.winner, 1);
});
t('poddanie się', () => { const s = E.reduce(game(), { type: 'resign', p: 0 }); assert.strictEqual(s.winner, 1); assert.strictEqual(s.phase, 'OVER'); });
t('ten sam seed = ta sama partia (odtwarzalność)', () => {
  const a = E.createGame({ seed: 777, players: P, rules: {}, now: 0 }), b = E.createGame({ seed: 777, players: P, rules: {}, now: 0 });
  assert.deepStrictEqual(a.deck, b.deck);
});
console.log(`\n${passed} testów zaliczonych`);
