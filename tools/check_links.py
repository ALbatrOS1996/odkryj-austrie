# Sprawdza, czy linki do źródeł działają (HTTP 200/3xx). Wynik: tools/links_report.json
import json, os, sys, subprocess, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import load

qs, _ = load(sys.argv[1] if len(sys.argv) > 1 else 'at')
urls = sorted({s['url'] for q in qs for s in q['sources']})
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

def check(u):
    try:
        r = subprocess.run(['curl', '-s', '-L', '-o', os.devnull, '-w', '%{http_code} %{url_effective}', '-A', UA,
                            '--max-time', '25', u], capture_output=True, text=True, timeout=40)
        code, _, eff = r.stdout.partition(' ')
        return u, int(code or 0), eff
    except Exception as e:
        return u, 0, str(e)

res = {}
with cf.ThreadPoolExecutor(12) as ex:
    for u, code, eff in ex.map(check, urls):
        res[u] = {'code': code, 'final': eff}
bad = {u: v for u, v in res.items() if not (200 <= v['code'] < 400)}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'links_report.json')
json.dump({'checked': len(res), 'bad': bad, 'all': res}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(res), 'sprawdzonych,', len(bad), 'niedziałających')
for u, v in sorted(bad.items()):
    print(v['code'], u)
