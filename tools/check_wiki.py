# Sprawdza tytuły Wikipedii przez API (bez limitów jak przy zwykłych stronach)
import json, os, sys, urllib.parse, urllib.request, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import load
qs, _ = load(sys.argv[1] if len(sys.argv) > 1 else 'at')
by = {}
for q in qs:
    for s in q['sources']:
        u = s['url']
        if 'wikipedia.org/wiki/' in u:
            lang = u.split('//')[1].split('.')[0]
            t = urllib.parse.unquote(u.split('/wiki/')[1]).replace('_', ' ')
            by.setdefault(lang, set()).add(t)
res = {}
for lang, titles in by.items():
    titles = sorted(titles)
    for i in range(0, len(titles), 40):
        chunk = titles[i:i+40]
        url = f'https://{lang}.wikipedia.org/w/api.php?' + urllib.parse.urlencode({'action':'query','format':'json','redirects':1,'titles':'|'.join(chunk)})
        req = urllib.request.Request(url, headers={'User-Agent': 'OdkryjAustrie-linkcheck/1.0 (private quiz project)'})
        d = json.load(urllib.request.urlopen(req))['query']
        norm = {n['from']: n['to'] for n in d.get('normalized', [])}
        red = {r['from']: r['to'] for r in d.get('redirects', [])}
        pages = {p['title']: p for p in d['pages'].values()}
        for t in chunk:
            t2 = norm.get(t, t); t3 = red.get(t2, t2)
            p = pages.get(t3)
            res[f'{lang}:{t}'] = 'MISSING' if (p is None or 'missing' in p) else ('OK' if t3 == t else 'REDIRECT->' + t3)
        time.sleep(0.5)
bad = {k: v for k, v in res.items() if v == 'MISSING'}
print(len(res), 'tytułów,', len(bad), 'brak')
for k in sorted(bad): print('BRAK', k)
