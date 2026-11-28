/* Ikony i ilustracje SVG (własne, płaska grafika z konturem). */
(function () {
  'use strict';
  const S = (vb, inner, cls) => `<svg viewBox="${vb}" class="${cls || ''}" aria-hidden="true" focusable="false">${inner}</svg>`;
  const st = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';

  const CAT = {
    // Zabytki: fasada z kolumnami
    ZAB: S('0 0 32 32', `<path ${st} d="M5 12 16 5l11 7M7 12v12M12.5 12v12M19.5 12v12M25 12v12M4 27h24M5 24h22"/>`),
    // Geografia: góry i rzeka
    GEO: S('0 0 32 32', `<path ${st} d="M3 25 12 10l5 8 3-4 9 11zM9 25c3-2 6 0 9-2s5 0 8 0"/>`),
    // Historia: klepsydra
    HIS: S('0 0 32 32', `<path ${st} d="M9 4h14M9 28h14M10 4c0 7 12 7 12 12s-12 5-12 12M22 4c0 7-12 7-12 12s12 5 12 12M13 24h6"/>`),
    // Kultura: nuta
    KUL: S('0 0 32 32', `<path ${st} d="M12 23V7l13-3v16"/><circle cx="9" cy="23" r="3.5" ${st}/><circle cx="22" cy="20" r="3.5" ${st}/>`),
    // Społeczeństwo: filiżanka
    SPO: S('0 0 32 32', `<path ${st} d="M6 13h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7zM22 15h2a3 3 0 0 1 0 6h-2.5M11 5c-1 2 1 3 0 5M16 5c-1 2 1 3 0 5M4 28h20"/>`),
    // Wybór: gwiazda
    WYB: S('0 0 32 32', `<path ${st} d="m16 4 3.6 7.6 8.2 1-6 5.7 1.5 8.2L16 22.6l-7.3 3.9 1.5-8.2-6-5.7 8.2-1z"/>`)
  };

  // Motywy regionów (ilustracje na awersie karty), viewBox 120x90
  const sky = (c) => `<rect width="120" height="90" fill="${c}"/>`;
  const hills = (c) => `<path d="M0 72c20-8 40-10 60-4s40 4 60-2v24H0z" fill="${c}"/>`;
  const REGION_ART = {
    // Wschód: katedra św. Szczepana i diabelski młyn
    east: `${sky('var(--art-sky)')}<circle cx="88" cy="46" r="20" fill="none" stroke="var(--art-ink)" stroke-width="2"/>
      <g stroke="var(--art-ink)" stroke-width="1.2"><path d="M88 26v40M68 46h40M74 32l28 28M102 32 74 60"/></g>
      <path d="M80 80 88 66l8 14" fill="none" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M30 80V44l6-30 6 30v36z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M18 80V56l12-6 12 6v24z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M22 62h16M22 70h16" stroke="var(--art-ink)" stroke-width="1.4"/>${hills('var(--art-green)')}`,
    // Północ: twierdza na wzgórzu i jezioro
    north: `${sky('var(--art-sky)')}<path d="M10 66 40 34l30 32z" fill="var(--art-green2)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M28 40V26h6v4h6v-4h6v4h4v10z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M36 26v-8l3 3" fill="none" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M60 66 86 28l30 38z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="m80 37 6-9 6 9-3 3-3-3-3 3z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.4"/>
      <rect y="66" width="120" height="24" fill="var(--art-lake)"/><path d="M14 74h20M50 80h26M88 74h18" stroke="#fff" stroke-width="1.6" opacity=".8"/>`,
    // Południe: wieża zegarowa w Grazu i jezioro
    south: `${sky('var(--art-sky)')}<path d="M0 70c18-14 34-18 52-12s30 2 68-8v40H0z" fill="var(--art-green2)"/>
      <path d="M46 70V36h20v34z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M42 36 56 20l14 16z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>
      <circle cx="56" cy="47" r="6" fill="#fff" stroke="var(--art-ink)" stroke-width="1.6"/><path d="M56 47v-4M56 47h3" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M50 70v-10h12v10" fill="var(--art-ink)" opacity=".25"/>
      <rect y="76" width="120" height="14" fill="var(--art-lake)"/><circle cx="98" cy="20" r="8" fill="var(--art-sun)"/>`,
    // Zachód: Alpy i Złoty Dach
    west: `${sky('var(--art-sky)')}<path d="M0 60 26 22l18 24 16-30 22 30 14-14 24 28v30H0z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="m20 31 6-9 6 8-3 3-3-3-3 3zM54 26l6-10 6 10-3 2-3-3-3 3z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.2"/>
      <path d="M34 90V64h52v26z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M48 64V52h24v12z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M44 52 60 40l16 12z" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 46h20M47 49h26" stroke="var(--art-ink)" stroke-width="1"/>
      <path d="M40 74h8M54 74h12M72 74h8" stroke="var(--art-ink)" stroke-width="2"/>`
  };

  // Karty specjalne, viewBox 120x120
  const SPECIAL_ART = {
    luck: `<rect width="120" height="120" fill="var(--sp-luck-bg)"/>
      <circle cx="48" cy="62" r="20" fill="none" stroke="var(--art-gold)" stroke-width="7"/>
      <circle cx="72" cy="62" r="20" fill="none" stroke="var(--art-gold)" stroke-width="7"/>
      <circle cx="48" cy="62" r="20" fill="none" stroke="var(--art-ink)" stroke-width="1.5"/>
      <circle cx="72" cy="62" r="20" fill="none" stroke="var(--art-ink)" stroke-width="1.5"/>
      <path d="M60 30c-4-8-16-6-14 3 1 5 14 11 14 11s13-6 14-11c2-9-10-11-14-3z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    detour: `<rect width="120" height="120" fill="var(--sp-detour-bg)"/>
      <path d="M8 104 54 22l58 82z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="m44 40 10-18 14 22c-6 4-10-2-14 2s-6-2-10-6z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M62 52c10 6 6 16 18 20s4 18 20 22H58c-8-8 8-14-4-22s4-14 8-20z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.6"/>
      <circle cx="74" cy="66" r="4" fill="#fff" stroke="var(--art-ink)"/><circle cx="90" cy="86" r="5" fill="#fff" stroke="var(--art-ink)"/>`,
    ticket: `<rect width="120" height="120" fill="var(--sp-ticket-bg)"/>
      <path d="M0 26 120 12" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M60 19v18" stroke="var(--art-ink)" stroke-width="3"/>
      <rect x="36" y="37" width="48" height="40" rx="8" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <rect x="42" y="44" width="16" height="14" rx="2" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.4"/>
      <rect x="62" y="44" width="16" height="14" rx="2" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M0 120 30 84l18 18 24-34 48 52z" fill="var(--art-green2)" stroke="var(--art-ink)" stroke-width="2"/>`,
    express: `<rect width="120" height="120" fill="var(--sp-express-bg)"/>
      <path d="M44 86V30l40-10v54" fill="none" stroke="var(--art-ink)" stroke-width="4" stroke-linecap="round"/>
      <path d="M44 42 84 32" stroke="var(--art-ink)" stroke-width="4"/>
      <ellipse cx="36" cy="86" rx="10" ry="8" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>
      <ellipse cx="76" cy="76" rx="10" ry="8" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M14 104c20-10 30 6 50-4s30 4 46-6" fill="none" stroke="var(--art-red)" stroke-width="3" stroke-linecap="round"/>`
  };

  const UI = {
    back: S('0 0 24 24', `<path ${st} d="M15 5l-7 7 7 7"/>`),
    share: S('0 0 24 24', `<path ${st} d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5"/>`),
    copy: S('0 0 24 24', `<rect x="8" y="8" width="12" height="12" rx="2" ${st}/><path ${st} d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>`),
    flag: S('0 0 24 24', `<path ${st} d="M5 21V4M5 4h11l-2 4 2 4H5"/>`),
    gondola: S('0 0 24 24', `<path ${st} d="M2 5l20-3M12 4v4"/><rect x="6" y="8" width="12" height="10" rx="2" ${st}/><path ${st} d="M9 11h2M13 11h2"/>`),
    fifty: S('0 0 24 24', `<circle cx="12" cy="12" r="9" ${st}/><path ${st} d="M12 3v18"/>`),
    check: S('0 0 24 24', `<path ${st} d="M5 12l5 5 9-10"/>`),
    x: S('0 0 24 24', `<path ${st} d="M6 6l12 12M18 6 6 18"/>`),
    dot: S('0 0 10 10', '<circle cx="5" cy="5" r="4" fill="currentColor"/>'),
    route: S('0 0 24 24', `<path ${st} d="M4 7h11a4 4 0 0 1 0 8H8M8 15l3-3M8 15l3 3"/>`),
    gear: S('0 0 24 24', `<circle cx="12" cy="12" r="3" ${st}/><path ${st} d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>`)
  };


  // ---------- Czechy ----------
  const REGION_ART_CZ = {
    // Praga: Hradczany ze strzelistą katedrą nad mostem
    center: `${sky('var(--art-sky)')}<path d="M0 58c16-10 30-12 46-10s30 2 74-6v18H0z" fill="var(--art-green2)"/>
      <path d="M18 54V40h60v14z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M22 46h6M34 46h6M46 46h6M58 46h6" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M62 40V22l5-12 5 12v18z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 40V28l4-10 4 10v12z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M86 54V30l6-6 6 6v24z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M85 30h14" stroke="var(--art-ink)" stroke-width="2"/>
      <rect y="64" width="120" height="26" fill="var(--art-lake)"/>
      <path d="M0 66h120v6H0z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M6 72a8 8 0 0 1 16 0M28 72a8 8 0 0 1 16 0M50 72a8 8 0 0 1 16 0M72 72a8 8 0 0 1 16 0M94 72a8 8 0 0 1 16 0" fill="var(--art-lake)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M10 64v-6M114 64v-8" stroke="var(--art-ink)" stroke-width="2"/>`,
    // Zachód i Południe: wieża zamkowa w Czeskim Krumlowie nad zakolem rzeki
    west: `${sky('var(--art-sky)')}<path d="M0 60c20-10 38-12 60-6s40 2 60-4v40H0z" fill="var(--art-green2)"/>
      <path d="M0 78c26-10 46 6 70-2s34-8 50-2v16H0z" fill="var(--art-lake)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M50 66V30h20v36z" fill="var(--art-sun)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M48 30h24v-6H48z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M52 24c0-6 4-8 8-14 4 6 8 8 8 14z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M60 10V4" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M54 36h4M62 36h4M54 46h4M62 46h4" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M20 66V52h22v14zM78 66V50h24v16z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M18 52l13-8 13 8zM76 50l14-9 14 9z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>`,
    // Północ: Śnieżka z obserwatorium i skalne miasto
    north: `${sky('var(--art-sky)')}<path d="M0 62 30 40l20 8 22-26 30 22 18-8v26z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M66 26h12v-4H66z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M64 22h16l-3-5H67z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M0 62h120v28H0z" fill="var(--art-green2)"/>
      <path d="M14 90V62c0-6 8-6 8 0v28zM28 90V56c0-7 9-7 9 0v34zM44 90V66c0-5 7-5 7 0v24zM88 90V58c0-7 9-7 9 0v32zM102 90V66c0-5 8-5 8 0v24z" fill="var(--art-sun)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M58 90l6-14 6 14z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    // Morawy: winnice na wzgórzach i kapliczka
    moravia: `${sky('var(--art-sky)')}<circle cx="98" cy="18" r="8" fill="var(--art-sun)"/>
      <path d="M0 50c22-14 48-18 70-8s34 6 50 0v48H0z" fill="var(--art-green2)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M6 60c20-10 40-12 60-4M4 70c22-10 46-10 70-2M2 80c24-8 50-8 76 0M70 52c14 4 30 2 48-4M76 64c14 2 28 0 42-6M82 76c12 2 24 0 36-4" fill="none" stroke="var(--art-green)" stroke-width="3" stroke-dasharray="4 3"/>
      <path d="M48 42V26h12v16z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M46 26l8-8 8 8z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M54 18v-6M51 14h6" stroke="var(--art-ink)" stroke-width="1.8"/>
      <circle cx="30" cy="66" r="3" fill="#6B2A6B"/><circle cx="34" cy="69" r="3" fill="#6B2A6B"/><circle cx="30" cy="72" r="3" fill="#6B2A6B"/>`
  };
  const SPECIAL_ART_CZ = {
    // Golem: gliniana postać ze znakiem na czole
    luck: `<rect width="120" height="120" fill="var(--sp-luck-bg)"/>
      <path d="M40 108V70l-10 8-6-6 14-22h44l14 22-6 6-10-8v38z" fill="#A9876A" stroke="var(--art-ink)" stroke-width="2.2"/>
      <rect x="42" y="18" width="36" height="34" rx="8" fill="#A9876A" stroke="var(--art-ink)" stroke-width="2.2"/>
      <circle cx="53" cy="36" r="3" fill="var(--art-ink)"/><circle cx="67" cy="36" r="3" fill="var(--art-ink)"/>
      <path d="M52 45h16" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 26h20" stroke="var(--art-gold)" stroke-width="3"/>
      <path d="M58 108V86M62 108V86" stroke="var(--art-ink)" stroke-width="2"/>`,
    // Defenestracja: otwarte okno i wylatujące karty
    detour: `<rect width="120" height="120" fill="var(--sp-detour-bg)"/>
      <rect x="18" y="20" width="50" height="80" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <rect x="28" y="34" width="30" height="40" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M43 34v40M28 54h30" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M58 34l16-8v56l-16-8z" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="2"/>
      <rect x="76" y="40" width="16" height="22" rx="2" transform="rotate(25 84 51)" fill="#fff" stroke="var(--art-ink)" stroke-width="1.8"/>
      <rect x="88" y="66" width="16" height="22" rx="2" transform="rotate(-20 96 77)" fill="#fff" stroke="var(--art-ink)" stroke-width="1.8"/>
      <rect x="74" y="86" width="16" height="22" rx="2" transform="rotate(50 82 97)" fill="#fff" stroke="var(--art-ink)" stroke-width="1.8"/>`,
    // Kolejka na Petřín: wagonik na stromym zboczu
    ticket: `<rect width="120" height="120" fill="var(--sp-ticket-bg)"/>
      <path d="M0 116 120 24v96H0z" fill="var(--art-green2)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M0 108 120 16" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M44 74 84 43v-22l-40 31z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <path d="M50 58l8-6v8l-8 6zM64 47l8-6v8l-8 6z" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.4"/>
      <circle cx="52" cy="76" r="4" fill="var(--art-ink)"/><circle cx="78" cy="56" r="4" fill="var(--art-ink)"/>`,
    // Polka: akordeon i nuty
    express: `<rect width="120" height="120" fill="var(--sp-express-bg)"/>
      <rect x="24" y="44" width="72" height="44" rx="6" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <path d="M36 44v44M46 44v44M56 44v44M66 44v44M76 44v44M86 44v44" stroke="var(--art-ink)" stroke-width="1.4" opacity=".6"/>
      <rect x="14" y="40" width="14" height="52" rx="3" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <rect x="92" y="40" width="14" height="52" rx="3" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M40 30V12l22-5v18" fill="none" stroke="var(--art-ink)" stroke-width="3"/>
      <ellipse cx="35" cy="30" rx="6" ry="5" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <ellipse cx="57" cy="25" rx="6" ry="5" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="1.8"/>`
  };


  // ---------- Włochy ----------
  const REGION_ART_IT = {
    // Północny Zachód: katedra w Mediolanie na tle Alp
    nw: `${sky('var(--art-sky)')}<path d="M0 50 22 26l14 14 20-24 22 22 16-12 26 24v10H0z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M16 31l6-5 6 6-3 2-3-2-3 2zM50 22l6-6 6 7-3 2-3-2-3 2z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.1"/>
      <path d="M20 84V50h80v34z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M20 50l40-14 40 14z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M24 50V38M32 46V34M40 43V30M48 40V27M60 36V14M72 40V27M80 43V30M88 46V34M96 50V38" stroke="var(--art-ink)" stroke-width="2"/>
      <circle cx="60" cy="12" r="2.5" fill="var(--art-gold)" stroke="var(--art-ink)"/>
      <path d="M52 84V64a8 8 0 0 1 16 0v20M30 84V68a5 5 0 0 1 10 0v16M80 84V68a5 5 0 0 1 10 0v16" fill="var(--art-ink)" opacity=".3"/>`,
    // Północny Wschód: Wenecja, kanał i gondola
    ne: `${sky('var(--art-sky)')}<path d="M0 62V34h18v-8h14v8h14V22l6-8 6 8v12h16v-6h14v6h14v-4h18v42z" fill="var(--art-sun)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M8 44h6M24 44h6M40 44h6M66 44h6M82 44h6M98 44h6M8 54h6M40 54h6M82 54h6M98 54h6" stroke="var(--art-ink)" stroke-width="2"/>
      <rect y="62" width="120" height="28" fill="var(--art-lake)"/>
      <path d="M8 70h22M60 82h30M96 70h18" stroke="#fff" stroke-width="1.4" opacity=".7"/>
      <path d="M24 76c10 6 50 6 62-2l4-6c-2 8-6 12-12 14H34c-6 0-10-3-10-6z" fill="var(--art-ink)"/>
      <path d="M90 68l4-4" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M70 76l8-30" stroke="var(--art-ink)" stroke-width="1.8"/>
      <circle cx="68" cy="66" r="3" fill="var(--art-red)" stroke="var(--art-ink)"/><path d="M68 69v7" stroke="var(--art-ink)" stroke-width="2"/>`,
    // Centrum: Koloseum
    center: `${sky('var(--art-sky)')}<circle cx="96" cy="18" r="8" fill="var(--art-sun)"/>
      <path d="M8 80V36c20-8 84-8 104 0v44z" fill="#E3C79C" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M8 50c20-6 84-6 104 0M8 64c20-5 84-5 104 0" fill="none" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M16 50v-9M28 48v-10M40 47v-10M52 46v-10M64 46v-10M76 46v-10M88 47v-10M100 48v-10" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M14 62v-7a3 3 0 0 1 6 0v7M26 61v-8a3 3 0 0 1 6 0v8M38 60v-8a3 3 0 0 1 6 0v8M50 60v-8a3 3 0 0 1 6 0v8M62 60v-8a3 3 0 0 1 6 0v8M74 60v-8a3 3 0 0 1 6 0v8M86 60v-8a3 3 0 0 1 6 0v8M98 61v-8a3 3 0 0 1 6 0v8" fill="var(--art-ink)" opacity=".35"/>
      <path d="M14 80v-9a3 3 0 0 1 6 0v9M26 80v-9a3 3 0 0 1 6 0v9M38 80v-9a3 3 0 0 1 6 0v9M50 80v-9a3 3 0 0 1 6 0v9M62 80v-9a3 3 0 0 1 6 0v9M74 80v-9a3 3 0 0 1 6 0v9M86 80v-9a3 3 0 0 1 6 0v9M98 80v-9a3 3 0 0 1 6 0v9" fill="var(--art-ink)" opacity=".35"/>
      <rect y="80" width="120" height="10" fill="var(--art-green2)"/>`,
    // Południe: Zatoka Neapolitańska z Wezuwiuszem i piniami
    south: `${sky('var(--art-sky)')}<path d="M20 62 54 22h14l34 40z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M56 22c-2-6 2-10 6-8 2-6 10-4 9 2 4 0 4 6 0 6z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.2" opacity=".9"/>
      <rect y="62" width="120" height="28" fill="var(--art-lake)"/>
      <path d="M6 70h20M44 80h30M92 72h20" stroke="#fff" stroke-width="1.4" opacity=".7"/>
      <path d="M100 90V60" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M86 60c4-8 24-8 28 0-8 3-20 3-28 0z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M0 90V74c10-4 20-4 30 0v16z" fill="var(--art-sun)" stroke="var(--art-ink)" stroke-width="1.6"/>`
  };
  const SPECIAL_ART_IT = {
    // Fontanna di Trevi: misa i moneta
    luck: `<rect width="120" height="120" fill="var(--sp-luck-bg)"/>
      <path d="M14 80h92v14c0 8-20 14-46 14S14 102 14 94z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <ellipse cx="60" cy="80" rx="46" ry="10" fill="var(--art-lake)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M60 78V44M60 44c-10 0-16 10-18 22M60 44c10 0 16 10 18 22" fill="none" stroke="var(--art-lake)" stroke-width="3"/>
      <circle cx="84" cy="30" r="11" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M80 30h8M84 26v8" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M74 40l-8 12" stroke="var(--art-ink)" stroke-width="1.4" stroke-dasharray="3 3"/>`,
    // Wezuwiusz: wybuch
    detour: `<rect width="120" height="120" fill="var(--sp-detour-bg)"/>
      <path d="M6 112 48 52h24l42 60z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M48 52l6 10 6-8 6 8 6-10" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M52 50c-12-4-14-18-2-20-2-12 14-16 18-6 10-4 18 6 10 14 8 6 0 16-8 12" fill="#777" stroke="var(--art-ink)" stroke-width="1.6" opacity=".9"/>
      <circle cx="36" cy="38" r="4" fill="var(--art-red)" stroke="var(--art-ink)"/><circle cx="86" cy="30" r="3" fill="var(--art-red)" stroke="var(--art-ink)"/><circle cx="92" cy="50" r="3" fill="var(--art-red)" stroke="var(--art-ink)"/>
      <path d="M54 62c-4 14 2 22-6 34M66 62c4 12-2 22 6 34" stroke="var(--art-red)" stroke-width="3" fill="none"/>`,
    // Vespa
    ticket: `<rect width="120" height="120" fill="var(--sp-ticket-bg)"/>
      <circle cx="30" cy="88" r="12" fill="var(--art-ink)"/><circle cx="30" cy="88" r="5" fill="var(--art-stone)"/>
      <circle cx="92" cy="88" r="12" fill="var(--art-ink)"/><circle cx="92" cy="88" r="5" fill="var(--art-stone)"/>
      <path d="M22 84c0-16 14-24 30-24h14c4 0 6 4 6 8v8h14c8 0 14 4 14 12H44c-8 0-10-4-22-4z" fill="#7FC8C0" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M78 70 86 34h10" fill="none" stroke="var(--art-ink)" stroke-width="3"/>
      <path d="M40 58h22v-6H40z" fill="var(--art-ink)"/>
      <circle cx="92" cy="40" r="4" fill="var(--art-gold)" stroke="var(--art-ink)"/>`,
    // Espresso
    express: `<rect width="120" height="120" fill="var(--sp-express-bg)"/>
      <ellipse cx="60" cy="96" rx="40" ry="8" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M34 58h52l-6 32c-1 4-6 6-20 6s-19-2-20-6z" fill="#fff" stroke="var(--art-ink)" stroke-width="2.2"/>
      <path d="M86 64c10 0 12 14 0 16" fill="none" stroke="var(--art-ink)" stroke-width="3"/>
      <ellipse cx="60" cy="58" rx="26" ry="5" fill="#6B3E1F" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M48 46c-4-6 4-10 0-16M60 44c-4-6 4-10 0-16M72 46c-4-6 4-10 0-16" fill="none" stroke="var(--art-ink)" stroke-width="2" opacity=".6"/>`
  };

  const REGION_ART_NL = {
    // Północ: Morze Wattowe, latarnia i wydmy
    north: `${sky('var(--art-sky)')}<path d="M0 62c14-8 30-10 44-4s30 4 40-2 24-6 36 0v34H0z" fill="var(--art-sun)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <rect y="70" width="120" height="20" fill="var(--art-lake)"/>
      <path d="M8 78h20M50 84h26M90 76h20" stroke="#fff" stroke-width="1.4" opacity=".7"/>
      <path d="M84 62V24h12v38z" fill="#fff" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M84 34h12M84 46h12" stroke="var(--art-red)" stroke-width="5"/>
      <path d="M82 24h16l-8-8z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M96 20l18-6M96 22l18 4" stroke="var(--art-gold)" stroke-width="2" opacity=".8"/>
      <path d="M14 60c4-10 8-14 10-14M30 58c2-8 6-12 8-12" stroke="var(--art-green)" stroke-width="2" fill="none"/>`,
    // Wschód: wrzosowiska Veluwe, sosny i jeleń
    east: `${sky('var(--art-sky)')}<circle cx="24" cy="18" r="8" fill="var(--art-sun)"/>
      <path d="M0 60c20-8 40-8 60-2s40 4 60-2v34H0z" fill="#B27BB0" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M0 76c30-6 60-6 120 0v14H0z" fill="var(--art-green2)"/>
      <path d="M88 62V40M100 64V34M76 64V46" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M80 44c0-10 16-10 16 0-4 4-12 4-16 0zM90 38c0-12 20-12 20 0-5 4-15 4-20 0zM68 50c0-8 14-8 14 0-4 3-10 3-14 0z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M30 70l4-12h14l4 12M34 58c-4-6-8-8-10-12M48 58c4-6 8-8 10-12M28 48l-4-4M56 48l4-4" fill="none" stroke="var(--art-ink)" stroke-width="2.2"/>
      <ellipse cx="41" cy="58" rx="10" ry="5" fill="#9A6A3E" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    // Zachód: wiatrak i pole tulipanów
    west: `${sky('var(--art-sky)')}<rect y="66" width="120" height="24" fill="var(--art-green2)"/>
      <path d="M0 70h120M0 76h120M0 82h120" stroke="var(--art-red)" stroke-width="3.5" stroke-dasharray="4 3"/>
      <path d="M0 73h120M0 79h120M0 85h120" stroke="var(--art-gold)" stroke-width="3" stroke-dasharray="3 4" opacity=".9"/>
      <path d="M48 66l4-34h16l4 34z" fill="#9A6A3E" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 32l10-8 10 8z" fill="var(--art-ink)"/>
      <path d="M60 30 34 8M60 30l26-22M60 30 34 52M60 30l26 22" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M36 10l8-4 14 18-6 4zM84 10l-8-4-14 18 6 4zM36 50l8 4 14-18-6-4zM84 50l-8 4-14-18 6-4z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.2"/>
      <circle cx="60" cy="30" r="3" fill="var(--art-gold)" stroke="var(--art-ink)"/>
      <path d="M56 66v-10a4 4 0 0 1 8 0v10z" fill="var(--art-ink)" opacity=".4"/>`,
    // Południe: Maastricht nad Mozą, most i wieża kościoła
    south: `${sky('var(--art-sky)')}<path d="M0 58c20-10 40-12 60-8s40 2 60-6v18H0z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M70 58V24l6-10 6 10v34z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M66 58V36h24v22zM20 58V42h18v16zM40 58V38h20v20z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M20 42l9-8 9 8M40 38l10-8 10 8" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <rect y="62" width="120" height="28" fill="var(--art-lake)"/>
      <path d="M0 62h120v6H0z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M4 68a10 10 0 0 1 20 0M28 68a10 10 0 0 1 20 0M52 68a10 10 0 0 1 20 0M76 68a10 10 0 0 1 20 0M100 68a10 10 0 0 1 20 0" fill="var(--art-ink)" opacity=".35"/>
      <path d="M10 80h20M60 84h30" stroke="#fff" stroke-width="1.4" opacity=".7"/>`
  };
  const SPECIAL_ART_NL = {
    // Tulipan
    luck: `<rect width="120" height="120" fill="var(--sp-luck-bg)"/>
      <path d="M60 106V58" stroke="var(--art-green)" stroke-width="5"/>
      <path d="M60 92c-14-2-24-12-26-26 12 2 22 10 26 20zM60 84c12-2 20-10 22-22-10 2-18 8-22 16z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M40 30c0 20 8 30 20 30s20-10 20-30l-8 8-6-14-6 12-6-12-6 14z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <circle cx="92" cy="22" r="9" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M88 22h8M92 18v8" stroke="var(--art-ink)" stroke-width="1.5"/>`,
    // Powódź: przerwana grobla
    detour: `<rect width="120" height="120" fill="var(--sp-detour-bg)"/>
      <path d="M0 58h120v52H0z" fill="var(--art-lake)"/>
      <path d="M0 56c10-6 20 6 30 0s20 6 30 0 20 6 30 0 20 6 30 0" fill="none" stroke="#fff" stroke-width="2.5"/>
      <path d="M0 76 40 62h10l-6 48H0zM120 76 80 62H70l6 48h44z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 62c4 14 2 30-4 48h28c-6-18-8-34-4-48z" fill="var(--art-lake)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M54 76c4 4 8 4 12 0M52 92c6 4 10 4 16 0" stroke="#fff" stroke-width="2" fill="none"/>
      <path d="M20 40l6-12 6 12zM92 34l6-12 6 12z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    // Rower
    ticket: `<rect width="120" height="120" fill="var(--sp-ticket-bg)"/>
      <circle cx="30" cy="80" r="18" fill="none" stroke="var(--art-ink)" stroke-width="4"/>
      <circle cx="90" cy="80" r="18" fill="none" stroke="var(--art-ink)" stroke-width="4"/>
      <path d="M30 80 48 52h32L90 80M48 52l14 28 18-28M62 80H30M44 44h12M80 52l-4-12h10" fill="none" stroke="var(--art-red)" stroke-width="4" stroke-linejoin="round"/>
      <path d="M66 46h20v10H66z" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    // Stroopwafel
    express: `<rect width="120" height="120" fill="var(--sp-express-bg)"/>
      <ellipse cx="60" cy="72" rx="42" ry="16" fill="#B5772F" stroke="var(--art-ink)" stroke-width="2"/>
      <ellipse cx="60" cy="64" rx="42" ry="16" fill="#D9A156" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M30 56l40 20M44 50l40 20M24 66l30 14M58 48l26 12M36 74l24-26M52 78l24-26M70 76l16-18M30 64l18-18" stroke="#9A6A3E" stroke-width="1.6"/>
      <path d="M20 68c10 6 70 6 80 0" fill="none" stroke="#6B3E1F" stroke-width="3"/>
      <path d="M46 34c-4-6 4-10 0-16M60 32c-4-6 4-10 0-16M74 34c-4-6 4-10 0-16" fill="none" stroke="var(--art-ink)" stroke-width="2" opacity=".5"/>`
  };

  const REGION_ART_SK = {
    // Bratysława: zamek z czterema wieżami nad Dunajem
    bratislava: `${sky('var(--art-sky)')}<path d="M0 64c20-8 40-14 60-14s40 6 60 14v26H0z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M34 54V30h52v24z" fill="#fff" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M30 34V18h10v16zM80 34V18h10v16zM30 56V40h10v16zM80 56V40h10v16z" fill="#fff" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M28 18l7-8 7 8zM78 18l7-8 7 8z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M44 40h6M56 40h6M68 40h6M44 48h6M56 48h6M68 48h6" stroke="var(--art-ink)" stroke-width="2"/>
      <rect y="70" width="120" height="20" fill="var(--art-lake)"/>
      <path d="M8 78h20M54 84h26M94 78h18" stroke="#fff" stroke-width="1.4" opacity=".7"/>`,
    // Zachód: zamek w Trenczynie na skale
    west: `${sky('var(--art-sky)')}<circle cx="98" cy="18" r="8" fill="var(--art-sun)"/>
      <path d="M0 90V70c14-10 28-26 44-30s30 8 40 18 24 12 36 12v20z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M40 42V20h12v22zM56 44V30h26v14z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M38 20l2-4h12l2 4M40 16h4v-4h4v4h4" fill="none" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M56 30l13-8 13 8z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M45 28v6M62 36h4M72 36h4" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M0 84c30-4 60 2 120-4v10H0z" fill="var(--art-lake)" opacity=".85"/>`,
    // Środek: drewniane chaty Vlkolínca pod Wielką Fatrą
    center: `${sky('var(--art-sky)')}<path d="M0 60 30 26l20 18 22-26 48 42v30H0z" fill="var(--art-green2)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M66 24l6-6 6 6-3 2-3-2-3 2z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.1"/>
      <path d="M14 86V66h26v20zM52 86V62h28v24zM90 86V68h22v18z" fill="#9A6A3E" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M12 66l15-12 15 12zM50 62l16-14 16 14zM88 68l13-11 13 11z" fill="#6B4A2B" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M20 74h6M58 70h6M68 70h6M96 76h6" stroke="#fff" stroke-width="2.5"/>
      <rect x="62" y="40" width="8" height="12" fill="#9A6A3E" stroke="var(--art-ink)" stroke-width="1.4"/>`,
    // Wschód: Tatry z Łomnicą i Spiski Zamek
    east: `${sky('var(--art-sky)')}<path d="M0 54 22 26l12 12 18-28 16 20 12-12 40 36v6H0z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M46 18l6-8 6 10-4 2-3-3-3 3zM16 34l6-8 6 8-3 2-3-2-3 2z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.1"/>
      <path d="M0 90V70c20-6 40-12 60-12s40 6 60 12v20z" fill="var(--art-green)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <path d="M58 64V48h8v-6h10v6h14v16z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.8"/>
      <path d="M66 42l5-6 5 6" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M62 54h4M78 54h4M84 54h4" stroke="var(--art-ink)" stroke-width="2"/>`
  };
  const SPECIAL_ART_SK = {
    // Janosik: kapelusz z piórkiem i ciupaga
    luck: `<rect width="120" height="120" fill="var(--sp-luck-bg)"/>
      <path d="M78 22 34 100" stroke="#9A6A3E" stroke-width="5" stroke-linecap="round"/>
      <path d="M74 16c10-2 18 4 16 12l-10-2-8 8c-4-8-4-16 2-18z" fill="var(--art-stone)" stroke="var(--art-ink)" stroke-width="2"/>
      <ellipse cx="54" cy="70" rx="34" ry="8" fill="var(--art-ink)"/>
      <path d="M34 68c0-16 8-24 20-24s20 8 20 24z" fill="var(--art-ink)"/>
      <path d="M36 64h36" stroke="var(--art-red)" stroke-width="4"/>
      <path d="M70 50c8-10 16-16 24-18-4 8-12 14-22 20z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.6"/>
      <circle cx="92" cy="88" r="9" fill="var(--art-gold)" stroke="var(--art-ink)" stroke-width="2"/>`,
    // Lawina
    detour: `<rect width="120" height="120" fill="var(--sp-detour-bg)"/>
      <path d="M4 110 44 30l20 26 14-18 38 72z" fill="var(--art-rock)" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M44 30l-8 16 10 4 8-8z" fill="#fff" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M48 52c-6 10-4 20-14 28-6 6-4 16 6 18 12 2 18-8 26-14 10-8 20-6 26-16-14-2-26-8-34-16z" fill="#fff" stroke="var(--art-ink)" stroke-width="2"/>
      <circle cx="40" cy="96" r="5" fill="#fff" stroke="var(--art-ink)" stroke-width="1.4"/><circle cx="58" cy="100" r="4" fill="#fff" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M86 30l6-10 6 10z" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="1.6"/>`,
    // Elektriczka: tatrzański tramwaj
    ticket: `<rect width="120" height="120" fill="var(--sp-ticket-bg)"/>
      <path d="M20 24h80" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M50 24l10 14 10-14" fill="none" stroke="var(--art-ink)" stroke-width="2"/>
      <rect x="14" y="38" width="92" height="46" rx="10" fill="var(--art-red)" stroke="var(--art-ink)" stroke-width="2.2"/>
      <path d="M14 70h92" stroke="#fff" stroke-width="4"/>
      <rect x="22" y="46" width="18" height="16" rx="2" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <rect x="46" y="46" width="28" height="16" rx="2" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <rect x="80" y="46" width="18" height="16" rx="2" fill="var(--art-sky)" stroke="var(--art-ink)" stroke-width="1.6"/>
      <circle cx="34" cy="88" r="7" fill="var(--art-ink)"/><circle cx="86" cy="88" r="7" fill="var(--art-ink)"/>
      <path d="M4 96h112" stroke="var(--art-ink)" stroke-width="3"/>`,
    // Kofola: szklanka z ciemnym napojem
    express: `<rect width="120" height="120" fill="var(--sp-express-bg)"/>
      <path d="M36 30h48l-6 72H42z" fill="#fff" stroke="var(--art-ink)" stroke-width="2.4"/>
      <path d="M39 44h42l-5 56H44z" fill="#4A2410"/>
      <path d="M40 44h40" stroke="#C9A27A" stroke-width="4"/>
      <circle cx="52" cy="64" r="2" fill="#fff" opacity=".7"/><circle cx="64" cy="78" r="2" fill="#fff" opacity=".7"/><circle cx="58" cy="90" r="1.6" fill="#fff" opacity=".7"/>
      <path d="M70 20l-6 38" stroke="var(--art-red)" stroke-width="4" stroke-linecap="round"/>
      <path d="M86 58c10 0 12 14 0 16" fill="none" stroke="var(--art-ink)" stroke-width="2" opacity=".3"/>`
  };

  // logo na podstawie flagi kraju
  const LOGO = {
    at: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#C8102E"/>
    <rect y="22" width="64" height="20" fill="#fff"/><path d="M8 52 26 26l9 12 6-8 15 22z" fill="#fff" stroke="#7a0a1c" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="m21 33 5-7 5 7-2.5 2-2.5-2-2.5 2z" fill="#C8102E"/></svg>`,
    cz: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="czc"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#czc)">
    <rect width="64" height="32" fill="#fff"/><rect y="32" width="64" height="32" fill="#D7141A"/><path d="M0 0 34 32 0 64z" fill="#11457E"/></g></svg>`,
    it: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="itc"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#itc)">
    <rect width="22" height="64" fill="#008C45"/><rect x="21" width="22" height="64" fill="#F4F5F0"/><rect x="42" width="22" height="64" fill="#CD212A"/></g></svg>`,
    nl: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="nlc"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#nlc)">
    <rect width="64" height="22" fill="#AE1C28"/><rect y="21" width="64" height="22" fill="#fff"/><rect y="42" width="64" height="22" fill="#21468B"/></g></svg>`,
    sk: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="skc"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#skc)">
    <rect width="64" height="22" fill="#fff"/><rect y="21" width="64" height="22" fill="#0B4EA2"/><rect y="42" width="64" height="22" fill="#EE1C25"/>
    <path d="M12 14h22v20c0 8-6 13-11 16-5-3-11-8-11-16z" fill="#EE1C25" stroke="#fff" stroke-width="2.4"/>
    <path d="M23 18v22M17 24h12M15 30h16" stroke="#fff" stroke-width="3"/>
    <path d="M13 40c3-3 6-3 10-1 4-2 7-2 10 1v2H13z" fill="#0B4EA2"/></g></svg>`,
    any: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#2B3A55"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 32h36M32 14c-8 10-8 26 0 36M32 14c8 10 8 26 0 36" fill="none" stroke="#fff" stroke-width="2.5"/></svg>`
  };
  const logo = LOGO.at;

  window.ICONS = { CAT, UI, logo, LOGO,
    REGION_ART: { at: REGION_ART, cz: REGION_ART_CZ, it: REGION_ART_IT, nl: REGION_ART_NL, sk: REGION_ART_SK }, SPECIAL_ART: { at: SPECIAL_ART, cz: SPECIAL_ART_CZ, it: SPECIAL_ART_IT, nl: SPECIAL_ART_NL, sk: SPECIAL_ART_SK } };
})();
