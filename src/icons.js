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

  // logo na podstawie flagi kraju
  const LOGO = {
    at: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#C8102E"/>
    <rect y="22" width="64" height="20" fill="#fff"/><path d="M8 52 26 26l9 12 6-8 15 22z" fill="#fff" stroke="#7a0a1c" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="m21 33 5-7 5 7-2.5 2-2.5-2-2.5 2z" fill="#C8102E"/></svg>`,
    cz: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="czc"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#czc)">
    <rect width="64" height="32" fill="#fff"/><rect y="32" width="64" height="32" fill="#D7141A"/><path d="M0 0 34 32 0 64z" fill="#11457E"/></g></svg>`,
    any: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#2B3A55"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 32h36M32 14c-8 10-8 26 0 36M32 14c8 10 8 26 0 36" fill="none" stroke="#fff" stroke-width="2.5"/></svg>`
  };
  const logo = LOGO.at;

  window.ICONS = { CAT, UI, logo, LOGO,
    REGION_ART: { at: REGION_ART, cz: REGION_ART_CZ }, SPECIAL_ART: { at: SPECIAL_ART, cz: SPECIAL_ART_CZ } };
})();
