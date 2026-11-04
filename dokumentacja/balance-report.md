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

## Wnioski i korekta parametrów

1. **Zasada z dokumentu v2.0 (1 karta na region) dawała za krótkie partie.** Przy tej samej symulacji (60/60) mediana wynosiła ok. 9 tur, a przewaga rozpoczynającego ok. 55-56%. Zmiana trasy i przechwyty sprawiają, że brakujące regiony zbiera się bardzo szybko.
2. **Korekta: trzeba zebrać po 2 karty każdego regionu** (parametr `target` = 2, pierwsza karta regionu „zapełnia” go do połowy). Mediana rośnie do 17 tur, przewaga rozpoczynającego spada do ok. 51%. Gra z 1 kartą na region pozostaje dostępna w ustawieniach pokoju jako „krótka gra”.
3. **Przewaga lepszego gracza (80/50) wynosi ok. 88%**, czyli trochę powyżej celu 70-85%. Wynika to z przechwytów: lepszy gracz zdobywa karty także w turach przeciwnika. Sprawdzone warianty (więcej kart specjalnych, wyłączona twierdza, mniejsza talia) zmieniały ten wynik najwyżej o 2-3 punkty. Wyłączenie przechwytów daje ok. 80% (w celu), ale wydłuża partię do mediany ok. 22 tur.
4. **Decyzja:** domyślnie przechwyty pozostają włączone (zgodnie z dokumentem), bo to gra o wiedzy dla dwóch dorosłych osób, a lepsza wiedza powinna wygrywać. Kto woli więcej losowości, może wyłączyć przechwyty w ustawieniach pokoju.
