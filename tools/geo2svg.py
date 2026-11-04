# Konwersja granic krajów związkowych (CC BY 4.0 Statistik Austria / Flooh Perlot)
# do uproszczonych ścieżek SVG -> src/content/map.js
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'laender_999_geo.json')
OUT = os.path.join(HERE, '..', 'src', 'content', 'map.js')

IDS = {'1': 'bgl', '2': 'ktn', '3': 'noe', '4': 'ooe', '5': 'sbg', '6': 'stm', '7': 'tir', '8': 'vbg', '9': 'wien'}
REGION = {'wien': 'east', 'noe': 'east', 'bgl': 'east', 'ooe': 'north', 'sbg': 'north',
          'stm': 'south', 'ktn': 'south', 'tir': 'west', 'vbg': 'west'}
NAMES = {'wien': 'Wiedeń', 'noe': 'Dolna Austria', 'bgl': 'Burgenland', 'ooe': 'Górna Austria',
         'sbg': 'Salzburg', 'stm': 'Styria', 'ktn': 'Karyntia', 'tir': 'Tyrol', 'vbg': 'Vorarlberg'}

d = json.load(open(SRC, encoding='latin-1'))
LAT0 = 47.6
k = math.cos(math.radians(LAT0))
pts = []
for f in d['features']:
    for poly in f['geometry']['coordinates']:
        for ring in poly:
            pts += ring
xs = [p[0] * k for p in pts]; ys = [-p[1] for p in pts]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
W = 1000.0
s = W / (maxx - minx)
H = (maxy - miny) * s
pad = 6

def proj(p):
    return ((p[0] * k - minx) * s + pad, (-p[1] - miny) * s + pad)

def ring_area(r):
    a = 0
    for i in range(len(r)):
        x1, y1 = r[i]; x2, y2 = r[(i + 1) % len(r)]
        a += x1 * y2 - x2 * y1
    return a / 2

states = []
for f in d['features']:
    sid = IDS[f['properties']['iso']]
    parts = []
    big = None; bigA = 0
    for poly in f['geometry']['coordinates']:
        for ri, ring in enumerate(poly):
            pr = [proj(p) for p in ring]
            # usuwanie punktów bliższych niż 1.2 px
            out = [pr[0]]
            for q in pr[1:]:
                if math.hypot(q[0] - out[-1][0], q[1] - out[-1][1]) >= 1.2:
                    out.append(q)
            if len(out) < 4:
                continue
            parts.append('M' + 'L'.join(f'{x:.0f},{y:.0f}' for x, y in out) + 'Z')
            A = abs(ring_area(out))
            if ri == 0 and A > bigA:
                bigA = A; big = out
    cx = sum(p[0] for p in big) / len(big); cy = sum(p[1] for p in big) / len(big)
    states.append({'id': sid, 'name': NAMES[sid], 'region': REGION[sid], 'd': ''.join(parts),
                   'cx': round(cx), 'cy': round(cy)})

order = ['vbg', 'tir', 'sbg', 'ooe', 'ktn', 'stm', 'noe', 'bgl', 'wien']
states.sort(key=lambda x: order.index(x['id']))
data = {'w': round(W + 2 * pad), 'h': round(H + 2 * pad), 'states': states,
        'credit': 'Granice krajów związkowych: Statistik Austria (CC BY 4.0), oprac. Flooh Perlot, uproszczone.'}
with open(OUT, 'w', encoding='utf-8') as fo:
    fo.write('// Wygenerowane przez tools/geo2svg.py\nwindow.MAPA = ' + json.dumps(data, ensure_ascii=False) + ';\n')
print('OK', data['w'], data['h'], os.path.getsize(OUT))
