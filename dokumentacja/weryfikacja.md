# Raport weryfikacji treści

Stan na 2026-11-04 · 351 pytań (ZAB 71, GEO 70, HIS 70, KUL 70, SPO 70) · szczegóły liczbowe: `content/at/stats.json`.

## Co zostało zrobione
1. **Pisanie:** wszystkie pytania napisano od zera, na faktach stabilnych w czasie. Pytań o liczbę ludności i bieżące urzędy unikano; jedyne pytanie zmienne w czasie (s11, długość służby wojskowej) ma flagę `timeSensitive` i datę „stan na”.
2. **Walidacja automatyczna** (`tools/content.py`, uruchamiana przy każdym `python build.py`): 4 odpowiedzi, długości (pytanie ≤160, odpowiedź ≤40, objaśnienie ≤280 znaków), brak pauz, co najmniej 2 źródła, w tym jedno spoza Wikipedii, rozkład trudności (40/40/20%), co najmniej 15% pytań ZAB+GEO na każdy region, epoki HIS (każda ≤35%), 12 pytań polsko-austriackich.
3. **Linki do źródeł:** wszystkie adresy sprawdzono automatycznie. Tytuły Wikipedii sprawdzono przez API Wikipedii, a Britannikę z poziomu przeglądarki. Niedziałające adresy (ok. 50) zastąpiono działającymi, m.in. hasłami z Austria-Forum.
4. **Kontrola krzyżowa:** osobny agent, który nie pisał pytań, sprawdził od zera losowe 25% pytań (90 sztuk, ziarno 20261104). Wynik: 89 OK, 0 błędów, 1 pytanie wątpliwe. Pytanie at-geo-21 przeformułowano zgodnie z sugestią. Raport: `kontrola-krzyzowa.md`.

## Czego NIE zrobiono (uczciwie)
- Nie każde pytanie ma dwa źródła przeczytane przez człowieka lub agenta zdanie po zdaniu. Źródła są adresami, pod którymi fakt można sprawdzić. Część z nich to strony główne instytucji (np. muzeum, urzędu), a nie konkretne podstrony. Status pytań to `checked` (napisane, sprawdzone automatycznie, z linkami), a nie `verified` w pełnym rozumieniu rozdz. 12.
- 75% pytań nie przeszło niezależnej kontroli; w próbce 25% nie znaleziono błędów merytorycznych.
- **Recenzja autora (rozdz. 12.2 pkt 8) jest jeszcze przed tobą:** najlepiej przejrzyj pliki `content-src/*.txt`. W grze pod każdym objaśnieniem jest przycisk „Zgłoś błąd”.

## Pytania odrzucone lub zmienione w trakcie pracy
- Pomysły odrzucone przed zapisaniem jako zbyt niepewne: m.in. najdłuższa rzeka płynąca wyłącznie przez Austrię, liczba tomów w bibliotece w Melku, rekord zwycięstw w skokach (zmienny w czasie), „nigdy niezdobyte” zamki (twierdzenie podawane dla kilku zamków).
- at-his-05: złagodzono informację o tym, która księga „Rozmyślań” powstała w Carnuntum.
- at-geo-21: po kontroli krzyżowej „najdalej na wschód” zmieniono na „północno-wschodni kraniec Alp”.
- at-zab-03: doprecyzowano, że Pummerin w 1945 r. spadła i się roztrzaskała.
