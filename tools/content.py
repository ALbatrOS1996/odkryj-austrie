# Parser i walidator bazy pytań (content-src/<kraj>/*.txt): python tools/content.py at|cz
import os, re, hashlib, json, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
CATS = ['ZAB', 'GEO', 'HIS', 'KUL', 'SPO']
ACCESSED = '2026-11-04'


def expand_source(s):
    if s.startswith('http'):
        url = s
    else:
        k, _, v = s.partition(':')
        if k in ('wpl', 'wde', 'wen', 'wcs'):
            url = f'https://{k[1:]}.wikipedia.org/wiki/{v}'
        elif k == 'brit':
            url = f'https://www.britannica.com/{v}'
        elif k == 'unesco':
            url = f'https://whc.unesco.org/en/list/{v}'
        elif k == 'gw':
            url = f'https://www.geschichtewiki.wien.gv.at/{v}'
        else:
            raise ValueError('nieznany prefiks źródła: ' + s)
    host = re.sub(r'^https?://(www\.)?', '', url).split('/')[0]
    if 'wikipedia' in host:
        typ = 'wikipedia'
    elif 'britannica' in host or 'austria-forum' in host or 'encyklopedie' in host:
        typ = 'encyklopedia'
    elif 'geschichtewiki' in host:
        typ = 'instytucja'
    elif 'unesco' in host:
        typ = 'instytucja'
    else:
        typ = 'strona instytucji'
    return {'url': url, 'host': host, 'type': typ, 'accessed': ACCESSED}


def is_num(o):
    return re.fullmatch(r'[\d\s.,]+', o.replace('ok.', '').strip()) is not None and re.search(r'\d', o)


def num_val(o):
    m = re.search(r'\d+(?:[.,]\d+)?', o.replace(' ', ''))
    return float(m.group(0).replace(',', '.'))


def order_options(qid, opts):
    """opts[0] = poprawna. Zwraca (lista, indeks poprawnej)."""
    correct = opts[0]
    nums = all(re.search(r'\d', o) for o in opts) and all(len(re.sub(r'[^\d]', '', o)) > 0 for o in opts)
    if nums and all(re.fullmatch(r'(ok\.\s*)?[\d.,\s]+(tys\.)?\s*(km²|lat|r\.)?', o.strip()) or re.fullmatch(r'[\d]+', o.strip()) for o in opts):
        out = sorted(opts, key=num_val)
    else:
        h = int(hashlib.sha1(qid.encode()).hexdigest(), 16)
        out = opts[:]
        # deterministyczne tasowanie
        for i in range(len(out) - 1, 0, -1):
            h, j = divmod(h, i + 1)
            out[i], out[j] = out[j], out[i]
    return out, out.index(correct)


def country(cc):
    return json.load(open(os.path.join(ROOT, 'content-src', cc, 'country.json'), encoding='utf-8'))


def load(cc='at'):
    qs = []
    errors = []
    REG = dict(country(cc)['regionCodes']); REG['-'] = None
    for cat in CATS:
        path = os.path.join(ROOT, 'content-src', cc, cat.lower() + '.txt')
        for ln, line in enumerate(open(path, encoding='utf-8'), 1):
            line = line.rstrip('\n')
            if not line.strip() or line.startswith('#'):
                continue
            parts = [p.strip() for p in re.split(r'\s+\|(?:\s+|$)', line)]
            if len(parts) < 7:
                errors.append(f'{cat}:{ln} za mało pól ({len(parts)})')
                continue
            while len(parts) < 8:
                parts.append('')
            sid, diff, reg, text, opts, expl, srcs, tags = parts[:8]
            opts = [o.strip() for o in opts.split(' ; ')]
            qid = f'{cc}-{cat.lower()}-{sid[1:]}'
            if reg not in REG:
                errors.append(f'{cat}:{ln} nieznany kod regionu „{reg}”'); continue
            o2, ci = order_options(qid, opts)
            q = {
                'id': qid, 'category': cat, 'difficulty': int(diff), 'regionRef': REG[reg],
                'question': text, 'options': o2, 'correct': ci, 'explanation': expl,
                'timeSensitive': False, 'asOf': None,
                'sources': [expand_source(s) for s in srcs.split()],
                'verification': 'checked',
                'tags': [t.strip() for t in tags.split(',') if t.strip()],
                '_line': f'{cc}/{cat.lower()}.txt:{ln}', '_correctText': opts[0]
            }
            if cc == 'at' and cat == 'SPO' and sid in ('s11',):
                q['timeSensitive'] = True; q['asOf'] = '2026-11'
            qs.append(q)
    return qs, errors


