# Budowanie: python build.py  ->  docs/ (PWA na GitHub Pages) + content/at/ (dane) + dokumentacja/
import base64, hashlib, json, os, sys, collections, datetime
ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from content import load, validate, CATS

def rd(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()

def wr(p, s, binary=False):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if binary:
        open(full, 'wb').write(s)
    else:
        open(full, 'w', encoding='utf-8', newline='\n').write(s)

# 1. treść + walidacja
qs, errors = load()
stats, warn = validate(qs, errors)
for w in warn:
    print(w)
if errors:
    for e in errors:
        print('BŁĄD', e)
    sys.exit('Walidacja nie przeszła – popraw content-src/*.txt')
country = json.loads(rd('content-src/country.json'))

# 2. bank pytań dla aplikacji (zaciemniony: poprawna odpowiedź nie jest czytelna w kodzie)
def host_label(s):
    h = s['host']
    if 'wikipedia' in h:
        return h.split('.')[0] + '.wikipedia'
    return h
rows = []
for q in qs:
    hsum = sum(ord(c) for c in q['id'])
    rows.append([q['id'], q['category'], q['difficulty'], q['regionRef'], q['question'], q['options'],
                 (q['correct'] + hsum % 4) % 4, q['explanation'], [[s['url'], host_label(s)] for s in q['sources']], q['tags']])
raw = json.dumps(rows, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
key = b'odkryj-austrie'
bank_b64 = base64.b64encode(bytes(b ^ key[i % len(key)] for i, b in enumerate(raw))).decode()

# 3. strona
css = rd('src/style.css')
scripts = [
    'window.COUNTRY = ' + json.dumps(country, ensure_ascii=False) + ';',
    rd('src/content/map.js'),
    'window.BANK_DATA = "' + bank_b64 + '";',
    rd('src/icons.js'), rd('src/engine.js'), rd('src/net.js'), rd('tools/qrcode.min.js'), rd('src/app.js')
]
html = rd('src/index.html').replace('/*CSS*/', css)
html = html.replace('<!--SCRIPTS-->', '\n'.join('<script>\n' + s + '\n</script>' for s in scripts))
ver = hashlib.sha1(html.encode()).hexdigest()[:10]
wr('docs/index.html', html)
wr('docs/.nojekyll', '')

manifest = {
    'name': country['gameTitle'], 'short_name': 'Odkryj Austrię', 'lang': 'pl',
    'description': 'Pojedynek wiedzy o Austrii na dwa telefony.',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'portrait',
    'background_color': '#F5F1EA', 'theme_color': '#C8102E',
    'icons': [
        {'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        {'src': 'icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}
    ]
}
wr('docs/manifest.webmanifest', json.dumps(manifest, ensure_ascii=False, indent=1))
wr('docs/sw.js', f"""// Service worker – wersja {ver}
const CACHE = 'odkryj-austrie-{ver}';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
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

# 4. ikony
try:
    from PIL import Image, ImageDraw
    def icon(size, pad=0.0):
        im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        s = size
        if pad:
            d.rectangle([0, 0, s, s], fill='#C8102E')
        else:
            d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill='#C8102E')
        inset = s * pad
        sc = (s - 2 * inset) / 64
        X = lambda v: inset + v * sc
        d.rectangle([0 if pad else X(0), X(22), s if pad else X(64), X(42)], fill='#FFFFFF')
        d.polygon([(X(8), X(52)), (X(26), X(26)), (X(35), X(38)), (X(41), X(30)), (X(56), X(52))], fill='#FFFFFF', outline='#7a0a1c', width=max(2, int(2.5 * sc)))
        d.polygon([(X(21), X(33)), (X(26), X(26)), (X(31), X(33)), (X(28.5), X(35)), (X(26), X(33)), (X(23.5), X(35))], fill='#C8102E')
        return im
    for name, size, pad in [('icon-192.png', 192, 0), ('icon-512.png', 512, 0), ('icon-maskable-512.png', 512, 0.12), ('apple-touch-icon.png', 180, 0.08)]:
        icon(size, pad).save(os.path.join(ROOT, 'docs', name))
except ImportError:
    print('Brak Pillow – ikony PNG nie zostały wygenerowane')

# 5. dane i dokumentacja treści
clean = [{k: v for k, v in q.items() if not k.startswith('_')} for q in qs]
wr('content/at/questions.json', json.dumps(clean, ensure_ascii=False, indent=1))
wr('content/at/country.json', json.dumps(country, ensure_ascii=False, indent=2))
src = collections.OrderedDict()
for q in qs:
    for s in q['sources']:
        src.setdefault(s['url'], [s, []])[1].append(q['id'])
lines = ['# Źródła', '', f'Data dostępu: {qs[0]["sources"][0]["accessed"]}. Lista wygenerowana przez build.py.', '']
for url, (s, ids) in src.items():
    lines.append(f'- <{url}> ({s["type"]}) · pytania: {", ".join(i.replace("at-", "") for i in ids)}')
wr('content/at/sources.md', '\n'.join(lines) + '\n')
json.dump(stats, open(os.path.join(ROOT, 'content', 'at', 'stats.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'OK: {len(qs)} pytań, docs/index.html {len(html)//1024} KB, wersja {ver}')
