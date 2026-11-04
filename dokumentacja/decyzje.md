# Decyzje projektowe (odstępstwa od dokumentu v2.0)

1. **Hosting: GitHub Pages zamiast Cloudflare Workers.** Na życzenie autora wszystko jest na GitHubie, bez dodatkowych kont. GitHub Pages serwuje tylko pliki statyczne, więc:
   - **Sędzią jest telefon gospodarza** (osoby, która tworzy pokój). Na nim działa silnik gry, zegar i losowanie; stan partii zapisuje się w jego pamięci (localStorage).
   - **Łączność**: publiczne, darmowe przekaźniki MQTT przez WebSocket (broker.emqx.io i broker.hivemq.com, oba naraz, z odrzucaniem duplikatów). Wiadomości są szyfrowane AES-GCM kluczem z kodu pokoju, a nazwa kanału to skrót kodu.
   - **Konsekwencje:**
     - Gość nigdy nie dostaje poprawnej odpowiedzi ani wyboru przeciwnika przed rozstrzygnięciem (sprawdzone testem).
     - Baza pytań jest jednak w kodzie strony (zaciemniona, ale do odczytania przez kogoś zdeterminowanego). Pliki w repozytorium są publiczne. Przy grze prywatnej to akceptowalne (dokument sam zakłada zaufanie, rozdz. 13.1).
     - Gdy telefon gospodarza zaśnie lub straci zasięg, gra stoi, dopóki gospodarz nie wróci. Stan nie przepada.
     - Bilans par i statystyki są przechowywane na telefonach, a nie na serwerze.
     - Zgłoszenia błędów zapisują się w telefonie (Historia → Zgłoszenia, przycisk „Kopiuj”).
   - Publiczne przekaźniki nie dają gwarancji dostępności. Gdyby kiedyś przestały działać, wystarczy podmienić adresy w `src/net.js`.
2. **Stos:** czysty JavaScript bez Vite/TypeScript/Preact, w stylu twoich pozostałych aplikacji (`src/` + `python build.py` → `docs/`). Silnik (`src/engine.js`) jest wspólny dla aplikacji, testów i symulatora.
3. **Zasada wygranej: 2 karty każdego regionu** (zamiast 1), bo symulacja pokazała za krótkie partie. Szczegóły: `balance-report.md`. Wariant z 1 kartą jest w ustawieniach jako „krótka gra”.
4. **Przydział pytań do kart** odbywa się w chwili rzutu kostką (pytanie z wylosowanej kategorii, dla GEO z regionu karty; rzadziej widziane mają pierwszeństwo), zamiast stałego pliku `cards.json`. Dla graczy efekt jest ten sam, a pytania nie powtarzają się w obrębie partii.
5. **Mapa:** granice krajów związkowych z Statistik Austria (CC BY 4.0, oprac. Flooh Perlot), uproszczone do SVG.