def validate(qs, errors, regions=('east', 'north', 'south', 'west')):
    rep = []
    ids = collections.Counter(q['id'] for q in qs)
    for k, v in ids.items():
        if v > 1:
            errors.append(f'zduplikowane id {k}')
    answers = collections.defaultdict(list)
    for q in qs:
        L = q['_line']
        if len(q['options']) != 4:
            errors.append(f'{L} {q["id"]}: {len(q["options"])} odpowiedzi')
        if len(set(q['options'])) != len(q['options']):
            errors.append(f'{L} {q["id"]}: powtórzona odpowiedź')
        if len(q['question']) > 160:
            errors.append(f'{L} {q["id"]}: pytanie {len(q["question"])} > 160 zn.')
        for o in q['options']:
            if len(o) > 40:
                errors.append(f'{L} {q["id"]}: odpowiedź „{o}” {len(o)} > 40 zn.')
        if len(q['explanation']) > 280:
            errors.append(f'{L} {q["id"]}: objaśnienie {len(q["explanation"])} > 280 zn.')
        for fld in [q['question'], q['explanation']] + q['options']:
            if '—' in fld or '–' in fld:
                errors.append(f'{L} {q["id"]}: długi myślnik w tekście')
            if '|' in fld:
                errors.append(f'{L} {q["id"]}: znak | w tekście')
        if q['difficulty'] not in (1, 2, 3):
            errors.append(f'{L} {q["id"]}: zła trudność')
        if len(q['sources']) < 2:
            errors.append(f'{L} {q["id"]}: mniej niż 2 źródła')
        if not any(s['type'] != 'wikipedia' for s in q['sources']):
            errors.append(f'{L} {q["id"]}: brak źródła spoza Wikipedii')
        if q['category'] == 'HIS' and not any(t.startswith('historia:') for t in q['tags']):
            errors.append(f'{L} {q["id"]}: brak tagu epoki')
        answers[(q['category'], q['_correctText'].lower())].append(q['id'])
    dup = {k: v for k, v in answers.items() if len(v) > 1}
    for k, v in dup.items():
        rep.append(f'UWAGA: ta sama odpowiedź „{k[1]}” w {k[0]}: {", ".join(v)}')

    # statystyki
    stats = {}
    for cat in CATS:
        cq = [q for q in qs if q['category'] == cat]
        d = collections.Counter(q['difficulty'] for q in cq)
        r = collections.Counter(q['regionRef'] for q in cq)
        c = collections.Counter(q['correct'] for q in cq)
        stats[cat] = {'n': len(cq), 'diff': dict(sorted(d.items())), 'region': {str(k): v for k, v in r.items()}, 'correctPos': dict(sorted(c.items()))}
        if len(cq) < 64:
            errors.append(f'{cat}: tylko {len(cq)} pytań (min. 64)')
    zg = [q for q in qs if q['category'] in ('ZAB', 'GEO')]
    for reg in regions:
        share = sum(1 for q in zg if q['regionRef'] == reg) / len(zg)
        stats.setdefault('ZAB+GEO', {})[reg] = round(share * 100, 1)
        if share < 0.15:
            errors.append(f'ZAB+GEO: region {reg} ma {share:.0%} (< 15%)')
    his = [q for q in qs if q['category'] == 'HIS']
    ep = collections.Counter(next(t for t in q['tags'] if t.startswith('historia:')) for q in his)
    stats['HIS epoki'] = dict(ep)
    for k, v in ep.items():
        if v / len(his) > 0.35:
            errors.append(f'HIS: epoka {k} ma {v / len(his):.0%} (> 35%)')
    pl = sum(1 for q in his if 'polska-powiazanie' in q['tags'])
    stats['HIS polska-powiazanie'] = pl
    if not 8 <= pl <= 12:
        errors.append(f'HIS: {pl} pytań z tagiem polska-powiazanie (wymagane 8-12)')
    alld = collections.Counter(q['difficulty'] for q in qs)
    stats['trudność ogółem %'] = {k: round(v / len(qs) * 100, 1) for k, v in sorted(alld.items())}
    return stats, rep


if __name__ == '__main__':
    import sys
    cc = sys.argv[1] if len(sys.argv) > 1 else 'at'
    qs, errors = load(cc)
    stats, rep = validate(qs, errors, [r['id'] for r in country(cc)['regions']])
    print(json.dumps(stats, ensure_ascii=False, indent=1))
    for r in rep:
        print(r)
    for e in errors:
        print('BŁĄD', e)
    print(f'{len(qs)} pytań, {len(errors)} błędów')
