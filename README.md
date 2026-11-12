# Odkryj! (Austria, Czechy…)

Prywatna gra quizowa (PWA) dla dwóch osób na dwóch telefonach: pojedynek wiedzy o wybranym kraju. Na starcie wybiera się kraj (na razie **Austria** – 351 pytań i **Czechy** – 332 pytania). Gracze odpowiadają równocześnie i zbierają karty czterech regionów, aż ktoś złoży pełną mapę kraju.

**Gra:** https://albatros1996.github.io/odkryj-austrie/

## Jak grać
1. Osoba A wybiera kraj (**Kraj: … · zmień**), potem **Nowy pojedynek** → **Utwórz pokój** → **Udostępnij link** (albo pokaż kod QR lub 6-znakowy kod).
2. Osoba B otwiera link i wpisuje imię; jej aplikacja sama przełączy się na kraj gospodarza.
3. A dotyka **Rozpocznij grę**. Telefon osoby A jest sędzią: przerwaną grę wznowi się, gdy oba telefony znów otworzą aplikację.
4. Instalacja na ekranie głównym: iPhone (Safari) → Udostępnij → Do ekranu początkowego; Android (Chrome) → menu → Zainstaluj aplikację.

Jest też **Trening** solo (z powtórkami pomyłek po 3, 7 i 15 pytaniach), **Historia** (bilans par, skuteczność, pomyłki, zgłoszenia) i **Zasady**.

## Struktura
- `content-src/<kraj>/`: pakiet kraju – `zab/geo/his/kul/spo.txt` (jedna linia = jedno pytanie, poprawna odpowiedź zawsze pierwsza), `country.json` (regiony, kolory, karty specjalne), `map.json` (mapa z `tools/geo2svg.py`)
- `src/`: aplikacja (`engine.js` silnik, `net.js` łączność, `app.js` interfejs, `icons.js` grafika)
- `tools/`: walidator treści, symulator Monte Carlo, testy silnika, sprawdzanie linków, generator mapy
- `docs/`: zbudowana gra (GitHub Pages; pytania kraju w `docs/data/<kraj>.js`), `content/<kraj>/`: dane w JSON, `dokumentacja/`: projekt, raporty i decyzje

## Polecenia
```
python build.py               # walidacja + budowa docs/
node tools/test_engine.js     # testy zasad
node tools/simulate.js 10000  # raport balansu
python tools/check_links.py   # sprawdzenie linków do źródeł
```

## Jak dodać kolejny kraj
1. Folder `content-src/<kod>/` z `country.json` (wzór: `cz`), granice jednostek w `tools/` i wpis w `tools/geo2svg.py` → `python tools/geo2svg.py <kod>`.
2. Pięć plików pytań `zab/geo/his/kul/spo.txt` (min. 64 na kategorię); `python tools/content.py <kod>` sprawdza zasady.
3. Ilustracje regionów i kart specjalnych w `src/icons.js` (`REGION_ART`, `SPECIAL_ART`, `LOGO`), kod kraju w `COUNTRIES` w `build.py`.
