# Raport balansu (symulacja Monte Carlo)

Wygenerowano: 2026-11-21 · 10000 partii na wariant · silnik `src/engine.js`.

Zasady terytorialne: każda karta to jednostka administracyjna kraju. Wygrana karta zdobywa wolną jednostkę, umacnia własną albo osłabia lub odbiera jednostkę przeciwnika. Bot używa Zmiany trasy przy w pełni umocnionej jednostce i Biletu przy pierwszej okazji. „Tura” = tura jednego gracza.

## Austria: 9 jednostek, 2 karty na jednostkę, wygrana: 7 z 9

| Karty specjalne | Skuteczność A/B | Średnia tur | Mediana | 90. percentyl | Wygrane A | Wygrane rozpoczynającego | Remisy |
|---|---|---|---|---|---|---|---|
| tak | 50/50 | 14.5 | 16 | 18 | 50.4% | 50.8% | 0.0% |
| tak | 60/60 | 13.9 | 15 | 17 | 50.8% | 51.3% | 0.0% |
| tak | 80/50 | 12.8 | 13 | 17 | 80.7% | 50.4% | 0.0% |
| tak | 70/40 | 13.2 | 13 | 17 | 80.5% | 50.9% | 0.0% |
| nie | 50/50 | 22.5 | 23 | 28 | 49.7% | 50.4% | 0.0% |
| nie | 60/60 | 20.3 | 21 | 24 | 49.8% | 50.1% | 0.0% |
| nie | 80/50 | 17.1 | 18 | 22 | 88.1% | 49.2% | 0.0% |
| nie | 70/40 | 18.2 | 19 | 24 | 90.1% | 49.3% | 0.0% |

## Czechy: 14 jednostek, 2 karty na jednostkę, wygrana: 8 z 14

| Karty specjalne | Skuteczność A/B | Średnia tur | Mediana | 90. percentyl | Wygrane A | Wygrane rozpoczynającego | Remisy |
|---|---|---|---|---|---|---|---|
| tak | 50/50 | 17.7 | 17 | 24 | 50.0% | 50.4% | 0.0% |
| tak | 60/60 | 16.6 | 16 | 22 | 50.2% | 50.8% | 0.0% |
| tak | 80/50 | 14.5 | 14 | 20 | 86.3% | 50.6% | 0.0% |
| tak | 70/40 | 15.3 | 15 | 21 | 87.4% | 50.3% | 0.0% |
| nie | 50/50 | 23.7 | 23 | 32 | 49.9% | 50.3% | 0.1% |
| nie | 60/60 | 21.4 | 21 | 28 | 49.9% | 51.0% | 0.1% |
| nie | 80/50 | 17.2 | 17 | 24 | 93.4% | 50.6% | 0.0% |
| nie | 70/40 | 18.4 | 18 | 26 | 94.7% | 50.5% | 0.0% |

## Włochy: 20 jednostek, 1 karta na jednostkę, wygrana: 11 z 20

| Karty specjalne | Skuteczność A/B | Średnia tur | Mediana | 90. percentyl | Wygrane A | Wygrane rozpoczynającego | Remisy |
|---|---|---|---|---|---|---|---|
| tak | 50/50 | 17.2 | 18 | 20 | 48.8% | 51.3% | 2.2% |
| tak | 60/60 | 16.3 | 17 | 19 | 48.2% | 51.1% | 3.5% |
| tak | 80/50 | 14.9 | 15 | 18 | 83.0% | 50.1% | 3.4% |
| tak | 70/40 | 15.5 | 16 | 19 | 83.8% | 50.2% | 1.9% |
| nie | 50/50 | 24.4 | 24 | 29 | 41.3% | 41.4% | 18.4% |
| nie | 60/60 | 22.0 | 22 | 26 | 41.2% | 42.2% | 18.8% |
| nie | 80/50 | 18.1 | 18 | 22 | 93.3% | 47.7% | 4.4% |
| nie | 70/40 | 19.5 | 19 | 24 | 94.2% | 48.0% | 3.8% |

## Cele z rozdz. 8 (z kartami specjalnymi)

| Kraj | Mediana (60/60), cel 16-26 | 80% vs 50%, cel 70-85% | Przewaga rozpoczynającego (60/60), cel < 55% |
|---|---|---|---|
| Austria | 15 ✘ | 80.7% ✔ | 51.3% ✔ |
| Czechy | 16 ✔ | 86.3% ✘ | 50.8% ✔ |
| Włochy | 17 ✔ | 83.0% ✔ | 51.1% ✔ |

## Wnioski

1. **Od 2026-11-21 gra używa prawdziwego podziału administracyjnego** (9 krajów związkowych Austrii, 14 krajów Czech, 20 regionów Włoch) zamiast 4 makroregionów.
2. Liczbę kart na jednostkę i cel dobrano symulacją tak, by partie miały podobną długość mimo różnej liczby jednostek: Austria 2 karty i 7 z 9, Czechy 2 karty i 8 z 14, Włochy 1 karta i 11 z 20.
3. Przy 2 kartach na jednostkę druga karta ją umacnia; przeciwnik musi wtedy wygrać dwie karty, by ją przejąć. To zmniejsza liczbę remisów i nagradza obronę terytorium.
4. W Czechach lepszy gracz wygrywa nieco częściej niż zakłada cel (ok. 86%), a w Austrii mediana (15 tur) jest o jedną turę krótsza od celu; przy 9 jednostkach dłuższa gra wymagałaby celu „cała mapa”. Wyłączenie przechwytów lub wybór celu „cała mapa” to opcje dla tych, którzy wolą więcej losowości lub dłuższą grę.
