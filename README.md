# Odkryj Austrię!

Prywatna gra quizowa (PWA) dla dwóch osób na dwóch telefonach: pojedynek wiedzy o Austrii. Gracze odpowiadają równocześnie i zbierają karty czterech regionów, aż ktoś złoży pełną mapę kraju.

**Gra:** https://albatros1996.github.io/odkryj-austrie/

## Jak grać
1. Osoba A: **Nowy pojedynek** → **Utwórz pokój** → **Udostępnij link** (albo pokaż kod QR lub 6-znakowy kod).
2. Osoba B otwiera link i wpisuje imię.
3. A dotyka **Rozpocznij grę**. Telefon osoby A jest sędzią: przerwaną grę wznowi się, gdy oba telefony znów otworzą aplikację.
4. Instalacja na ekranie głównym: iPhone (Safari) → Udostępnij → Do ekranu początkowego; Android (Chrome) → menu → Zainstaluj aplikację.

Jest też **Trening** solo (z powtórkami pomyłek po 3, 7 i 15 pytaniach), **Historia** (bilans par, skuteczność, pomyłki, zgłoszenia) i **Zasady**.

## Struktura
- `content-src/*.txt`: pytania (jedna linia = jedno pytanie, poprawna odpowiedź zawsze pierwsza), `country.json`: regiony i karty specjalne
- `src/`: aplikacja (`engine.js` silnik, `net.js` łączność, `app.js` interfejs, `icons.js` grafika)
- `tools/`: walidator treści, symulator Monte Carlo, testy silnika, sprawdzanie linków, generator mapy
- `docs/`: zbudowana gra (GitHub Pages), `content/at/`: dane w JSON, `dokumentacja/`: projekt, raporty i decyzje

## Polecenia
```
python build.py               # walidacja + budowa docs/
node tools/test_engine.js     # testy zasad
node tools/simulate.js 10000  # raport balansu
python tools/check_links.py   # sprawdzenie linków do źródeł
```
