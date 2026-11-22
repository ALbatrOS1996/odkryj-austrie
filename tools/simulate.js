// Symulator Monte Carlo – używa tego samego silnika co aplikacja.
// node tools/simulate.js [liczba_partii]  -> dokumentacja/balance-report.md
// Zasady terytorialne: każda karta to jednostka administracyjna kraju (kraj związkowy, kraj, region).
const fs = require('fs');
const path = require('path');
const E = require('../src/engine.js');

const N = +process.argv[2] || 10000;
const bank = [];
E.CATS.forEach((cat) => { for (let i = 0; i < 70; i++) bank.push({ id: `${cat}-${i}`, cat, diff: 1, region: null, correct: i % 4 }); });
E.setBank(bank);

const COUNTRIES = ['at', 'cz', 'it', 'nl'].map((cc) => {
  const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content-src', cc, 'country.json'), 'utf8'));
  const map = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content-src', cc, 'map.json'), 'utf8'));
  return { cc, name: cfg.name, units: map.states.map((s) => s.id), g: cfg.gameRules };
});

function play(seed, acc, rules, regions) {
  const s = E.createGame({ seed, players: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], rules, regions, now: 0 });
  let r = seed * 7919 + 1;
  const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
  let guard = 0;
  while (s.phase !== 'OVER' && guard++ < 8000) {
    const a = s.active, o = 1 - a;
    switch (s.phase) {
      case 'TURN':
        if (s.rules.reroute && !s.rerouted && s.players[a].cards[s.top.r] >= s.rules.perRegion) E.step(s, { type: 'reroute', p: a });
        else E.step(s, { type: 'roll', p: a });
        break;
      case 'CHOOSE': E.step(s, { type: 'choose', p: o, cat: E.CATS[Math.floor(rnd() * 5)] }); break;
      case 'DUEL':
        for (const p of [0, 1]) { const c = s.q.correct; E.step(s, { type: 'answer', p, o: rnd() < acc[p] ? c : (c + 1) % 4 }); }
        break;
      case 'EXPLAIN':
        if (s.result.award === -1 && s.players[a].ticket) E.step(s, { type: 'ticket', p: a });
        E.step(s, { type: 'next', p: 0 }); E.step(s, { type: 'next', p: 1 });
        break;
      case 'SPECIAL': {
        // bot: przy Szczęściu zabiera najmocniejszą jednostkę przeciwnika, przy Objeździe oddaje najsłabszą swoją
        const opts = s.pending.options; let best = opts[0];
        const owner = s.top.k === 'luck' ? s.players[o] : s.players[a];
        opts.forEach((x) => { if (s.top.k === 'luck' ? owner.cards[x] > owner.cards[best] : owner.cards[x] < owner.cards[best]) best = x; });
        E.step(s, { type: 'special', p: a, region: best });
        break;
      }
      case 'TRADE': E.step(s, { type: 'skipTrade', p: a }); break;
    }
  }
  return { turns: s.turnNo, winner: s.winner, starter: s.starter, reason: s.overReason };
}

const stats = (arr) => { const a = arr.slice().sort((x, y) => x - y); return { mean: (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1), median: a[Math.floor(a.length / 2)], p90: a[Math.floor(a.length * 0.9)] }; };
const pairs = [[0.5, 0.5], [0.6, 0.6], [0.8, 0.5], [0.7, 0.4]];

