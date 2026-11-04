# Raport balansu (symulacja Monte Carlo)

Wygenerowano: 2026-11-04 · 10000 partii na wariant · silnik `src/engine.js`.

Bot w turze: zawsze używa Zmiany trasy, gdy może; Bilet używa przy pierwszej okazji; wymianę przyjmuje. Skuteczność = prawdopodobieństwo dobrej odpowiedzi. „Tura” = tura jednego gracza.

| Wariant | Skuteczność A/B | Średnia tur | Mediana | 90. percentyl | Wygrane lepszego (A) | Wygrane rozpoczynającego | Remisy/koniec talii |
|---|---|---|---|---|---|---|---|
| przechwyty + specjalne | 50/50 | 18.7 | 19 | 24 | 49.9% | 50.6% | 0.0% |
| przechwyty + specjalne | 60/60 | 17.1 | 17 | 21 | 49.3% | 50.9% | 0.0% |
| przechwyty + specjalne | 80/50 | 15.3 | 15 | 20 | 88.0% | 50.5% | 0.0% |
| przechwyty + specjalne | 70/40 | 16.4 | 16 | 21 | 88.9% | 50.5% | 0.0% |
| przechwyty, bez specjalnych | 50/50 | 21.8 | 22 | 27 | 49.6% | 51.6% | 0.0% |
| przechwyty, bez specjalnych | 60/60 | 19.5 | 19 | 24 | 49.9% | 51.8% | 0.0% |
| przechwyty, bez specjalnych | 80/50 | 17.0 | 17 | 22 | 91.5% | 50.6% | 0.0% |
| przechwyty, bez specjalnych | 70/40 | 18.4 | 18 | 24 | 93.0% | 50.4% | 0.0% |
| bez przechwytów + specjalne | 50/50 | 25.8 | 25 | 34 | 49.7% | 52.1% | 0.0% |
| bez przechwytów + specjalne | 60/60 | 22.4 | 22 | 29 | 49.4% | 52.6% | 0.0% |
| bez przechwytów + specjalne | 80/50 | 20.2 | 20 | 26 | 80.4% | 51.4% | 0.0% |
| bez przechwytów + specjalne | 70/40 | 22.9 | 22 | 30 | 82.3% | 50.7% | 0.0% |
| bez przechwytów i specjalnych | 50/50 | 31.9 | 31 | 41 | 50.6% | 52.0% | 0.0% |
| bez przechwytów i specjalnych | 60/60 | 26.9 | 26 | 34 | 50.3% | 53.1% | 0.0% |
| bez przechwytów i specjalnych | 80/50 | 23.3 | 23 | 30 | 89.8% | 52.0% | 0.0% |
| bez przechwytów i specjalnych | 70/40 | 26.7 | 26 | 35 | 92.3% | 51.0% | 0.0% |

## Cele z rozdz. 8 (wariant domyślny: przechwyty + karty specjalne)

- Mediana partii 16-26 tur (60/60): **17** ✔
- Gracz 80% wygrywa z graczem 50% w 70-85% partii: **88.0%** ✘
- Przewaga rozpoczynającego < 55% (równe pary): **50.9%** ✔
