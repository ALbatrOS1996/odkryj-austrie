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

6. **Wiele krajów (2026-11-12).** Silnik nie zna nazw regionów (każda partia dostaje własne id regionów), a treść kraju jest osobnym pakietem `docs/data/<kod>.js`, wczytywanym dopiero po wyborze kraju. Pokój zapamiętuje kraj gospodarza; gość przełącza się na niego automatycznie. Statystyki i pomyłki są liczone osobno dla każdego kraju.
7. **Czechy:** 4 regiony z 14 krajów – Praga i Czechy Środkowe; Czechy Zachodnie i Południowe; Czechy Północne i Wschodnie; Morawy i Śląsk (uzasadnienie w `content-src/cz/country.json`). Karty specjalne: Golem, Defenestracja, Kolejka na Petřín, Polka. Mapa: ČÚZK INSPIRE (CC BY 4.0).
8. Adres strony pozostał `…/odkryj-austrie/`, żeby nie zepsuć zainstalowanej aplikacji; nazwa aplikacji to teraz „Odkryj!”.
9. **Włochy (2026-11-15):** 4 regiony z 20 regionów według makroregionów ISTAT – Północny Zachód, Północny Wschód, Włochy Środkowe, Południe i wyspy (Sud i Isole połączone). Karty specjalne: Fontanna di Trevi, Wezuwiusz, Vespa, Espresso. Mapa: ISTAT (CC BY 4.0) przez openpolis/geojson-italy. Mapa jest „wysoka”, dlatego interfejs ogranicza jej wysokość na ekranie.

10. **Prawdziwy podział administracyjny (2026-11-21).** Karty to już nie 4 makroregiony, tylko jednostki takie jak polskie województwa: 9 krajów związkowych Austrii, 14 krajów Czech, 20 regionów Włoch. Makroregiony zostały jako grupy (kolory mapy, ilustracje kart, zapasowa pula pytań).
   - Wygrywa się, zdobywając określoną liczbę jednostek (w ustawieniach można wybrać „cała mapa”): Austria 7 z 9 (2 karty na jednostkę), Czechy 8 z 14 (2 karty), Włochy 11 z 20 (1 karta). Wartości dobrano symulacją (`balance-report.md`), żeby partie trwały podobnie długo.
   - Jednostka ma jednego właściciela. Wygrana karta zdobywa wolną jednostkę, umacnia własną albo osłabia lub odbiera jednostkę przeciwnika. Karty specjalne przenoszą całe jednostki.
   - Pytania przypisano do jednostek słowami kluczowymi (`tools/units.py`), ze sprawdzeniem zgodności z makroregionem. Gdy jednostka ma mało własnych pytań, gra bierze pytanie z jej makroregionu.
   - Stare, niedokończone partie z podziałem na 4 regiony są po aktualizacji zamykane.

11. **Niderlandy (2026-11-22):** 12 prowincji w 4 makroregionach według landsdelen CBS (NUTS 1): Północ (Groningen, Fryzja, Drenthe), Wschód (Overijssel, Flevoland, Geldria), Zachód (Holandia Północna i Południowa, Utrecht, Zelandia), Południe (Brabancja Północna, Limburgia). Wygrana: 8 z 12, 2 karty na prowincję (7 z 12 dawało za krótkie partie). Karty specjalne: Tulipan, Powódź, Rower, Stroopwafel. Mapa: CBS/PDOK (CC BY 4.0) przez cartomap/nl. 336 pytań, w tym 10 historycznych z wątkiem polskim (m.in. Olędrzy, Tylman z Gameren, Sosabowski, Maczek w Bredzie). Weryfikacja: `kontrola-krzyzowa-nl.md`.

12. **Trening (2026-11-28):** zamiast pytań bez końca trening to seria 15 losowych pytań z wybranych kategorii i poziomu. Na końcu jest ekran z wynikiem (np. 11/15), oceną słowną i listą pomylonych pytań z poprawnymi odpowiedziami. Powtórka pomyłek działa tak samo, na 15 losowych pomyłkach.
13. **Słowacja (2026-11-28):** 8 krajów samorządowych w 4 makroregionach według NUTS 2: Bratysława (kraj bratysławski), Zachód (trnawski, trenczyński, nitrzański), Środek (żyliński, bańskobystrzycki), Wschód (preszowski, koszycki). Przy 8 jednostkach partie z 2 kartami były za krótkie (mediana 8-14 tur), dlatego jako pierwszy kraj ma 3 karty na kraj i cel 7 z 8 (mediana ok. 22 tur). Mapa pokazuje teraz stopniowo poziom umocnienia (1-3 karty). Karty specjalne: Janosik, Lawina, Elektriczka, Kofola. Mapa: ÚGKK SR (Geoportál ZBGIS) przez drakh/slovakia-gps-data. 329 pytań, w tym 11 historycznych z wątkiem polskim (m.in. zastaw spiski 1412, Ścibor ze Ściborzyc, Podoliniec i Lubomirski, insygnia w Starej Lubowli, granice 1920 i 1938). Weryfikacja: `kontrola-krzyzowa-sk.md`.


14. **Słowenia i Niemcy (2026-11-28):** Słowenia: 12 regionów statystycznych (NUTS 3) w grupach Primorska, Lublana i Gorenjska, Dolenjska i Posawie, Styria i Prekmurie; 2 karty, wygrana 8 z 12; 340 pytań. Niemcy: 16 krajów związkowych w grupach Północ, Wschód, Zachód, Południe; 2 karty, wygrana 9 z 16; 354 pytania. Mapy: Eurostat GISCO NUTS 2021 (© EuroGeographics). Symulacja: mediana 17 i 19 tur, lepszy gracz wygrywa ok. 85-88%.
