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
    'nl': [
        ('fl', ['flevoland', 'lelystad', 'almere', 'urk', 'schokland', 'oostvaardersplassen', 'batavia', 'noordoostpolder']),
        ('gr', ['groning', 'martinitoren', 'pieterburen', 'bourtange', 'złoże gazu', 'złóż gazu']),
        ('dr', ['drenth', 'assen', 'emmen', 'hunebed', 'westerbork', 'kolonie dobroczynności', 'frederiksoord']),
        ('fr', ['fryzj', 'fryzyj', 'fryslân', 'leeuwarden', 'oldehove', 'sneek', 'harlingen', 'terschelling', 'brandaris', 'schiermonnikoog', 'dokkum', 'lemmer', 'woudagemaal', 'heerenveen', 'thialf', 'elfstedentocht', 'fierljeppen', 'mata hari', 'escher', 'afsluitdijk', 'barentsz', 'radbod', 'lauwersmeer']),
        ('ov', ['overijssel', 'giethoorn', 'deventer', 'zwolle', 'kampen', 'twente', 'enschede', 'grolsch', 'avercamp']),
        ('ge', ['geldri', 'arnhem', 'nijmegen', 'veluwe', 'apeldoorn', 'het loo', 'kröller', 'loevestein', 'betuwe', 'openluchtmuseum', 'posbank', 'market garden', 'driel', 'sosabowsk', 'vierdaagse']),
        ('ut', ['utrecht', 'utrechc', 'utrechck', 'domtoren', 'rietveld', 'kasteel de haar', 'doorn', 'miffy', 'willibrord', 'traiectum', 'złote cielę']),
        ('ze', ['w zelandii', 'zelandzk', 'części zelandii', 'resztą zelandii', 'stolicy zelandii', ' zelandia', 'middelburg', 'vlissingen', 'oosterscheldekering', 'westerschelde', 'skaldy zachodniej', 'flandri', 'de ruyter', 'watersnoodramp']),
        ('nb', ['brabanc', 'brabanck', 'hertogenbosch', 'den bosch', 'oeteldonk', 'bosch', 'eindhoven', 'philips', 'psv', 'asml', 'tilburg', 'koningshoeven', 'la trappe', 'breda', 'maczek', 'efteling', 'kaatsheuvel', 'zundert', 'nuenen', 'jedzący kartofle', 'baarle', 'biesbosch', 'elżbiety', 'design week', 'wüst', 'goirle']),
        ('li', ['limburg', 'maastricht', 'vaalserberg', 'vaals', 'valkenburg', 'cauberg', 'sint-pietersberg', 'serwacego', 'thorn', 'rolduc', 'kerkrade', 'venlo', 'rieu', 'tefaf', 'dumoulin', 'amstel gold']),
        ('zh', ['holandia południowa', 'holandii południowej', 'haga', 'hadze', 'hagi', 'binnenhof', 'mauritshuis', 'scheveningen', 'pałac pokoju', 'huis ten bosch', 'noordeinde', 'prinsjesdag', 'europol', 'trybunał karny', 'rotterdam', 'erasmusbrug', 'most erazma', 'kostki', 'markthal', 'van nelle', 'maeslant', 'feyenoord', 'kapsalon', 'kinderdijk', 'delft', 'delfcie', 'lejd', 'lejdzie', 'keukenhof', 'lisse', 'gouda', 'nieuwerkerk', 'zuidplas', 'westland', 'leeuwenhoek', 'huygens', 'lorentz', 'kamerlingh', 'koolhaas', 'boijmans', 'north sea jazz', 'iffr', 'jan steen', 'dorestad']),
        ('nh', ['holandia północna', 'holandii północnej', 'amsterdam', 'kanałów z xvii', 'dam ', 'rijksmuseum', 'anna frank', 'anny frank', 'westerkerk', 'nieuwe kerk', 'zaanse', 'zaan', 'muiderslot', 'naarden', 'texel', 'haarlem', 'schiphol', 'beemster', 'alkmaar', 'edam', 'aalsmeer', 'cruijff', 'ajax', 'heineken', 'concertgebouw', 'vondel', 'van gogha', 'strajk lutowy', 'korfball', 'floris', 'hoeksen']),
    ],
    'sk': [
        ('ba', ['bratysław', 'bratislav', 'devín', 'čunov', 'petržalk', 'rusovc', 'gerulat', 'kamzík', 'slavín', 'čumil', 'michalsk', 'most snp', 'ufo', 'prymasowsk', 'grassalkovich', 'małe karpaty', 'małych karpat', ' modra', 'modrze', 'pezinok', 'senec', 'červený kameň', 'danubiana', 'slovenský grob', 'tehelné', 'nepel', 'twin city', 'wiednia', 'reduta', 'filharmoni', 'istropolitana', 'komeńskiego', 'św. marcina', 'devínskiej', 'volkswagen', 'maria teresa', 'manifestacja świec', 'kempelen', 'lúčnica', 'bib']),
        ('tt', ['trnaw', 'piešťan', 'skalic', 'šaštín', 'smolenic', 'banič', 'kopčan', 'bohunic', 'žytni', 'záhori', 'pressburg']),
        ('tn', ['trenczyn', 'trenčín', 'bojnic', 'beckov', 'čachtic', 'batory', 'púchov', 'prievidz', 'bradl', 'handlov', 'chára', 'pohoda', 'czak', 'ścibor']),
        ('nr', ['nitr', 'komárn', 'štúrovo', 'iža', 'kelemanti', 'nowe zamki', 'jaguar', 'tóth', 'pribin']),
        ('za', ['żylin', 'žilin', ' orawsk', ' oraw', 'liptow', 'liptovsk', 'mikułasz', 'vlkolín', 'rużomberk', 'terchov', 'jánošík', 'janosik', 'mała fatr', 'małej fatr', 'čičman', 'strečno', 'martin', 'macierz', 'kysuc', 'turiec', 'rajeck', 'wielka fatr', 'wielkiej fatr', 'ostredok', ' kia', 'východná', 'sagan', 'vlhová', 'martikán', 'stodola', 'demianowsk', 'chopok', 'jasná', 'černov', 'hlink', 'fulla', 'benk', 'kollár', 'mošovc', 'druciarstwo']),
        ('bb', ['bańsk', 'bansk', 'kremnic', ' hron', 'hronu', 'pohroni', 'muránsk', 'czarnohroń', 'chvatimech', 'sládkovič', 'hell', 'bahýľ', 'zwoleń', 'horehroni', 'kráľova', 'hamšík', 'powstanie narodowe', 'snp', 'ochtinsk', 'słowacki kras', 'krásna', 'rożniaw']),
        ('po', ['preszów', 'preszow', 'poprad', 'kieżmark', 'lewocz', 'bardejów', 'bardejow', 'lubowl', 'podoliniec', 'podolińc', 'tatr', 'łomnic', 'gerlach', 'krywań', 'rysy', 'szczyrbsk', 'ždiar', 'bielsk', 'pienin', 'dunajc', 'czerwony klasztor', 'medzilaborc', 'warhol', 'miková', 'rusin', 'dukiel', 'połonin', 'kremenec', 'bodružal', 'spisk', 'spisz', 'thököly', 'petzval', 'hossa', 'sabinow', 'nosiči', 'tatranky', 'mariańską']),
        ('ke', ['koszyc', 'košic', 'kosice', 'rakoczy', 'urbana', 'michała', 'zemplin', 'tokaj', 'szirav', 'bodrog', 'dobszyńsk', 'słowacki raj', 'rozhanov', 'hingis', 'maraton pokoju', 'art film']),
    ],
    'si': [
        ('pri', ['postojn', 'pivce', 'predjam', 'cerknic', 'cerkniš', 'pivk', 'snežnik', 'rakov', 'loškiej', 'ilirsk', 'notranjsk', 'odmieniec']),
        ('gos', ['soč', 'socz', 'isonzo', 'kobarid', 'bovec', 'bovcu', 'tolmin', 'idrij', 'idrii', 'žlikrof', 'solkan', 'nova goric', 'novej goric', 'goriška', 'vipav', 'ajdovšč', 'mangart', 'franja', 'cerkno', 'cerknem', 'cerknego', 'divje babe', 'pipistrel', 'kasyn', 'hiša franko', 'laufarj', 'gregorčič', 'mušič', 'trent', 'kanin', 'frigidus', 'caporetto', 'hemingway']),
        ('obk', ['piran', 'koper', 'kopr', 'izol', 'portorož', 'lipic', 'škocjan', 'sečovl', 'hrastovl', 'štanjel', 'pršut', 'teran', 'strunjan', 'ankaran', 'sežan', 'vilenic', 'tartini', 'kosovel', 'kras', 'nadmorsk', 'wybrzeż', 'jota', 'burj', 'triest']),
        ('zas', ['trbovl', 'hrastnik', 'zagorje ob', ' kum', 'zasaw', 'zasav', 'laibach', 'roglič']),
        ('gor', ['bled', 'bohinj', 'triglav', 'planic', 'vintgar', 'savic', 'radovljic', 'brezj', 'škofj', 'we vrbie', 'jesenic', 'kranjska gora', 'kranjskiej gor', 'vitranc', 'pokljuk', 'aljaž', 'zlatorog', 'begunj', 'avsenik', 'elan', 'gorenjsk', 'karawan', 'pokljuc', 'vršič', 'kopitar', 'prevc', 'pletn', 'kremšnit', 'anton janša', 'sava dolinka', 'brnik']),
        ('osr', ['lublan', 'lublańsk', 'ljubljan', 'zois', 'emon', 'plečnik', 'tromostov', 'smocz', 'tivoli', 'metelkov', 'žale', 'barj', 'vrhnik', 'nauport', 'cankar', 'kamnik', 'velika planina', 'stičn', 'šmarna', 'turjak', 'akrapovič', 'bicikelj', 'stožic', 'fabiani', 'ravnikar', 'academia', 'mahler', 'pregl', 'žižek', 'zielonej stolicy', 'acer,']),
        ('pos', ['krško', 'krškim', 'brežic', 'sevnic', 'kostanjevic', 'bizeljsk', 'repnic', 'čatež', 'sotl', 'posaw', 'forma viva', 'melani']),
        ('jvs', ['novo mest', 'novym mieście', 'novego mesta', 'krk', 'otočec', 'kočev', 'bela krajina', 'białej krain', 'kolp', 'metlik', 'rosalnic', 'črnomel', 'ribnic', 'pleterj', 'šentjern', 'žužemberk', 'cviček', 'dolenjsk', 'sytuł', 'revoz']),
        ('pom', ['prekmur', 'murze', 'murą', 'murska', 'mury', 'lendav', 'bogojin', 'radenc', 'radenska', 'ljutomer', 'jeruzalem', 'veržej', 'goričk', 'radgon', 'gibanic', 'bograč', 'pomur']),
        ('kor', ['korošk', 'peca', 'pecą', 'matjaž', 'mežic', 'slovenj grad', 'ravne', 'dravograd', 'hugo wolf', 'karynti']),
        ('sav', ['celj', 'celei', 'savinj', 'velenj', 'laško', 'laškiego', 'žalc', 'žalec', 'logarsk', 'rogašk', 'donat', 'šempeter', 'žiče', 'rogla', 'rogli', 'zreč', 'gorenje', 'cylejsk', 'ulryk']),
        ('pod', ['maribor', 'ptuj', 'poetovi', 'drawa', 'drawie', 'pohorj', 'haloz', 'lent', 'złoty lis', 'złotego lisa', 'kurent', 'štukelj', 'slomšek', 'maister', 'ormož']),
    ],
    'de': [
        ('ni', ['dolnej saksonii', 'dolna saksonia', 'hanower', 'goslar', 'rammelsberg', 'hameln', 'szczurołap', 'hildesheim', 'alfeld', 'fagus', 'herrenhausen', 'wolfsburg', 'volkswagen', 'garbus', 'lüneburg', 'fryzj', 'bergen-belsen', 'osnabrück', 'kalkriese', 'teutobur', 'leibniz', 'scorpions', 'münchhausen', 'cuxhaven']),
        ('hh', ['hambur', 'elbphilharmonie', 'speicherstadt', 'reeperbahn', 'st. pauli', 'michel', 'altona', 'brahms', 'gomora', 'spiegel']),
        ('hb', ['brem', 'roland', 'muzykant', 'osioł, pies']),
        ('sh', ['lubek', 'lubeck', 'lübeck', 'holsztyń', 'szlezwik', 'kilon', 'kiloń', 'kiel', 'flensburg', 'sylt', 'helgoland', 'hedeby', 'niederegger', 'buddenbrook', 'fehmarn', 'tomasz mann']),
        ('mv', ['rugi', 'rügen', 'schwerin', 'szweriń', 'stralsund', 'wismar', 'rostock', 'meklemb', 'pomorza przedniego', 'uznam', 'usedom', 'müritz', 'prora', 'greifswald', 'caspar david', 'wędrowca']),
        ('be', ['berlin', 'brama brandenburska', 'bramy brandenburskiej', 'reichstag', 'szprew', 'wyspie muzeów', 'east side', 'checkpoint', 'tempelhof', 'currywurst', 'eisbein', 'berlinale', 'rammstein', 'kennedy', 'mostem powietrznym', 'alexanderplatz']),
        ('bb', ['brandenburgi', 'poczdam', 'sanssouci', 'glienick', 'spreewald', 'frankfurt nad odrą', 'frankfurcie nad odrą', 'słubic', 'viadrina', 'babelsberg', 'metropolis', 'cecilienhof', 'cottbus']),
        ('st', ['saksonii-anhalt', 'saksonia-anhalt', 'magdeburg', 'wittenberg', 'dessau', 'bauhaus', 'nebr', 'naumburg', 'brocken', 'harz', 'halle', 'händel', 'merseburg', 'kwedlinburg', 'eisleben', 'walpurgi', '95 tez']),
        ('sn', ['saksoni', 'drezn', 'dresd', 'frauenkirche', 'zwinger', 'miśn', 'bastei', 'görlitz', 'zgorzel', 'budziszyn', 'chemnitz', 'lipsk', 'rudaw', 'łużyc', 'august ii', 'augusta ii', 'poniatowski', 'bach', 'mendelssohn', 'trabant', 'zwickau', 'stollen']),
        ('th', ['turyng', 'weimar', 'erfurt', 'wartburg', 'eisenach', 'jeny', 'jena', 'buchenwald', 'rennsteig', 'krämerbrücke', 'goethe', 'schiller', 'anny amalii', 'zeiss', 'kyffhäuser', 'rostbratwurst', 'thüringer']),
        ('nw', ['nadrenii północnej', 'nadrenia płn', 'nadrenii płn', 'westfal', 'kolon', 'kolońsk', 'köln', 'kölsch', 'düsseldorf', 'altbier', 'bonn', 'beethoven', 'akwizgran', 'karola wielkiego', 'essen', 'zollverein', 'ruhr', 'dortmund', 'borussi', 'schalke', 'revierderby', 'wuppertal', 'hermannsdenkmal', 'neandertal', 'münster', 'kraftwerk', 'haribo', 'aldi', '4711', 'sauerbraten', 'różany poniedziałek', 'colonia agrippina']),
        ('he', ['hesj', 'frankfurt', 'mainhattan', 'paulskirche', 'kassel', 'wilhelmshöhe', 'documenta', 'grimm', 'messel', 'darmstadt', 'wiesbaden', 'rüsselsheim', 'opel', 'apfelwein', 'europejski bank centralny']),
        ('rp', ['palatynat', 'moguncj', 'mogontiacum', 'mainz', 'gutenberg', 'trewir', 'porta nigra', 'augusta treverorum', 'marks', 'spirze', 'speyer', 'wormacj', 'loreley', 'koblencj', 'deutsches eck', 'mozel', 'eltz', 'cochem', 'nürburgring', 'eifel', 'hambach', 'hildegard', 'bingen']),
        ('sl', ['saar', 'völklingen', 'mettlach']),
        ('by', ['bawar', 'monachi', 'neuschwanstein', 'ludwik ii', 'marienplatz', 'hofbräu', 'oktoberfest', 'weißwurst', 'norymberg', 'lebkuchen', 'dürer', 'bamberg', 'rauchbier', 'ratyzbon', 'castra regina', 'augsburg', 'augusta vindelic', 'fuggerei', 'würzburg', 'tiepolo', 'röntgen', 'rothenburg', 'chiemsee', 'wieskirche', 'bayreuth', 'wagner', 'zugspitze', 'königssee', 'watzmann', 'berchtesgaden', 'pasaw', 'ingolstadt', 'audi', 'frankoni', 'szlak romantyczny', 'las bawarski', 'lindau', 'dachau', 'bmw', 'adidas', 'herzogenaurach', 'playmobil', 'lech', 'oberstdorf', 'garmisch', 'christkind', 'maibaum', 'reinheitsgebot', 'fürth', 'bayern']),
        ('bw', ['badeni', 'wirtemberg', 'stuttgart', 'heidelberg', 'fryburg', 'freiburg', 'schwarzwald', 'ulm', 'hohenzollern', 'maulbronn', 'mainau', 'reichenau', 'konstancj', 'bodeńsk', 'kukułk', 'spätzle', 'maultaschen', 'szwab', 'hohle fels', 'karlsruhe', 'porsche', ' sap', 'walldorf', 'steiff', 'mannheim', 'benz', 'mercedes', 'einstein', 'neckar', 'feldberg', 'włodkowic', 'husa']),
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
