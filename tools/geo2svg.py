# Granice jednostek administracyjnych -> uproszczone ścieżki SVG: python tools/geo2svg.py at|cz
#  at: krajów związkowych – Statistik Austria (CC BY 4.0), oprac. Flooh Perlot
#  it: regionów – ISTAT (CC BY 4.0), oprac. openpolis/geojson-italy
#  nl: prowincji – CBS/PDOK (CC BY 4.0), oprac. cartomap/nl
#  sk: krajów – ÚGKK SR, Geoportál ZBGIS, oprac. drakh/slovakia-gps-data
#  cz: krajów – ČÚZK INSPIRE „Územní správní jednotky” (CC BY 4.0), oprac. siwekm/czech-geojson
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CC = sys.argv[1] if len(sys.argv) > 1 else 'at'

if CC == 'at':
    SRC, ENC = 'at_laender.json', 'latin-1'
    IDS = {'1': 'bgl', '2': 'ktn', '3': 'noe', '4': 'ooe', '5': 'sbg', '6': 'stm', '7': 'tir', '8': 'vbg', '9': 'wien'}
    REGION = {'wien': 'east', 'noe': 'east', 'bgl': 'east', 'ooe': 'north', 'sbg': 'north', 'stm': 'south', 'ktn': 'south', 'tir': 'west', 'vbg': 'west'}
    NAMES = {'wien': 'Wiedeń', 'noe': 'Dolna Austria', 'bgl': 'Burgenland', 'ooe': 'Górna Austria', 'sbg': 'Salzburg', 'stm': 'Styria', 'ktn': 'Karyntia', 'tir': 'Tyrol', 'vbg': 'Vorarlberg'}
    ORDER = ['vbg', 'tir', 'sbg', 'ooe', 'ktn', 'stm', 'noe', 'bgl', 'wien']
    LAT0 = 47.6
    CREDIT = 'Granice krajów związkowych: Statistik Austria (CC BY 4.0), oprac. Flooh Perlot, uproszczone.'
    ident = lambda f, rings: IDS[f['properties']['iso']]
elif CC == 'it':
    SRC, ENC = 'it_regioni.json', 'utf-8'
    IDS = {'01': 'pie', '02': 'vda', '03': 'lom', '04': 'taa', '05': 'ven', '06': 'fvg', '07': 'lig', '08': 'emr', '09': 'tos', '10': 'umb',
           '11': 'mar', '12': 'laz', '13': 'abr', '14': 'mol', '15': 'cam', '16': 'pug', '17': 'bas', '18': 'cal', '19': 'sic', '20': 'sar'}
    NAMES = {'pie': 'Piemont', 'vda': 'Dolina Aosty', 'lom': 'Lombardia', 'taa': 'Trydent-Górna Adyga', 'ven': 'Wenecja Euganejska',
             'fvg': 'Friuli-Wenecja Julijska', 'lig': 'Liguria', 'emr': 'Emilia-Romania', 'tos': 'Toskania', 'umb': 'Umbria', 'mar': 'Marche',
             'laz': 'Lacjum', 'abr': 'Abruzja', 'mol': 'Molise', 'cam': 'Kampania', 'pug': 'Apulia', 'bas': 'Basilicata', 'cal': 'Kalabria',
             'sic': 'Sycylia', 'sar': 'Sardynia'}
    # makroregiony wg podziału ISTAT (Nord-Ovest, Nord-Est, Centro; Sud i Isole połączone)
    REGION = {'pie': 'nw', 'vda': 'nw', 'lig': 'nw', 'lom': 'nw', 'taa': 'ne', 'ven': 'ne', 'fvg': 'ne', 'emr': 'ne',
              'tos': 'center', 'umb': 'center', 'mar': 'center', 'laz': 'center',
              'abr': 'south', 'mol': 'south', 'cam': 'south', 'pug': 'south', 'bas': 'south', 'cal': 'south', 'sic': 'south', 'sar': 'south'}
    ORDER = ['vda', 'pie', 'lig', 'lom', 'taa', 'ven', 'fvg', 'emr', 'tos', 'umb', 'mar', 'laz', 'abr', 'mol', 'cam', 'pug', 'bas', 'cal', 'sic', 'sar']
    LAT0 = 42.0
    CREDIT = 'Granice regionów: ISTAT (CC BY 4.0), oprac. openpolis/geojson-italy, uproszczone.'
    ident = lambda f, rings: IDS[f['properties']['reg_istat_code']]
