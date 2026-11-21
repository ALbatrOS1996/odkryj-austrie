# Przypisanie pytań do jednostek administracyjnych (kraje związkowe, kraje, regiony).
# Szukamy słów kluczowych w treści pytania i poprawnej odpowiedzi (małe litery, fragmenty słów).
# Kolejność ma znaczenie: pierwsza pasująca jednostka wygrywa. Brak dopasowania = tylko makroregion.

KEYWORDS = {
    'at': [
        ('bgl', ['burgenland', 'eisenstadt', 'nezydersk', 'neusiedl', 'apetlon', 'esterház']),
        ('vbg', ['vorarlberg', 'bregencj', 'bregenz', 'feldkirch', 'montafon', 'pfänder', 'bodeńsk', 'schattenburg', 'zumthor', 'arlberg']),
        ('ktn', ['karynt', 'klagenfurt', 'wörthersee', 'hochosterwitz', 'gurk', 'minimundus', 'pyramidenkogel', 'villach', 'weissensee', 'karawank', 'pasterze', 'kaiser-franz-josefs', 'grossglockner', 'drawa']),
        ('stm', ['styri', 'graz', 'mariazell', 'admont', 'riegersburg', 'erzberg', 'eggenberg', 'landeszeughaus', 'mura ', 'murze']),
        ('tir', ['tyrol', 'innsbruck', 'kufstein', 'hall in tirol', 'wattens', 'swarovski', 'ötzt', 'zillertal', 'kitzbühel', 'brenner', 'ischgl', 'paznaun', 'lienz', 'achensee', 'bergisel', 'zugspitze', 'ambras', 'złoty dach', 'europabrücke', 'hofkirche', 'sölden', 'streif', 'hofer']),
        ('sbg', ['salzburg', 'hellbrunn', 'mirabell', 'werfen', 'eisriesenwelt', 'krimml', 'hallein', 'getreidegasse', 'dürrnberg', 'salzach', 'mozart', 'cicha noc', 'oberndorf']),
        ('ooe', ['górna austria', 'górnej austrii', 'linz', 'hallstatt', 'gmunden', 'traunsee', 'attersee', 'mondsee', 'st. florian', 'kremsmünster', 'bad ischl', 'kaiservill', 'wolfgang', 'mühlviertel', 'steyr', 'enns', 'braunau', 'mauthausen', 'voestalpine', 'dachstein', 'salzkammergut', 'ars electronica']),
        ('noe', ['dolna austria', 'dolnej austrii', 'wachau', 'melk', 'dürnstein', 'carnuntum', 'semmering', 'st. pölten', 'baden bei', 'uzdrowisko pod wiedniem', 'waldviertel', 'weinviertel', 'krems', 'schwechat', 'willendorf', 'lasek wiedeński', 'donau-auen', 'mayerling', 'aspern']),
        ('wien', ['wiedeń', 'wiedn', 'wiedeńsk', 'prater', 'hofburg', 'schönbrunn', 'szczepana', 'ringstra', 'belweder', 'albertina', 'museumsquartier', 'hundertwasser', 'karola boromeusza', 'wotywn', 'graben', 'secesji', 'donauinsel', 'kahlenberg', 'vindobona', 'kunsthistorisches', 'café central', 'heuriger', 'beisl']),
    ],
    'cz': [
        ('pha', ['prag', 'praski', 'praskie', 'hradczan', 'wyszehrad', 'most karola', 'mała strana', 'josefov', 'kampa', 'petřín', 'žižkov', 'plac wacława', 'orloj', 'staromiejsk', 'rudolfinum', 'tańczący', 'strahov', 'lennona', 'teatr narodowy', 'dom reprezentacyjny', 'złotej uliczce', 'barrandov', 'katedra św. wita', 'zamek praski']),
        ('stc', ['środkowoczesk', 'karlštejn', 'kutn', 'konopišt', 'lánach', 'lány', 'kladno', 'mladá boleslav', 'mielnik', 'lidice', 'kolín', 'kras czeski', 'škoda auto']),
        ('kvk', ['karlow', 'mariańsk', 'františk', 'cheb', 'loket', 'jáchym', 'becherovk', 'ohrz']),
        ('plk', ['pilzn', 'domažl', 'chodsk', 'czarne jezioro', 'pilsner']),
        ('jck', ['krumlow', 'hluboká', 'holašov', 'třeboň', 'trzebo', 'budziejow', 'budvar', 'tábor', 'lipno', 'szumaw', 'písek', 'malše', 'południowoczesk']),
        ('ulk', ['usteń', 'ústí', 'terezín', 'žatc', 'chmiel', 'rudaw', 'teplic', 'pravčick', 'czeska szwajcari', 'czeskiej szwajcarii', 'hřensk', 'zagłębiu północnoczesk', 'brama czeska', 'średniogórz', 'milešovk']),
        ('lbk', ['liberec', 'ještěd', 'trosk', 'jezioro máchy', 'turnov', 'izersk', 'nysą łużyck']),
        ('hkk', ['hradec', 'kuks', 'adršpach', 'śnieżk', 'karkonos', 'náchod', 'kudow', 'łabsk', 'źródło łaba', 'ma źródło łaba']),
        ('pak', ['pardubic', 'litomyšl', 'kladrub', 'poličk']),
        ('vys', ['wysoczyn', 'telč', 'třebíč', 'igław', 'zielonej górze', 'žďár', 'czesko-morawsk']),
        ('jmk', ['brno', 'brnie', 'brna', 'lednic', 'valtic', 'znojm', 'mikulov', 'pálav', 'kras morawski', 'macoch', 'austerlitz', 'sławków', 'věstonic', 'podyj', 'dyi', 'tugendhat', 'špilberk', 'masarykův', 'południowych morawach', 'południowe morawy']),
        ('olk', ['ołomu', 'bouzov', 'haná', 'pradziad', 'hranic', 'tvarůž', 'odry']),
        ('zlk', ['kromieryż', 'zlin', 'velehrad', 'rožnov', 'wołosk', 'luhačov', 'słowacko', 'verbuňk', 'przejazd królów', 'baťa']),
        ('msk', ['ostraw', 'cieszyn', 'olza', 'opaw', 'lysá', 'beskid', 'štramberk', 'kopřivnic', 'tatra', 'hukvald', 'zaolzi', 'morawsko-śląsk', 'vítkovice', 'nohavic', 'brama morawsk']),
    ],
    'it': [
        ('vda', ['dolin aosty', 'dolinie aosty', 'aoście', 'aosta', 'gran paradiso', 'mont blanc', 'matterhorn']),
        ('pie', ['piemont', 'turyn', 'mole antonelliana', 'całun', 'ivrea', 'langhe', 'barolo', 'alby', 'ferrero', 'juventus', 'fiat']),
        ('lig', ['liguri', 'genu', 'genow', 'cinque terre', 'lanterna', 'sanremo', 'portofino', 'kolumb', 'pesto']),
        ('lom', ['lombard', 'mediolan', 'duomo di milano', 'ostatnia wieczerza', 'scala', 'sforz', 'bergamo', 'como', 'cremon', 'monza', 'bosco verticale', 'maggiore', 'campione', 'volta', 'panettone', 'risotto', 'mantu']),
        ('taa', ['trydent', 'górnej adyd', 'górna adyga', 'bolzano', 'brenner', 'sinner', 'marmolad', 'dolomit']),
        ('ven', ['wenec', 'werona', 'weron', 'padw', 'vicenz', 'palladi', 'murano', 'garda', 'prosecco', 'conegliano', 'tiramisu', 'rialto', 'gondol', 'św. marka', 'westchnień', 'julii', 'scrovegn', 'caporetto', 'vivaldi', 'tycjan', 'bellott', 'canaletto', 'spritz']),
        ('fvg', ['friuli', 'triest', 'miramare', 'akwilei', 'udine']),
        ('emr', ['emili', 'bolonia', 'bolońsk', 'bolonii', 'rawenn', 'modena', 'modeny', 'parm', 'ferrar', 'maranello', 'rimini', 'reggio emilia', 'asinelli', 'ghirlandina', 'delta padu', 'balsam', 'fellini']),
        ('tos', ['toskan', 'florencj', 'florenck', 'pizie', 'pizy', 'piza', 'sieny', 'sienie', 'siena', 'san gimignano', 'chianti', 'elb', 'arnem', 'arno', 'maremm', 'lukk', 'brunelleschi', 'ponte vecchio', 'uffizi', 'medyceu', 'santa maria del fiore', 'dawid', 'collodi', 'puccini', 'modigliani', 'palio', 'katarzyna ze sieny']),
        ('umb', ['umbri', 'asyż', 'asyżu', 'perugi', 'trasimeno', 'orvieto', 'franciszka']),
        ('mar', ['marche', 'ankon', 'urbino', 'loreto', 'rafael', 'rossini']),
        ('laz', ['lacjum', 'rzym', 'koloseum', 'panteon', 'trevi', 'hiszpańskie', 'watykan', 'ostii', 'ostię', 'tivoli', 'villa d', 'wilczyc', 'vittoriano', 'tybr', 'bolsen', 'świętego anioła', 'cinecittà', 'sykstyń', 'św. piotra', 'navona', 'monte cassino', 'kwirynal', 'montecitorio', 'carbonara']),
        ('abr', ['abruzj', "l’aquila", 'gran sasso']),
        ('mol', ['molise', 'campobasso']),
        ('cam', ['kampani', 'neapol', 'pompej', 'herkulanum', 'amalfi', 'capri', 'błękitna grota', 'wezuwiusz', 'caserta', 'paestum', 'sorrento', 'limoncello', 'maradon', 'margherita', 'sophia loren', 'ferrante']),
        ('pug', ['apuli', 'bari', 'alberobello', 'trulli', 'lecce', 'salento', 'gargano', 'castel del monte', 'bona']),
        ('bas', ['basilicat', 'matera', 'sassi', 'potenza']),
        ('cal', ['kalabri', 'riace', 'reggio di calabria', 'sila', 'mesyńsk']),
        ('sic', ['sycyli', 'palermo', 'etna', 'etny', 'etnę', 'agrigent', 'monreale', 'taormin', 'syrakuz', 'stromboli', 'lampedus', 'cannoli', 'montalbano', 'camilleri', 'cosa nostra', 'nieszpory', 'archimedes', 'paradiso']),
        ('sar', ['sardyn', 'cagliari', 'nurag', 'costa smeralda', 'alghero', 'deledd']),
    ],
}


def unit_for(cc, text, group=None, group_of=None):
    """Pierwsza pasująca jednostka; jeśli pytanie ma makroregion, jednostka musi do niego należeć."""
    t = text.lower()
    for unit, words in KEYWORDS.get(cc, []):
        if any(w in t for w in words):
            if group and group_of and group_of.get(unit) != group:
                continue
            return unit
    return None