let md = `# Raport balansu (symulacja Monte Carlo)\n\nWygenerowano: ${new Date().toISOString().slice(0, 10)} · ${N} partii na wariant · silnik \`src/engine.js\`.\n\n`;
md += 'Zasady terytorialne: każda karta to jednostka administracyjna kraju. Wygrana karta zdobywa wolną jednostkę, umacnia własną albo osłabia lub odbiera jednostkę przeciwnika. Bot używa Zmiany trasy przy w pełni umocnionej jednostce i Biletu przy pierwszej okazji. „Tura” = tura jednego gracza.\n\n';
const goals = [];
for (const c of COUNTRIES) {
  md += `## ${c.name}: ${c.units.length} jednostek, ${c.g.perRegion} ${c.g.perRegion > 1 ? 'karty' : 'karta'} na jednostkę, wygrana: ${c.g.winUnits} z ${c.units.length}\n\n`;
  md += '| Karty specjalne | Skuteczność A/B | Średnia tur | Mediana | 90. percentyl | Wygrane A | Wygrane rozpoczynającego | Remisy |\n|---|---|---|---|---|---|---|---|\n';
  for (const sp of [true, false]) {
    for (const acc of pairs) {
      const rules = { perRegion: c.g.perRegion, target: 1, winUnits: c.g.winUnits, takeover: true, specials: sp };
      const res = []; for (let i = 0; i < N; i++) res.push(play(i + 1, acc, rules, c.units));
      const st = stats(res.map((x) => x.turns));
      const winA = res.filter((x) => x.winner === 0).length / N, winS = res.filter((x) => x.winner === x.starter).length / N, dr = res.filter((x) => x.winner === 'draw').length / N;
      md += `| ${sp ? 'tak' : 'nie'} | ${acc[0] * 100}/${acc[1] * 100} | ${st.mean} | ${st.median} | ${st.p90} | ${(winA * 100).toFixed(1)}% | ${(winS * 100).toFixed(1)}% | ${(dr * 100).toFixed(1)}% |\n`;
      if (sp) goals.push({ c: c.name, acc, st, winA, winS });
    }
  }
  md += '\n';
}
md += '## Cele z rozdz. 8 (z kartami specjalnymi)\n\n| Kraj | Mediana (60/60), cel 16-26 | 80% vs 50%, cel 70-85% | Przewaga rozpoczynającego (60/60), cel < 55% |\n|---|---|---|---|\n';
for (const c of COUNTRIES) {
  const a = goals.find((x) => x.c === c.name && x.acc[0] === 0.6 && x.acc[1] === 0.6), b = goals.find((x) => x.c === c.name && x.acc[0] === 0.8);
  md += `| ${c.name} | ${a.st.median} ${a.st.median >= 16 && a.st.median <= 26 ? '✔' : '✘'} | ${(b.winA * 100).toFixed(1)}% ${b.winA >= 0.7 && b.winA <= 0.85 ? '✔' : '✘'} | ${(a.winS * 100).toFixed(1)}% ${a.winS < 0.55 ? '✔' : '✘'} |\n`;
}
md += `
## Wnioski

1. **Od 2026-11-21 gra używa prawdziwego podziału administracyjnego** (9 krajów związkowych Austrii, 14 krajów Czech, 20 regionów Włoch) zamiast 4 makroregionów.
2. Liczbę kart na jednostkę i cel dobrano symulacją tak, by partie miały podobną długość mimo różnej liczby jednostek: Austria 2 karty i 7 z 9, Czechy 2 karty i 8 z 14, Włochy 1 karta i 11 z 20, Niderlandy (od 2026-11-22) 2 karty i 8 z 12.
3. Przy 2 kartach na jednostkę druga karta ją umacnia; przeciwnik musi wtedy wygrać dwie karty, by ją przejąć. To zmniejsza liczbę remisów i nagradza obronę terytorium.
4. W Czechach lepszy gracz wygrywa nieco częściej niż zakłada cel (ok. 86%), a w Austrii mediana (15 tur) jest o jedną turę krótsza od celu; przy 9 jednostkach dłuższa gra wymagałaby celu „cała mapa”.
5. Dla 12 prowincji Niderlandów cel 7 z 12 dawał za krótkie partie (mediana ok. 13 tur), dlatego wybrano 8 z 12. Wyłączenie przechwytów lub wybór celu „cała mapa” to opcje dla tych, którzy wolą więcej losowości lub dłuższą grę.
`;
fs.mkdirSync(path.join(__dirname, '..', 'dokumentacja'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'dokumentacja', 'balance-report.md'), md);
console.log(md);