elif CC == 'nl':
    SRC, ENC = 'nl_provincies.json', 'utf-8'
    IDS = {'PV20': 'gr', 'PV21': 'fr', 'PV22': 'dr', 'PV23': 'ov', 'PV24': 'fl', 'PV25': 'ge', 'PV26': 'ut', 'PV27': 'nh', 'PV28': 'zh', 'PV29': 'ze', 'PV30': 'nb', 'PV31': 'li'}
    NAMES = {'gr': 'Groningen', 'fr': 'Fryzja', 'dr': 'Drenthe', 'ov': 'Overijssel', 'fl': 'Flevoland', 'ge': 'Geldria', 'ut': 'Utrecht',
             'nh': 'Holandia Północna', 'zh': 'Holandia Południowa', 'ze': 'Zelandia', 'nb': 'Brabancja Północna', 'li': 'Limburgia'}
    # makroregiony wg landsdelen CBS (NUTS 1)
    REGION = {'gr': 'north', 'fr': 'north', 'dr': 'north', 'ov': 'east', 'fl': 'east', 'ge': 'east', 'ut': 'west', 'nh': 'west', 'zh': 'west', 'ze': 'west', 'nb': 'south', 'li': 'south'}
    ORDER = ['fr', 'gr', 'dr', 'nh', 'fl', 'ov', 'zh', 'ut', 'ge', 'ze', 'nb', 'li']
    LAT0 = 52.2
    CREDIT = 'Granice prowincji: CBS/PDOK (CC BY 4.0), oprac. cartomap/nl, uproszczone.'
    ident = lambda f, rings: IDS[f['properties']['statcode']]
elif CC == 'sk':
    SRC, ENC = 'sk_kraje.json', 'utf-8'
    IDS = {1: 'ba', 2: 'tt', 3: 'tn', 4: 'nr', 5: 'za', 6: 'bb', 7: 'po', 8: 'ke'}
    NAMES = {'ba': 'Kraj bratysławski', 'tt': 'Kraj trnawski', 'tn': 'Kraj trenczyński', 'nr': 'Kraj nitrzański',
             'za': 'Kraj żyliński', 'bb': 'Kraj bańskobystrzycki', 'po': 'Kraj preszowski', 'ke': 'Kraj koszycki'}
    # makroregiony wg NUTS 2: Bratysława, Słowacja Zachodnia, Środkowa i Wschodnia
    REGION = {'ba': 'bratislava', 'tt': 'west', 'tn': 'west', 'nr': 'west', 'za': 'center', 'bb': 'center', 'po': 'east', 'ke': 'east'}
    ORDER = ['ba', 'tt', 'nr', 'tn', 'za', 'bb', 'po', 'ke']
    LAT0 = 48.7
    CREDIT = 'Granice krajów: ÚGKK SR, Geoportál ZBGIS, oprac. drakh/slovakia-gps-data, uproszczone.'
    ident = lambda f, rings: IDS[f['properties']['IDN4']]
