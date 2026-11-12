# Budowanie: python build.py  ->  docs/ (PWA na GitHub Pages) + content/<kraj>/ (dane w JSON)
# Każdy kraj to folder content-src/<kod>/ (country.json, map.json, zab/geo/his/kul/spo.txt).
import base64, hashlib, json, os, sys, collections
ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from content import load, validate, country as read_country

COUNTRIES = [c for c in ['at', 'cz'] if all(os.path.exists(os.path.join(ROOT, 'content-src', c, f + '.txt')) for f in ('zab', 'geo', 'his', 'kul', 'spo'))]  # kolejność na liście wyboru

def rd(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()

def wr(p, s, binary=False):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if binary:
        open(full, 'wb').write(s)
    else:
        open(full, 'w', encoding='utf-8', newline='\n').write(s)

def host_label(s):
    h = s['host']
    return h.split('.')[0] + '.wikipedia' if 'wikipedia' in h else h

registry, data_files, failed = [], {}, False
for cc in COUNTRIES:
    qs, errors = load(cc)
    cfg = read_country(cc)
    stats, warn = validate(qs, errors, [r['id'] for r in cfg['regions']])
    for w in warn:
        print(f'[{cc}]', w)
    if errors:
        failed = True
        for e in errors:
            print(f'[{cc}] BŁĄD', e)
        continue
    # bank pytań (zaciemniony: poprawna odpowiedź nie jest czytelna w kodzie)
    rows = []
    for q in qs:
        hsum = sum(ord(c) for c in q['id'])
        rows.append([q['id'], q['category'], q['difficulty'], q['regionRef'], q['question'], q['options'],
                     (q['correct'] + hsum % 4) % 4, q['explanation'], [[s['url'], host_label(s)] for s in q['sources']], q['tags']])
    raw = json.dumps(rows, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    key = b'odkryj-austrie'
    bank_b64 = base64.b64encode(bytes(b ^ key[i % len(key)] for i, b in enumerate(raw))).decode()
    mp = json.loads(rd(f'content-src/{cc}/map.json'))
    data_files[cc] = ('window.OA_DATA = window.OA_DATA || {};\nwindow.OA_DATA[' + json.dumps(cc) + '] = ' +
                      json.dumps({'country': cfg, 'map': mp, 'bankData': bank_b64}, ensure_ascii=False, separators=(',', ':')) + ';\n')
    registry.append({'code': cc, 'name': cfg['name'], 'gameTitle': cfg['gameTitle'], 'count': len(qs),
                     'regions': [cfg.get('regionShort', {}).get(r['id'], r['name']) for r in cfg['regions']]})
    # dane i dokumentacja treści
    clean = [{k: v for k, v in q.items() if not k.startswith('_')} for q in qs]
    wr(f'content/{cc}/questions.json', json.dumps(clean, ensure_ascii=False, indent=1))
    wr(f'content/{cc}/country.json', json.dumps(cfg, ensure_ascii=False, indent=2))
    src = collections.OrderedDict()
    for q in qs:
        for s in q['sources']:
            src.setdefault(s['url'], [s, []])[1].append(q['id'])
    lines = ['# Źródła · ' + cfg['name'], '', f'Data dostępu: {qs[0]["sources"][0]["accessed"]}. Lista wygenerowana przez build.py.', '']
    for url, (s, ids) in src.items():
        lines.append(f'- <{url}> ({s["type"]}) · pytania: {", ".join(i.split("-", 1)[1] for i in ids)}')
    wr(f'content/{cc}/sources.md', '\n'.join(lines) + '\n')
    wr(f'content/{cc}/stats.json', json.dumps(stats, ensure_ascii=False, indent=1))
    print(f'[{cc}] {len(qs)} pytań OK')

if failed:
    sys.exit('Walidacja nie przeszła – popraw content-src/<kraj>/*.txt')

ver = hashlib.sha1(''.join(data_files[c] for c in COUNTRIES).encode() + rd('src/app.js').encode() + rd('src/style.css').encode() + rd('src/engine.js').encode() + rd('src/icons.js').encode()).hexdigest()[:10]
for cc, s in data_files.items():
    wr(f'docs/data/{cc}.js', s)

scripts = [
    'window.OA_VERSION = ' + json.dumps(ver) + ';\nwindow.OA_REGISTRY = ' + json.dumps(registry, ensure_ascii=False) + ';',
    rd('src/icons.js'), rd('src/engine.js'), rd('src/net.js'), rd('tools/qrcode.min.js'), rd('src/app.js')
]
html = rd('src/index.html').replace('/*CSS*/', rd('src/style.css'))
html = html.replace('<!--SCRIPTS-->', '\n'.join('<script>\n' + s + '\n</script>' for s in scripts))
wr('docs/index.html', html)
wr('docs/.nojekyll', '')

manifest = {
    'name': 'Odkryj! Pojedynek wiedzy o krajach', 'short_name': 'Odkryj!', 'lang': 'pl',
    'description': 'Pojedynek wiedzy o krajach Europy na dwa telefony: ' + ', '.join(r['name'] for r in registry) + '.',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'portrait',
    'background_color': '#F5F1EA', 'theme_color': '#2B3A55',
    'icons': [
        {'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        {'src': 'icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}
    ]
}
wr('docs/manifest.webmanifest', json.dumps(manifest, ensure_ascii=False, indent=1))
core = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'] + [f'data/{c}.js?v={ver}' for c in COUNTRIES]
wr('docs/sw.js', f"""// Service worker – wersja {ver}
const CACHE = 'odkryj-{ver}';
const CORE = {json.dumps(core)};
self.addEventListener('install', (e) => {{ e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', (e) => {{ e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', (e) => {{
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {{
    // najpierw sieć (świeża wersja), potem pamięć podręczna
    e.respondWith(fetch(req).then((r) => {{ const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; }}).catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
  }} else if (url.host.includes('fonts.')) {{
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => {{ const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; }})));
  }}
}});
""")

# ikony: ogólne (góry na granatowym tle z paskiem barw)
try:
    from PIL import Image, ImageDraw
    def icon(size, pad=0.0):
        im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = size
        if pad:
            d.rectangle([0, 0, s, s], fill='#2B3A55')
        else:
            d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill='#2B3A55')
        inset = s * pad; sc = (s - 2 * inset) / 64; X = lambda v: inset + v * sc
        d.rectangle([X(10), X(46), X(54), X(50)], fill='#C8102E')
        d.rectangle([X(10), X(50), X(54), X(54)], fill='#FFFFFF')
        d.rectangle([X(10), X(54), X(54), X(58)], fill='#11457E')
        d.polygon([(X(8), X(44)), (X(26), X(16)), (X(35), X(28)), (X(41), X(20)), (X(56), X(44))], fill='#FFFFFF')
        d.polygon([(X(21), X(23)), (X(26), X(16)), (X(31), X(23)), (X(28.5), X(25)), (X(26), X(23)), (X(23.5), X(25))], fill='#2B3A55')
        return im
    for name, size, pad in [('icon-192.png', 192, 0), ('icon-512.png', 512, 0), ('icon-maskable-512.png', 512, 0.12), ('apple-touch-icon.png', 180, 0.08)]:
        icon(size, pad).save(os.path.join(ROOT, 'docs', name))
except ImportError:
    print('Brak Pillow – ikony PNG nie zostały wygenerowane')
print(f'OK: wersja {ver}, docs/index.html {len(html)//1024} KB, kraje: {", ".join(r["code"] for r in registry)}')