else:
    SRC, ENC = 'cz_kraje.json', 'utf-8'
    # punkt wewnątrz każdego kraju (stolica kraju; dla środkowoczeskiego Kolín, bo Praga jest enklawą)
    PTS = {'pha': (14.42, 50.08), 'stc': (15.20, 50.03), 'kvk': (12.87, 50.23), 'plk': (13.38, 49.75), 'jck': (14.47, 48.97),
           'ulk': (14.03, 50.66), 'lbk': (15.05, 50.77), 'hkk': (15.83, 50.21), 'pak': (15.78, 49.95), 'vys': (15.59, 49.40),
           'jmk': (16.61, 49.20), 'olk': (17.25, 49.59), 'zlk': (17.67, 49.23), 'msk': (18.29, 49.83)}
    NAMES = {'pha': 'Praga', 'stc': 'Kraj środkowoczeski', 'kvk': 'Kraj karlowarski', 'plk': 'Kraj pilzneński', 'jck': 'Kraj południowoczeski',
             'ulk': 'Kraj usteński', 'lbk': 'Kraj liberecki', 'hkk': 'Kraj hradecki', 'pak': 'Kraj pardubicki', 'vys': 'Kraj Wysoczyna',
             'jmk': 'Kraj południowomorawski', 'olk': 'Kraj ołomuniecki', 'zlk': 'Kraj zliński', 'msk': 'Kraj morawsko-śląski'}
    REGION = {'pha': 'center', 'stc': 'center', 'kvk': 'west', 'plk': 'west', 'jck': 'west', 'ulk': 'north', 'lbk': 'north', 'hkk': 'north',
              'pak': 'north', 'vys': 'moravia', 'jmk': 'moravia', 'olk': 'moravia', 'zlk': 'moravia', 'msk': 'moravia'}
    ORDER = ['kvk', 'plk', 'jck', 'ulk', 'lbk', 'hkk', 'pak', 'stc', 'pha', 'vys', 'jmk', 'olk', 'zlk', 'msk']
    LAT0 = 49.8
    CREDIT = 'Granice krajów: ČÚZK, INSPIRE Územní správní jednotky (CC BY 4.0), uproszczone.'

    def inside(pt, ring):
        x, y = pt; c = False
        for i in range(len(ring)):
            x1, y1 = ring[i][:2]; x2, y2 = ring[i - 1][:2]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                c = not c
        return c

    def ident(f, rings):
        outer = rings[0][0]
        for k, p in PTS.items():
            if inside(p, outer) and not any(inside(p, h) for h in rings[0][1:]):
                return k
        raise SystemExit('nie rozpoznano kraju')

d = json.load(open(os.path.join(HERE, SRC), encoding=ENC))
k = math.cos(math.radians(LAT0))

def polys(f):
    g = f['geometry']
    return g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]

pts = [p for f in d['features'] for poly in polys(f) for ring in poly for p in ring]
xs = [p[0] * k for p in pts]; ys = [-p[1] for p in pts]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
W = 1000.0; s = W / (maxx - minx); H = (maxy - miny) * s; pad = 6
proj = lambda p: ((p[0] * k - minx) * s + pad, (-p[1] - miny) * s + pad)

def area(r):
    return sum(r[i][0] * r[(i + 1) % len(r)][1] - r[(i + 1) % len(r)][0] * r[i][1] for i in range(len(r))) / 2

states = []
for f in d['features']:
    P = polys(f)
    sid = ident(f, P)
    parts = []; big = None; bigA = 0
    for poly in P:
        for ri, ring in enumerate(poly):
            pr = [proj(p) for p in ring]
            out = [pr[0]]
            for q in pr[1:]:
                if math.hypot(q[0] - out[-1][0], q[1] - out[-1][1]) >= {'at': 1.2, 'cz': 3.0, 'nl': 2.0, 'sk': 2.5}.get(CC, 3.0):
                    out.append(q)
            if len(out) < 4:
                continue
            parts.append('M' + 'L'.join(f'{x:.0f},{y:.0f}' for x, y in out) + 'Z')
            A = abs(area(out))
            if ri == 0 and A > bigA:
                bigA = A; big = out
    cx = sum(p[0] for p in big) / len(big); cy = sum(p[1] for p in big) / len(big)
    states.append({'id': sid, 'name': NAMES[sid], 'region': REGION[sid], 'd': ''.join(parts), 'cx': round(cx), 'cy': round(cy)})
assert len({x['id'] for x in states}) == len(NAMES), 'brak lub duplikat jednostki'
states.sort(key=lambda x: ORDER.index(x['id']))
data = {'w': round(W + 2 * pad), 'h': round(H + 2 * pad), 'states': states, 'credit': CREDIT}
out = os.path.join(HERE, '..', 'content-src', CC, 'map.json')
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(data, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
print('OK', CC, data['w'], data['h'], os.path.getsize(out))
