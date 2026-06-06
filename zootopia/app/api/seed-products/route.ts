import { NextResponse } from "next/server";
import mongoose from "mongoose";


import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";


const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });


const excelProducts = [
  {
    name: "AlphaWolf 400g Bezzbożowa Mokra Karma Dla Szczenięt Rasy Średniej Delikatny Mus Z Jagnięciną Batatami I Glukozaminą",
    animalType: "Pies",
    subCategory: "Karma mokra",
    company: "AlphaWolf",
    price: 28.50,
    promoPrice: null,
    shortDescription: "Pełnowartościowy, bezzbożowy mus o wysokiej zawartości mięsa. Dodatek glukozaminy wspiera budowę mocnych stawów, a kwasy Omega-3 zapewniają zdrowy start i lśniącą sierść.",
    description: "AlphaWolf Puppy Mus to kulinarny majstersztyk stworzony dla najmłodszych psich odkrywców. Aksamitna konsystencja musu ułatwia przejście z mleka matki na pokarm stały, nie obciążając delikatnego żołądka. Dzięki bezzbożowej recepturze eliminujemy ryzyko nietolerancji, a wysoka zawartość jagnięciny dostarcza budulca dla rozwijających się mięśni. Dodatek glukozaminy aktywnie wspiera budowę zdrowych stawów u rosnących szczeniąt.",
    ingredients: "70% świeża jagnięcina, wywar z mięsa, bataty (5%), minerały, glukozamina (0,5%), olej z łososia, suszone owoce. Dodatki: witamina A, D3, E.",
    additionalInfo: "Produkt w 100% naturalny, bez konserwantów i barwników. Przechowywać w suchym i chłodnym miejscu, po otwarciu zużyć w ciągu 24h.",
    tags: ["Wiek: Szczenię", "Wielkość rasy: Średnia 10-25kg", "Specjalne potrzeby: Bezzbożowa"]
  },
  {
    name: "AlphaWolf 15kg Sucha Karma Dla Dorosłych Psów Wszystkich Ras Z Soczystą Wołowiną Ryżem I Warzywami Ogrodowymi",
    animalType: "Pies",
    subCategory: "Karma sucha",
    company: "AlphaWolf",
    price: 349.00,
    promoPrice: 289.00,
    shortDescription: "Wysokoenergetyczna formuła dla aktywnych psów. Zawiera naturalne przeciwutleniacze i witaminy wspierające odporność oraz lśniącą sierść każdego dnia.",
    description: "Wysokoenergetyczna formuła zaprojektowana dla psów prowadzących aktywny tryb życia. Starannie zbilansowana mieszanka wołowiny z ryżem zapewnia optymalną dawkę sił witalnych przez cały dzień. Naturalne przeciwutleniacze zawarte w warzywach ogrodowych wzmacniają system odpornościowy, a dodatek oleju z łososia sprawia, że sierść staje się lśniąca i miękka w touchu.",
    ingredients: "Suszona wołowina (35%), ryż (25%), tłuszcz wołowy, suszone warzywa (marchew, groch), olej z łososia, pulpa buraczana, minerały, witaminy.",
    additionalInfo: "Pamiętaj o zapewnieniu psu stałego dostępu do świeżej wody. Przechowywać w szczelnie zamkniętym opakowaniu.",
    tags: ["Wiek: Dorosły", "Wielkość rasy: Duża >25kg", "Specjalne potrzeby: Wysoka aktywność"]
  },
  {
    name: "AlphaWolf 400g Karma Mokra Monobiałkowa Dla Psa Pure Beef 100% Wołowina Bez Zbóż I Sztucznych Dodatków",
    animalType: "Pies",
    subCategory: "Karma mokra",
    company: "AlphaWolf",
    price: 26.50,
    promoPrice: null,
    shortDescription: "Receptura oparta na jednym źródle białka zwierzęcego, idealna dla psów z alergiami pokarmowymi. Soczyste kawałki mięsa w sosie własnym zapewniają najwyższą smakowitość.",
    description: "Receptura \"Pure Beef\" to rozwiązanie typu monobiałkowego – oznacza to, że jedynym źródłem białka zwierzęcego jest wołowina. Jest to idealny wybór dla psów z alergiami pokarmowymi lub wyjątkowo wrażliwym układem trawiennym. Soczyste kawałki mięsa w naturalnym sosie własnym zapewniają najwyższą smakowitość, której nie oprze się żaden psi niejadek.",
    ingredients: "100% wołowina (mięso mięśniowe, serca, płuca), bulion wołowy, minerały.",
    additionalInfo: "Bez zbóż, bez glutenu, bez sztucznych wypełniaczy. Produkt monobiałkowy – doskonały w diecie eliminacyjnej.",
    tags: ["Specjalne potrzeby: Bezzbożowa", "Specjalne potrzeby: Dla alergików"]
  },
  {
    name: "AlphaWolf 800g Pełnowartościowa Karma Mokra Dla Psa Z Dziczyzną Borówką I Żurawiną Wspierająca Odporność I Trawienie",
    animalType: "Pies",
    subCategory: "Karma mokra",
    company: "AlphaWolf",
    price: 49.90,
    promoPrice: null,
    shortDescription: "Wykwintne połączenie dziczyzny z owocami leśnymi, które dostarczają naturalnych antyoksydantów. Zapewnia energię i zdrowy wygląd skóry Twojego pupila.",
    description: "Wykwintne połączenie dziczyzny z owocami leśnymi to uczta dla podniebienia Twojego pupila. Dziczyzna jest mięsem wyjątkowo chudym i bogatym w żelazo, a dodatek borówek i żurawiny dostarcza naturalnych antyoksydantów, które neutralizują wolne rodniki. Ta karma wspiera nie tylko układ trawienny, ale również dba o witalność skóry i blask sierści.",
    ingredients: "60% dziczyzna, 30% wywar z mięsa, borówki (4%), żurawina (2%), minerały, zioła (tymianek, rozmaryn).",
    additionalInfo: "Produkt typu premium. Idealny dla psów z tendencją do szybkiego przybierania na wadze.",
    tags: ["Wiek: Dorosły"]
  },
  {
    name: "Pawsome Ortopedyczne Legowisko Typu Kanapa Z Pianką Memory Rozmiar L (Szare)",
    animalType: "Pies",
    subCategory: "Legowiska",
    company: "Pawsome",
    price: 249.00,
    promoPrice: null,
    shortDescription: "Profesjonalne legowisko ortopedyczne dopasowujące się to kształtu ciała psa. Odciąża stawy i kręgosłup, a welurowy, zdejmowany pokrowiec pozwala na łatwe pranie w pralce. Idealne dla psów dużych ras i seniorów.",
    description: "Pawsome Sofa to połączenie luksusowego designu z fizjoterapeutycznym wsparciem. Zastosowana pianka z pamięcią kształtu (Memory Foam) reaguje na temperaturę i nacisk ciała Twojego psa, idealnie wypełniając wszelkie luki między ciałem a podłożem. To nie tylko miejsce do spania – to profilaktyka zdrowych stawów i kręgosłupa, szczególnie ważna u psów seniorów oraz ras dużych.",
    ingredients: "Wypełnienie: pianka termoelastyczna (Memory Foam), zewnętrzny pokrowiec: wysokiej jakości welur tapicerski (100% poliester), spód: materiał antypoślizgowy.",
    additionalInfo: "Pokrowiec wyposażony w ukryty zamek błyskawiczny. Można prać w pralce w temperaturze 30°C. Legowisko dostarczane w formie skompresowanej – po rozpakowaniu wymaga ok. 24h na nabranie pełnego kształtu.",
    tags: ["Rozmiar: L", "Materiał: Welur", "Typ: Kanapa", "Ortopedyczne: Tak"]
  },
  {
    name: "NatureBite Ekologiczna Mata Do Spania Z Bawełny Organicznej Rozmiar M",
    animalType: "Pies",
    subCategory: "Legowiska",
    company: "NatureBite",
    price: 129.00,
    promoPrice: null,
    shortDescription: "Lekka i przewiewna mata wykonana w 100% z naturalnej, certyfikowanej bawełny. Doskonale sprawdza się jako posłanie na letnie dni lub jako wkładka do klatki kennelowej i na tylną kanapę auta.",
    description: "Lekka i przewiewna mata, która stanie się ulubionym miejscem wypoczynku Twojego psa w cieplejsze dni. Wykonana w 100% z certyfikowanej bawełny organicznej, zapewnia doskonałą cyrkulację powietrza i jest przyjazna dla wrażliwej skóry. Idealnie sprawdza się jako wkładka do klatki kennelowej, posłanie w aucie lub po prostu jako wygodna baza w salonie.",
    ingredients: "100% certyfikowana bawełna organiczna, wypełnienie z antyalergicznej włókniny silikonowej.",
    additionalInfo: "Produkt w pełni biodegradowalny. Można prać w pralce w temperaturze 40°C. Szybko wysycha.",
    tags: ["Rozmiar: M", "Materiał: Bawełna", "Typ: Mata"]
  },
  {
    name: "ActiveTail Wytrzymały Szarpak Z Naturalnego Sznura Z Uchwytem",
    animalType: "Pies",
    subCategory: "Zabawki",
    company: "ActiveTail",
    price: 35.00,
    promoPrice: null,
    shortDescription: "Stworzony do przeciągania i aportowania. Gruby, bawełniany sznur naturalnie czyści zęby podczas zabawy, a wygodny uchwyt chroni dłonie właściciela przed przypadkowym ugryzieniem.",
    description: "Szarpak ActiveTail to absolutny klasyk do wspólnych zabaw w przeciąganie. Dzięki zastosowaniu grubego, wielokrotnie skręcanego sznura bawełnianego, zabawka jest niezwykle wytrzymała na psie kły. Podczas zabawy naturalne włókna sznura delikatnie masują dziąsła i mechanicznie oczyszczają zęby z osadu, dbając o higienę jamy ustnej Twojego pupila.",
    ingredients: "100% naturalna przędza bawełniana, bezpieczne dla zwierząt certyfikowane barwniki spożywcze.",
    additionalInfo: "Produkt przeznaczony do wspólnej zabawy. Nie zostawiaj psa samego z zabawką, jeśli ma tendencję do połykania kawałków tkanin.",
    tags: ["Materiał: Bawełna"]
  },
  {
    name: "Pawsome Edukacyjna Mata Węchowa Dla Psa Poziom Zaawansowany (Las)",
    animalType: "Pies",
    subCategory: "Zabawki",
    company: "Pawsome",
    price: 89.00,
    promoPrice: null,
    shortDescription: "Interaktywna mata stymulująca psi umysł. Gęste frędzle i ukryte kieszonki sprawiają, że zdobywanie ukrytych smaczków staje się fascynującym wyzwaniem, które uspokaja i męczy psa psychicznie.",
    description: "Pawsome Mata Węchowa to idealne rozwiązanie, aby zaspokoić naturalną potrzebę psa do węszenia. Ukrywanie przysmaków w gęstych \"leśnych\" frędzlach zmusza psa do użycia nosa, co męczy go psychicznie znacznie skuteczniej niż długi spacer. To doskonałe narzędzie do wyciszenia psa po stresujących sytuacjach i świetna zabawa na deszczowe dni.",
    ingredients: "Wysokiej jakości filc poliestrowy (bezpieczny i nietoksyczny), antypoślizgowa podstawa z wytrzymałego materiału.",
    additionalInfo: "Prać ręcznie lub w pralce w trybie delikatnym (30°C). Nie wirować.",
    tags: ["Typ: Mata"]
  },
  {
    name: "SafeWalk Odblaskowa Smycz Miejska Z Amortyzatorem 200cm (Czerwień)",
    animalType: "Pies",
    subCategory: "Smycze i obroże",
    company: "SafeWalk",
    price: 79.00,
    promoPrice: null,
    shortDescription: "Smycz klasy premium z wbudowanym amortyzatorem, który niweluje silne szarpnięcia. Przeszyta odblaskową nicią dla maksymalnego bezpieczeństwa podczas wieczornych spacerów.",
    description: "SafeWalk to smycz zaprojektowana z myślą o bezpieczeństwie i komforcie w miejskiej dżungli. Wbudowany amortyzator typu \"bungee\" skutecznie niweluje nagłe szarpnięcia, chroniąc kręgosłup psa oraz stawy Twojej ręki. Cała taśma została przeszyta nićmi odblaskowymi, dzięki czemu jesteś widoczny z dużej odległości podczas wieczornych spacerów.",
    ingredients: "Wytrzymała taśma nylonowa, nici odblaskowe, solidny karabińczyk ze stali nierdzewnej, elastyczna guma amortyzująca.",
    additionalInfo: "Długość całkowita: 200 cm. Odporna na warunki atmosferyczne – nie traci koloru pod wpływem słońca i deszczu.",
    tags: ["Cechy: Odblaskowe", "Cechy: Z amortyzatorem"]
  },
  {
    name: "Regulowana Obroża Neoprenowa Z Zapięciem Zabezpieczającym (Czarna)",
    animalType: "Pies",
    subCategory: "Smycze i obroże",
    company: "ActiveTail",
    price: 45.00,
    promoPrice: null,
    shortDescription: "Miękka i szybkoschnąca obroża podszyta neoprenem, który zapobiega wycieraniu sierści na szyi. Wyposażona w klamrę z dodatkową blokadą chroniącą przed przypadkowym odpięciem.",
    description: "Ta obroża to definicja codziennej wygody. Podszycie z miękkiego neoprenu chroni szyję psa przed podrażnieniami i nie wyciera sierści, nawet przy intensywnym noszeniu. Dzięki szerokiemu zakresowi regulacji i klamrze z dodatkowym zabezpieczeniem, obroża jest idealnie dopasowana i w pełni bezpieczna w każdych warunkach.",
    ingredients: "Taśma nylonowa, miękka wyściółka neoprenowa, klamra z wytrzymałego tworzywa (ABS), metalowy pierścień (D-ring) na smycz.",
    additionalInfo: "Materiał szybkoschnący – idealny dla psów uwielbiających wodne kąpiele. Bardzo łatwa w czyszczeniu (wystarczy przetrzeć wilgotną szmatką).",
    tags: ["Cechy: Regulowana", "Materiał: Neopren"]
  },
  {
    name: "TravelPet Lekki Transporter Materiałowy Składany Rozmiar M",
    animalType: "Pies",
    subCategory: "Transportery",
    company: "TravelPet",
    price: 159.00,
    promoPrice: null,
    shortDescription: "Mobilna budka z mocnego materiału z panelami z siatki zapewniającymi świetną wentylację. Idealna na krótkie wyjazdy, wizyty u weterynarza oraz jako bezpieczny azyl na wystawach.",
    description: "Mobilny azyl dla Twojego psa, który sprawdzi się w każdych warunkach. Lekka konstrukcja ze stelażem pozwala na błyskawiczne rozłożenie transportera w aucie czy pokoju hotelowym, a po złożeniu zajmuje minimum miejsca. Wytrzymałe siatki zapewniają doskonałą wentylację i widoczność, dając pupilowi poczucie bezpieczeństwa.",
    ingredients: "Wytrzymały nylon 600D, lekki stelaż ze stali nierdzewnej, siatka wentylacyjna z poliestru.",
    additionalInfo: "Łatwy w czyszczeniu materiał (można przecierać wilgotną szmatką). W zestawie wygodna rączka do przenoszenia oraz miękka mata wewnętrzna.",
    tags: ["Rozmiar: M", "Cechy: Składany"]
  },
  {
    name: "SafeJourney Certyfikowany Transporter Klatkowy Do Samochodu (Aluminiowy)",
    animalType: "Pies",
    subCategory: "Transportery",
    company: "SafeJourney",
    price: 499.00,
    promoPrice: null,
    shortDescription: "Wytrzymała, aluminiowa klatka do bagażnika o ściętych bokach. Gwarantuje maksymalne bezpieczeństwo podczas podróży, potwierdzone niezależnymi testami zderzeniowymi (Crash-Test).",
    description: "Bezpieczeństwo w podróży to priorytet. Nasza klatka aluminiowa została zaprojektowana tak, aby chronić psa podczas nagłego hamowania czy kolizji. Dzięki ściętej konstrukcji idealnie dopasowuje się do większości bagażników, zapewniając zwierzęciu stabilne i bezpieczne miejsce, a Tobie spokój ducha podczas jazdy.",
    ingredients: "Wysokiej jakości aluminium lotnicze, łączniki z wzmacnianego tworzywa sztucznego.",
    additionalInfo: "Klatka zamykana na bezpieczny zatrzask z możliwością założenia kłódki. Konstrukcja pozwala na swobodny przepływ powietrza i obserwację otoczenia przez psa.",
    tags: ["Wielkość rasy: Mini/mała <10kg", "Materiał: Metalowe"]
  },
  {
    name: "SlowEat Antypoślizgowa Miska Spowalniająca Jedzenie (Miętowa)",
    animalType: "Pies",
    subCategory: "Miski i poidła",
    company: "SlowEat",
    price: 39.00,
    promoPrice: null,
    shortDescription: "Miska ze specjalnymi wypustkami, które wymuszają powolne pobieranie pokarmu. Zapobiega zadławieniom i wzdęciom, zamieniając każdy posiłek w angażującą łamigłówkę.",
    description: "Koniec z łapczywym połykaniem jedzenia! Specjalnie zaprojektowane wypustki wewnątrz miski SlowEat wymuszają na psie dokładne przeżuwanie każdego kęsa. To proste narzędzie znacząco zmniejsza ryzyko zadławień, wzdęć oraz problemów trawiennych. Idealna dla łakomczuchów, którzy traktują posiłek jak wyścig.",
    ingredients: "Tworzywo sztuczne wysokiej jakości, bezpieczne dla żywności (bez BPA), gumowa podstawa antypoślizgowa.",
    additionalInfo: "Można myć w zmywarce. Spód antypoślizgowy zapobiega przesuwaniu się miski po podłodze podczas jedzenia.",
    tags: ["Typ: Miska", "Cechy: Antypoślizgowe"]
  },
  {
    name: "Pawsome Automatyczna Fontanna Poidło Dla Psa 2L Z Filtrem Węglowym",
    animalType: "Pies",
    subCategory: "Miski i poidła",
    company: "Pawsome",
    price: 115.00,
    promoPrice: null,
    shortDescription: "Stale cyrkulująca, napowietrzona woda zachęca psa do częstszego picia. Wbudowany wymienny filtr z węglem aktywnym usuwa zanieczyszczenia i brzydki zapach wody.",
    description: "Woda, która zawsze smakowo świeżo! Fontanna Pawsome zapewnia stały obieg wody, co zachęca psa do częstszego picia – kluczowego dla zdrowia nerek i układu moczowego. Wymienny filtr węglowy usuwa zanieczyszczenia, sierść oraz niweluje nieprzyjemny zapach chloru z wody kranowej, zapewniając psu zawsze krystalicznie czysty napój.",
    ingredients: "Wytrzymałe tworzywo sztuczne (PP), wymienny wkład filtrujący (węgiel aktywny + bawełna).",
    additionalInfo: "Cicha praca silniczka (nie płoszy psa). Pojemność 2L wystarcza na całodniowe nawodnienie. Zasilanie USB (możliwość podłączenia do powerbanka lub ładowarki telefonu).",
    tags: ["Typ: Fontanna", "Cechy: Automatyczne", "Cechy: Filtrujące wodę"]
  },
  {
    name: "PureCoat Hipoalergiczny Szampon Dla Psów Z Aloesem I Rumiankiem 250ml",
    animalType: "Pies",
    subCategory: "Higiena i pielęgnacja",
    company: "PureCoat",
    price: 42.00,
    promoPrice: null,
    shortDescription: "Delikatny szampon o naturalnym pH, stworzony z myślą o psach z wrażliwą skórą i skłonnościami do alergii. Łagodzi podrażnienia i nadaje sierści naturalny blask bez użycia sztucznych zapachów.",
    description: "Kojące spa dla psów o szczególnie wrażliwej skórze. PureCoat łączy właściwości głęboko nawilżające aloesu z łagodzącym działaniem rumianku. Szampon skutecznie usuwa zabrudzenia, jednocześnie nie naruszając naturalnej bariery ochronnej skóry. Pozostawia sierść miękką, łatwą do rozczesania i przyjemną w dotyku.",
    ingredients: "Woda demineralizowana, łagodne środki powierzchniowo czynne, wyciąg z aloesu, wyciąg z kwiatów rumianku, pantenol, kwas mlekowy.",
    additionalInfo: "pH neutralne dla psiej skóry. Produkt bez parabenów i sztucznych barwników. Zalecane rozcieńczenie z wodą przed użyciem (1:5).",
    tags: ["Typ produktu: Szampon", "Cechy: Hipoalergiczne", "Cechy: Naturalne"]
  },
  {
    name: "Pawsome Nawilżane Chusteczki Pielęgnacyjne Do Łap I Uszu (100 sztuk)",
    animalType: "Pies",
    subCategory: "Higiena i pielęgnacja",
    company: "Pawsome",
    price: 19.90,
    promoPrice: null,
    shortDescription: "Wygodne, biodegradowalne chusteczki nasączone chlorheksydyną. Niezbędne po błotnistym spacerze do szybkiego przetarcia łap oraz do regularnego dbania o higienę psich uszu.",
    description: "Niezbędnik każdego aktywnego psa. Chusteczki Pawsome pozwalają na błyskawiczne odświeżenie łap po spacerze w błocie lub szybką pielęgnację okolic oczu i uszu. Ich wyjątkowo delikatna, bezzapachowa formuła została opracowana tak, aby nie podrażniać wrażliwych błon śluzowych, a jednocześnie skutecznie usuwać zanieczyszczenia i alergeny.",
    ingredients: "Woda oczyszczona, gliceryna roślinna, ekstrakt z aloesu, alantoina, witamina E, delikatne środki myjące (biodegradowalne).",
    additionalInfo: "Produkt bezalkoholowy i bezzapachowy. Po wyjęciu chusteczki pamiętaj o szczelnym zamknięciu opakowania, aby zapobiec wyschnięciu pozostałych sztuk.",
    tags: ["Typ produktu: Chusteczki"]
  },
  {
    name: "NatureBite 12kg Bezzbożowa Sucha Karma Dla Dorosłych Psów Z Kaczki Ziemniakami I Olejem Z Łososia Hipoalergiczna",
    animalType: "Pies",
    subCategory: "Karma sucha",
    company: "NatureBite",
    price: 365.00,
    promoPrice: null,
    shortDescription: "Monobiałkowa receptura stworzona dla psów z wrażliwym układem pokarmowym. Zawiera dodatek ziół polnych wspierających odporność oraz kwasy Omega-3.",
    description: "Hipoalergiczna receptura stworzona z myślą o psach z wrażliwym układem pokarmowym i skłonnością do alergii. Wykorzystanie kaczki jako jedynego źródła białka zwierzęcego minimalizuje ryzyko reakcji alergicznych, a dodatek ziemniaków zapewnia łatwo przyswajalną energię. Olej z łososia dostarcza kwasów Omega-3, które dbają o kondycję skóry i piękny wygląd sierści Twojego psa.",
    ingredients: "Suszone mięso z kaczki (min. 30%), suszone ziemniaki (20%), białko grochu, tłuszcz z kaczki, olej z łososia (2%), drożdże piwne, pulpa buraczana, minerały, witaminy.",
    additionalInfo: "Karma w 100% bezzbożowa. Idealna w diecie eliminacyjnej u psów z nietolerancją kurczaka lub wołowiny.",
    tags: ["Wiek: Dorosły", "Specjalne potrzeby: Bezzbożowa", "Specjalne potrzeby: Dla alergików"]
  },
  {
    name: "NatureBite Naturalny Gryzak Dla Psa Poroże Jelenia Rozmiar L 150g Trwały I Bogaty W Minerały Dla Zdrowych Zębów",
    animalType: "Pies",
    subCategory: "Zabawki",
    company: "NatureBite",
    price: 105.00,
    promoPrice: null,
    shortDescription: "W 100% naturalny, bezzapachowy gryzak pozyskiwany z zrzutów jelenia. Zapewnia długie godziny zabawy, wspierając przy tym mechaniczne ścieranie kamienia nazębnego.",
    description: "W 100% naturalny, niezwykle trwały gryzak, który zaspokaja naturalną potrzebę żucia. Poroże jelenia jest bogate w minerały i wapń, a co najważniejsze – nie wydziela nieprzyjemnego zapachu ani nie brudzi dywanów. Podczas żucia struktura poroża ściera się, działając jak naturalna szczoteczka do zębów, co pomaga w usuwaniu kamienia nazębnego.",
    ingredients: "100% naturalne poroże jelenia (ze zrzutów).",
    additionalInfo: "Produkt w 100% naturalny, bez żadnych chemicznych dodatków. Rozmiar L przeznaczony dla psów średnich i dużych ras. Zalecamy nadzór podczas pierwszego podania gryzaka.",
    tags: ["Rozmiar: L", "Cechy: Naturalne"]
  },
  {
    name: "NatureBite 400g Kaczka z Jabłkiem i Rozmarynem (Karma mokra)",
    animalType: "Pies",
    subCategory: "Karma mokra",
    company: "NatureBite",
    price: 24.90,
    promoPrice: null,
    shortDescription: "Ekologiczna receptura z wysoką zawartością mięsa kaczki i aromatycznymi dodatkami wspierającymi trawienie. 100% naturalnych składników.",
    description: "Aromatyczna propozycja mokra, w której delikatne mięso kaczki spotyka się ze słodyczą jabłka. Rozmaryn nie tylko nadaje daniu wyjątkowego zapachu, ale działa również jako naturalny wspieracz trawienia. To karma pełnowartościowa, która sprawdzi się jako codzienny posiłek dla psa o każdym poziomie aktywności.",
    ingredients: "65% kaczka (mięso i podroby), 25% wywar z mięsa, jabłka (5%), bataty, rozmaryn (0,5%), minerały.",
    additionalInfo: "Produkt bez konserwantów, barwników i polepszaczy smaku. Po otwarciu przechowywać w lodówce do 2 dni.",
    tags: ["Wiek: Dorosły"]
  },
  {
    name: "NatureBite 800g Jagnięcina z Batatami i Cukinią (Karma mokra)",
    animalType: "Pies",
    subCategory: "Karma mokra",
    company: "NatureBite",
    price: 44.50,
    promoPrice: null,
    shortDescription: "Pełnowartościowy posiłek z delikatnej jagnięciny z certyfikowanych gospodarstw. Wspiera witalność i zdrowe procesy trawienne.",
    description: "Sycący posiłek z delikatnej jagnięciny, idealny dla psów o wrażliwym żołądku. Bataty dostarczają wartościowych węglowodanów złożonych, a cukinia wzbogaca dietę o błonnik i witaminy. Dzięki swojej konsystencji i smakowitości, karma ta jest chętnie wybierana nawet przez wybredne psy, wspierając ich codzienne zdrowie i energię.",
    ingredients: "60% jagnięcina (mięso i podroby), 28% wywar z mięsa, bataty (5%), cukinia (3%), olej lniany, minerały.",
    additionalInfo: "Duża puszka 800g – ekonomiczne rozwiązanie dla właścicieli większych psów. Naturalny skład wspiera witalność i zdrowe procesy trawienne.",
    tags: ["Wiek: Dorosły"]
  },
  {
    name: "PurrfectLine 85g Mokra Karma W Soczystej Galaretce Dla Kotów Sterylizowanych Mix Smaków I Niska Zawartość Tłuszczu",
    animalType: "Kot",
    subCategory: "Karma mokra",
    company: "PurrfectLine",
    price: 5.50,
    promoPrice: null,
    shortDescription: "Pyszne, wilgotne danie pomagające utrzymać prawidłową wagę mruczka. Zbalansowany poziom minerałów dba o drogi moczowe po zabiegu sterylizacji.",
    description: "Pyszne, wilgotne danie, które pomaga utrzymać prawidłową masę ciała po zabiegu sterylizacji. Specjalnie zbilansowany poziom minerałów dba o zdrowie dróg moczowych, a obniżona zawartość tłuszczu zapobiega tyciu. Kawałki mięsa w galaretce są niezwykle soczyste i zadowolą nawet najbardziej wybrednych kocich smakoszy.",
    ingredients: "60% mięsa i produktów pochodzenia zwierzęcego (w tym 10% kurczaka), wywar, minerały, tauryna, L-karnityna (wspierająca metabolizm).",
    additionalInfo: "Produkt bez dodatku cukru i sztucznych barwników. Po otwarciu przechowywać w lodówce do 24h. Podawać w temperaturze pokojowej.",
    tags: ["Wiek: Dorosły", "Specjalne potrzeby: Sterylizowane", "Specjalne potrzeby: Kontrola wagi"]
  },
  {
    name: "PurrfectLine 2kg Bezzbożowa Sucha Karma Dla Kotów Niewychodzących Z Kurczakiem Żurawiną I Formułą Anti-Hairball",
    animalType: "Kot",
    subCategory: "Karma sucha",
    company: "PurrfectLine",
    price: 89.00,
    promoPrice: 75.50,
    shortDescription: "Specjalistyczna karma wspierająca układ moczowy i ułatwiająca usuwanie kul włosowych. Idealnie zbilansowana kaloryczność dla kotów domowych.",
    description: "Kompletny posiłek stworzony z myślą o kotach żyjących w domu, które mają mniej ruchu. Formuła \"Anti-Hairball\" zawiera naturalne włókna roślinne, które wspomagają przesuwanie się połkniętej sierści przez układ trawienny, zapobiegając powstanawaniu kul włosowych. Bezzbożowy skład jest lekkostrawny i bezpieczny dla kocich brzuszków.",
    ingredients: "Suszone mięso z kurczaka (30%), świeży kurczak (15%), ziemniaki, groszek, błonnik roślinny, tłuszcz z kurczaka, olej z łososia (1,5%), żurawina, tauryna, witaminy i minerały.",
    additionalInfo: "Zamykane opakowanie typu „zipper” pozwala zachować świeżość chrupek na dłużej. Zapewnij kotu stały dostęp do świeżej wody pitnej.",
    tags: ["Specjalne potrzeby: Bezzbożowa", "Specjalne potrzeby: Niewychodzące"]
  },
  {
    name: "PurrfectTower Wysoki Drapak Wieża Z Sizalem i Budką (170cm)",
    animalType: "Kot",
    subCategory: "Drapaki",
    company: "PurrfectLine",
    price: 349.00,
    promoPrice: null,
    shortDescription: "Wielopoziomowy plac zabaw dla kota. Posiada grube słupki owinięte naturalnym sizalem, przytulną budkę do ukrywania się oraz górne legowisko obserwacyjne. Idealny dla kotów, które uwielbiają wspinaczkę.",
    description: "Wielopoziomowe królestwo dla Twojego mruczka. Drapak PurrfectTower został zaprojektowany z myślą o kotach, które kochają wysokość i obserwację otoczenia. Solidna podstawa gwarantuje stabilność nawet przy najbardziej energicznych skokach, a sizalowe słupki wytrzymają lata intensywnego ostrzenia pazurków.",
    ingredients: "Płyta wiórowa o wysokiej gęstości, naturalna lina sizalowa (8mm), plusz syntetyczny (gramatura 500g/m2), elements montażowe ze stali.",
    additionalInfo: "Zestaw zawiera instrukcję montażu oraz wszystkie niezbędne śruby. Zaleca się okresowe dokręcanie śrub po ok. miesiącu użytkowania, aby utrzymać maksymalną stabilność konstrukcji.",
    tags: ["Typ: Wieża", "Rozmiar: Wysoki", "Materiał: Sizal", "Funkcje: Wielopoziomowy"]
  },
  {
    name: "NatureBite Ekologiczna Mata Do Drapania Z Tektury Falistej (Z Kocimiętką)",
    animalType: "Kot",
    subCategory: "Drapaki",
    company: "NatureBite",
    price: 45.00,
    promoPrice: null,
    shortDescription: "Płaski, poziomy drapak wykonany z mocnej, w 100% biodegradowalnej tektury. W zestawie znajduje się suszona kocimiętka, która zachęca mruczka do korzystania z maty zamiast z mebli.",
    description: "Proste, tanie i niezwykle skuteczne rozwiązanie w walce o całe meble. Mata NatureBite jest wykonana w 100% z wytrzymałej tektury falistej, która doskonale imituje korę drzew – naturalny materiał do drapania dla kotów. W zestawie znajduje się saszetka z ekologiczną kocimiętką, która dodatkowo zachęci pupila do korzystania z maty.",
    ingredients: "100% naturalna tektura falista z recyklingu, suszona kocimiętka (w saszetce).",
    additionalInfo: "Produkt w pełni biodegradowalny i nadający się do recyklingu. Gdy jedna strona się zużyje, matę można odwrócić na drugą stronę, co podwaja jej żywotność.",
    tags: ["Typ: Mata", "Materiał: Tektura"]
  },
  {
    name: "Calico Zamknięta Kuweta Z Filtrem Węglowym (Czarno-Biała)",
    animalType: "Kot",
    subCategory: "Żwirek",
    company: "Calico",
    price: 119.00,
    promoPrice: null,
    shortDescription: "Dyskretna i elegancka kuweta z drzwiczkami wahadłowymi. Wbudowany w dach filtr z węglem aktywnym skutecznie neutralizuje nieprzyjemne zapachy, zapobiegając ich rozprzestrzenianiu się po mieszkaniu.",
    description: "Zapewnij swojemu kotu prywatność, a sobie czyste powietrze w mieszkaniu. Zamknięta kuweta Calico skutecznie ogranicza roznoszenie się żwirku poza jej obręb, a wbudowany w dach filtr węglowy neutralizuje nieprzyjemne zapachy. Nowoczesny design i łatwy w czyszczeniu plastik sprawiają, że toaletka wygląda elegancko w każdym wnętrzu.",
    ingredients: "Wysokiej jakości tworzywo sztuczne (ABS), filtr z węgla aktywnego, zatrzaski boczne.",
    additionalInfo: "Filtr węglowy należy wymieniać co 3-6 miesięcy w zależności od intensywności użytkowania. Łatwa w demontażu konstrukcja pozwala na błyskawiczne umycie kuwety pod bieżącą wodą.",
    tags: ["Typ: Kuweta zamknięta"]
  },
  {
    name: "NatureBite Żwirek Kukurydziany Zbrylający 100% Naturalny 10L",
    animalType: "Kot",
    subCategory: "Żwirek",
    company: "NatureBite",
    price: 49.90,
    promoPrice: null,
    shortDescription: "Ekologiczny, wyjątkowo wydajny żwirek, który błyskawicznie chłonie wilgoć tworząc zwarte grudki. Jest w 100% biodegradowalny – można go bezpiecznie usuwać drogą sanitarną.",
    description: "Wyjątkowo wydajny żwirek, który powstał z naturalnych włókien kukurydzianych. Błyskawicznie chłonie wilgoć, tworząc bardzo zwarte i łatwe do usunięcia bryłki, co pozwala utrzymać kuwetę w idealnej czystości. Jest w 100% biodegradowalny – zużyty żwirek można bezpiecznie usuwać drogą sanitarną (spłukiwać w toalecie), co jest ogromnym ułatwieniem w codziennym sprzątaniu.",
    ingredients: "100% naturalne włókna kukurydziane, naturalne spoiwo roślinne.",
    additionalInfo: "Produkt całkowicie pyłowy, co czyni go bezpiecznym dla kotów z alergiami i wrażliwymi drogami oddechowymi. Neutralny zapach, który nie drażni kociego węchu.",
    tags: ["Typ: Kukurydziany", "Właściwości: Zbrylający", "Właściwości: Ekologiczny"]
  },
  {
    name: "PurrfectPlay Interaktywna Wędka Z Piórami Ptaka i Dzwoneczkiem",
    animalType: "Kot",
    subCategory: "Zabawki Kot",
    company: "PurrfectLine",
    price: 18.50,
    promoPrice: null,
    shortDescription: "Klasyk, którego nie może zabraknąć w żadnym kocim domu. Elastyczny patyk i naturalne piórka na sznurku naśladują ruchy ofiary, budząc w kocie prawdziwy instynkt łowcy.",
    description: "Klasyczna zabawka, która w każdym kocie budzi instynkt drapieżnika. Giętki i wytrzymały patyk pozwala na realistyczne naśladowanie ruchów ptaka, a naturalne piórka oraz delikatny dźwięk dzwoneczka dodatkowo prowokują mruczka do skoków i pościgów. Idealna zabawka do zacieśniania więzi między kotem a opiekunem poprzez wspólną zabawę.",
    ingredients: "Elastyczny pręt z tworzywa, nylonowa linka, naturalne pióra ptasie (odkażone), metalowy dzwoneczek.",
    additionalInfo: "Pamiętaj, aby po zakończeniu zabawy schować wędkę w bezpieczne miejsce – pod nadzorem zabawa jest bezpieczna, ale pozostawiony sam sobie kot może zjeść piórka lub linkę.",
    tags: ["Typ zabawki: Wędka", "Materiał: Piórka"]
  },
  {
    name: "Calico Elektryczna Zabawki \"Uciekająca Mysz\"",
    animalType: "Kot",
    subCategory: "Zabawki Kot",
    company: "Calico",
    price: 65.00,
    promoPrice: null,
    shortDescription: "Inteligentna zabawka, która porusza się w nieprzewidywalny sposób i automatycznie omija przeszkody. Posiada wbudowany tryb czuwania – aktywuje się, gdy kot trąci ją łapą.",
    description: "Inteligentna zabawka, która zapewnia rozrywkę nawet podczas Twojej nieobecności. Myszka porusza się w nieprzewidywalny sposób, automatycznie omijając przeszkody w mieszkaniu. Dzięki wbudowanemu czujnikowi dotyku, zabawka aktywuje się w momencie, gdy kot trąci ją łapą, co sprawia, że każda sesja zabawy jest inna i ekscytująca.",
    ingredients: "Wysokiej jakości tworzywo ABS (odporne na uderzenia), gumowe kółka, moduł elektroniczny, wbudowany akumulator litowo-jonowy.",
    additionalInfo: "Ładowanie odbywa się za pomocą dołączonego kabla USB. Tryb oszczędzania energii sprawia, że myszka przechodzi w stan uśpienia po dłuższej bezczynności.",
    tags: ["Typ zabawki: Interaktywna", "Materiał: Guma", "Cechy: Automatyczne"]
  },
  {
    name: "Calico Miękka Budka Do Spania (Szara)",
    animalType: "Kot",
    subCategory: "Legowiska Kot",
    company: "Calico",
    price: 89.00,
    promoPrice: null,
    shortDescription: "Zamknięte, niezwykle przytulne legowisko w kształcie igloo. Zapewnia kotu poczucie maksymalnego bezpieczeństwa i ciepła. Wewnątrz znajduje się wyjmowana, dwustronna poduszka.",
    description: "Przytulne igloo, które zapewnia kotu poczucie bezpieczeństwa i zacisza. Idealne dla zwierząt, które lubią się chować i odpoczywać w odosobnieniu. Budka jest niezwykle miękka, a wyjmowana dwustronna poduszka pozwala na szybką zmianę aranżacji – od miękkiego pluszu po chłodniejszą stronę na lato.",
    ingredients: "Pianka poliuretanowa, poszycie z miękkiego pluszu poliestrowego (100%), spód wykonany z tkaniny antypoślizgowej.",
    additionalInfo: "Całość można prać w pralce w temperaturze 30°C. Budka utrzymuje kształt nawet po praniu.",
    tags: ["Typ: Budka", "Materiał: Plusz", "Cechy: Antypoślizgowe"]
  },
  {
    name: "PurrfectRest Pluszowe Legowisko Na Parapet Z Antypoślizgowym Spodem",
    animalType: "Kot",
    subCategory: "Legowiska Kot",
    company: "PurrfectLine",
    price: 55.00,
    promoPrice: null,
    shortDescription: "Podłużna, miękka mata idealnie dopasowana do standardowych parapetów. Izoluje od zimna i pozwala kotu w komforcie obserwować świat za oknem.",
    description: "Idealne rozwiązanie dla kotów-obserwatorów, które uwielbiają spędzać godziny, wpatrując się w okno. Ta miękka mata doskonale izoluje od zimnego parapetu, oferując komfortowe miejsce do drzemki w promieniach słońca. Antypoślizgowy spód sprawia, że legowisko nie przesuwa się nawet podczas gwałtownych zrywów kota w stronę \"zwierzyny\" za szybą.",
    ingredients: "Plusz poliestrowy (100%), wypełnienie z waty poliestrowej, spód z silikonowymi wypustkami antypoślizgowymi.",
    additionalInfo: "Chroni parapet przed zadrapaniami kocimi pazurkami. Można prać w pralce w niskiej temperaturze.",
    tags: ["Typ: Mata", "Materiał: Plusz", "Cechy: Antypoślizgowe"]
  },
  {
    name: "AquaPurr Cicha Fontanna Ze Stali Nierdzewnej 1.5L",
    animalType: "Kot",
    subCategory: "Miski i poidła Kot",
    company: "AquaPurr",
    price: 139.00,
    promoPrice: null,
    shortDescription: "Higieniczne poidło, które zachęca koty do częstszego picia wody, co chroni ich nerki. Stal nierdzewna zapobiega namnażaniu się bakterii i powstawaniu kociego trądziku na brodzie.",
    description: "Higieniczne poidło, które zachęca koty do częstszego picia wody, co wspiera zdrowie nerek i układu moczowego. Stal nierdzewna, z której wykonana jest misa, zapobiega namnażaniu się bakterii i powstawaniu tzw. \"kociego trądziku\" na brodzie, co często zdarza się przy miskach plastikowych.",
    ingredients: "Wysokiej jakości stal nierdzewna (część główna), pompa plastikowa, wymienny wkład filtrujący (węgiel aktywny).",
    additionalInfo: "Stalową część można bezpiecznie myć w zmywarce. Bardzo cicha praca silniczka zapewnia komfort domownikom nawet w nocy. Zasilanie USB.",
    tags: ["Typ: Fontanna", "Materiał: Metalowe", "Cechy: Automatyczne", "Cechy: Filtrujące wodę"]
  },
  {
    name: "ErgoBowl Ceramiczna Miska Profilowana (Płaska)",
    animalType: "Kot",
    subCategory: "Miski i poidła Kot",
    company: "ErgoBowl",
    price: 34.90,
    promoPrice: null,
    shortDescription: "Szeroka i płytka miska zaprojektowana specjalnie, by zapobiegać tzw. \"zmęczeniu wąsów\" (whisker fatigue). Ciężka ceramika sprawia, że miska nie przesuwa się podczas jedzenia.",
    description: "Szeroka i płytka miska zaprojektowana specjalnie, by zapobiegać tzw. \"zmęczeniu wąsów\" (whisker fatigue). Koty nie lubią dotykać ścianek miski swoimi wrażliwymi wibrysami podczas jedzenia – ta miska eliminuje ten problem. Ciężka ceramika sprawia, że naczynie jest stabilne i nie przesuwa się po podłodze.",
    ingredients: "Wysokiej jakości ceramika glazurowana, bezpieczna dla żywności.",
    additionalInfo: "Można myć w zmywarce. Odporna na zarysowania i rozwój bakterii.",
    tags: ["Typ: Miska", "Materiał: Ceramiczne"]
  },
  {
    name: "Calico Transporter Plastikowy Z Metalowymi Drzwiczkami",
    animalType: "Kot",
    subCategory: "Transportery Kot",
    company: "Calico",
    price: 105.00,
    promoPrice: null,
    shortDescription: "Klasyczny, bezpieczny transporter z twardego plastiku z łatwym systemem zamykania. Posiada certyfikat IATA, dzięki czemu nadaje się do transportu lotniczego.",
    description: "Klasyczny, bezpieczny transporter z twardego plastiku z łatwym systemem zamykania. Posiada atest IATA, dzięki czemu jest akceptowany przez większość linii lotniczych. Drzwiczki wykonane z solidnej stali zapewniają trwałość, a liczne otwory wentylacyjne gwarantują swobodny przepływ powietrza.",
    ingredients: "Wytrzymały polipropylen (PP), stalowe drzwiczki z zatrzaskiem, plastikowe elementy montażowe.",
    additionalInfo: "Lekki w utrzymaniu czystości – można myć wodą z dodatkiem łagodnego detergentu. Idealny do transportu weterynaryjnego i podróży.",
    tags: ["Typ: Plastikowy transporter", "Cechy: Lotniczy", "Cechy: Wentylowany"]
  },
  {
    name: "SafeJourney Plecak Transportowy Z Oknem \"Astronauta\" (Miętowy)",
    animalType: "Kot",
    subCategory: "Transportery Kot",
    company: "SafeJourney",
    price: 159.00,
    promoPrice: null,
    shortDescription: "Nowoczesny plecak z przezroczystą kopułą, przez którą kot może wyglądać na zewnątrz. Wyposażony w otwory wentylacyjne i ergonomiczną konstrukcję odciążającą plecy właściciela.",
    description: "Nowoczesny plecak dla odważnych kotów, które lubią być blisko swojego opiekuna. Dzięki przezroczystej kopule kot może bezpiecznie obserwować otoczenie, nie czując się odizolowanym. Ergonomiczna konstrukcja z systemem wentylacji zapewnia komfort zarówno kotu, jak i Tobie, dzięki miękkim szelkom i stabilizacji na plecach.",
    ingredients: "Wytrzymała tkanina Oxford, akrylowa kopuła (\"okno\"), oddychająca siatka poliestrowa, plastikowe elementy złączne.",
    additionalInfo: "Maksymalne obciążenie wynosi 7 kg. Plecak posiada boczne kieszenie na smakołyki lub dokumenty podróżne.",
    tags: ["Typ: Plecak", "Cechy: Wentylowany"]
  },
  {
    name: "PurrfectBrush Zgrzebło Do Usuwania Podszerstka (Długi Włos)",
    animalType: "Kot",
    subCategory: "Higiena i pielęgnacja Kot",
    company: "PurrfectLine",
    price: 75.00,
    promoPrice: null,
    shortDescription: "Profesjonalne narzędzie, które redukuje linienie nawet o 90%. Bezpiecznie i bezboleśnie wyciąga martwy podszerstek, zapobiegając powstawaniu kołtunów i kul włosowych w żołądku.",
    description: "Profesjonalne narzędzie, które pozwala zredukować linienie Twojego kota nawet o 90%. Bezpiecznie i bezboleśnie wyciąga martwy podszerstek, nie uszkadzając przy tym włosa okrywowego. Regularne stosowanie zgrzebła znacząco ogranicza powstawanie kołtunów oraz kul włosowych w żołądku, co jest kluczowe dla zdrowia każdego długowłosego mruczka.",
    ingredients: "Ostrze ze stali nierdzewnej, ergonomiczna rączka z powłoką antypoślizgową (TPR).",
    additionalInfo: "Wyposażone w przycisk szybkiego czyszczenia ostrza z sierści (tzw. \"self-cleaning\"). Stosować tylko na suchej sierści.",
    tags: ["Typ produktu: Szczotka", "Przeznaczenie: Długa sierść"]
  },
  {
    name: "Calico Delikatny Płyn Do Przemywania Oczu 100ml",
    animalType: "Kot",
    subCategory: "Higiena i pielęgnacja Kot",
    company: "Calico",
    price: 22.90,
    promoPrice: null,
    shortDescription: "Naturalny preparat na bazie świetlika i soli fizjologicznej. Doskonale usuwa zacieki łzowe i zanieczyszczenia, łagodząc ewentualne podrażnienia okolic oczu.",
    description: "Delikatny preparat stworzony specjalnie dla wrażliwej skóry wokół oczu. Płyn skutecznie usuwa zaschnięte zacieki łzowe oraz zanieczyszczenia, nie wywołując szczypania ani podrażnień. Dzięki swojej łagodnej formule działa kojąco i zapobiega stanom zapalnym, sprawiając, że okolice oczu Twojego pupila są zawsze czyste i zdrowe.",
    ingredients: "Woda demineralizowana, chlorek sodu (fizjologiczny roztwór), ekstrakt z kwiatów nagietka, ekstrakt z oczaru wirginijskiego, alantoina.",
    additionalInfo: "Produkt przebadany dermatologicznie. Do stosowania zewnętrznego – nasącz wacik płynem i delikatnie przetrzyj zabrudzone miejsca wokół oka.",
    tags: ["Typ produktu: Szampon"]
  },
  {
    name: "GreenMeadow 500g Naturalny Pokarm Zioła I Trawy Dla Królików I Kawii Domowych Z Dodatkiem Nagietka",
    animalType: "Małe zwierzęta",
    subCategory: "Karma Małe Zwierzęta",
    company: "GreenMeadow",
    price: 24.90,
    promoPrice: null,
    shortDescription: "Wysokobłonnikowy pokarm będący podstawą diety małych roślinożerców. Wspiera naturalne ścieranie zębów i zapewnia prawidłową pracę jelit.",
    description: "Kompletna mieszanka ziołowo-trawiasta, która stanowi podstawę codziennej diety królików i kawii domowych (świnki morskiej). Wysoka zawartość włókna surowego wspiera prawidłową pracę układu pokarmowego i dba o ścieranie zębów. Dodatek nagietka wspomaga odporność i działa przeciwzapalnie na układ trawienny.",
    ingredients: "Suszone trawy łąkowe (60%), mniszek lekarski, babka lancetowata, natka pietruszki, płatki nagietka (2%), kwiaty hibiskusa.",
    additionalInfo: "Produkt w 100% naturalny, bez zbóż i barwników. Zapewnij zwierzęciu nieograniczony dostęp do świeżej wody pitnej.",
    tags: ["Gatunek: Królik", "Gatunek: Świnka morska", "Smak / dodatki: Ziołowe"]
  },
  {
    name: "NatureBite Ekologiczne Siano Łąkowe Z Ziołami i Mniszkiem Lekarskim 1kg",
    animalType: "Małe zwierzęta",
    subCategory: "Siano i przysmaki",
    company: "NatureBite",
    price: 19.90,
    promoPrice: null,
    shortDescription: "Ręcznie pakowane, odpylone siano z certyfikowanych łąk. Bogate w błonnik i naturalne zioła, stanowi absolutną podstawę codziennej diety królików i świnek morskich, dbając o ścieranie zębów.",
    description: "Absolutna baza diety małych roślinożerców. Nasze siano pochodzi z ekologicznych łąk, jest starannie suszone i odpylone, co czyni je bezpiecznym nawet dla zwierząt z wrażliwymi drogami oddechowymi. Długie, bogate we włókno łodygi są niezbędne do prawidłowego ścierania stale rosnących zębów oraz zapewnienia właściwej perystaltyki jelit.",
    ingredients: "100% suszone siano łąkowe z dodatkiem ziół (mniszek lekarski, babka, krwawnik).",
    additionalInfo: "Przechowywać w suchym i przewiewnym miejscu, z dala od światła słonecznego, aby zachować aromat i wartości odżywcze.",
    tags: ["Typ: Siano", "Smak / dodatki: Ziołowe"]
  },
  {
    name: "GreenMeadow Chrupiące Kolby Z Warzywami Ogrodowymi Dla Gryzoni (2 szt.)",
    animalType: "Małe zwierzęta",
    subCategory: "Siano i przysmaki",
    company: "GreenMeadow",
    price: 12.50,
    promoPrice: null,
    shortDescription: "Wypiekane w piecu kolby na naturalnym drewnianym patyku. Smakowite połączenie marchewki, buraka i pasternaku dostarcza witamin i zapewnia długie godziny zdrowego gryzienia.",
    description: "Zdrowa przekąska, która sprawia, że Twój pupil musi się trochę napracować, aby wydobyć pokarm. Chrupanie kolby nie tylko zaspokaja głód, ale również zapewnia zwierzęciu zajęcie na długi czas, zapobiegając nudzie w klatce. Dzięki wypiekaniu w niskiej temperaturze, warzywa zachowują większość swoich witamin i minerałów.",
    ingredients: "Ziarna zbóż, suszona marchew (15%), suszony burak (10%), pasternak, naturalne spoiwo roślinne (skrobia ziemniaczana).",
    additionalInfo: "Podawać jako uzupełnienie diety. Ze względu na zawartość zbóż, nie zaleca się podawania więcej niż jednej kolby tygodniowo.",
    tags: ["Typ: Kolby", "Smak / dodatki: Warzywne"]
  },
  {
    name: "SafeHome Przestronna Klatka Dla Świnki Morskiej i Królika (100cm)",
    animalType: "Małe zwierzęta",
    subCategory: "Klatki i domki",
    company: "SafeHome",
    price: 189.00,
    promoPrice: null,
    shortDescription: "Wytrzymała klatka z głęboką kuwetą zapobiegającą rozsypywaniu ściółki. Posiada całkowicie otwieraną przednią ściankę oraz paśnik na siano w zestawie.",
    description: "Przestronny, bezpieczny dom, który daje zwierzęciu poczucie komfortu. Solidna konstrukcja z głęboką kuwetą zapobiega wysypywaniu się ściółki na zewnątrz, co ułatwia utrzymanie czystości wokół klatki. Otwierana przednia ścianka pozwala na łatwy kontakt ze zwierzęciem i szybkie sprzątanie bez konieczności demontażu całości.",
    ingredients: "Wysokiej jakości stal ocynkowana (pręty), polipropylen (kuweta).",
    additionalInfo: "Klatka wymaga samodzielnego montażu (szybki system zatrzaskowy). W zestawie paśnik na siano (montowany zewnętrznie – oszczędność miejsca w środku).",
    tags: ["Typ: Klatka"]
  },
  {
    name: "TravelPet Mały Transporter Plastikowy Dla Chomika i Myszy (Niebieski)",
    animalType: "Małe zwierzęta",
    subCategory: "Transportery Małe Zwierzęta",
    company: "TravelPet",
    price: 39.00,
    promoPrice: null,
    shortDescription: "Kompaktowy i bezpieczny transporter z licznymi otworami wentylacyjnymi. Wyposażony w przezroczystą pokrywę otwieraną od góry i wygodne uchwyty. Idealny na wizyty u weterynarza.",
    description: "Bezpieczny i kompaktowy transporter zaprojektowany z myślą o najmniejszych gryzoniach. Liczne otwory wentylacyjne zapewniają stały dopływ świeżego powietrza, a przezroczysta pokrywa pozwala na łatwy podgląd zwierzęcia w trakcie podróży. Solidne zamknięcie gwarantuje, że pupil pozostanie bezpieczny wewnątrz.",
    ingredients: "Wytrzymały polipropylen (PP) bezpieczny dla zwierząt, metalowy zawias.",
    additionalInfo: "Idealny do krótkich wyjazdów do weterynarza. Uchwyt jest składany, co ułatwia przenoszenie.",
    tags: ["Typ: Plastikowy transporter"]
  },
  {
    name: "NatureBite Odpylone Trociny Drewniane Dla Gryzoni 15L",
    animalType: "Małe zwierzęta",
    subCategory: "Ściółka",
    company: "NatureBite",
    price: 14.90,
    promoPrice: null,
    shortDescription: "Miękkie, w 100% naturalne podłoże świerkowe pozbawione drażniącego pyłu. Świetnie wchłania wilgoć i pozwala małym zwierzętom na realizację naturalnej potrzeby kopania tuneli.",
    description: "Naturalne podłoże świerkowe, które zostało poddane dokładnemu procesowi odpylania, dzięki czemu jest w pełni bezpieczne dla dróg oddechowych Twojego gryzonia. Miękkie wiórki idealnie nadają się do budowania tuneli i gniazd, co pozwala zwierzęciu realizować jego naturalne instynkty kopania i zapewnia wysoki komfort termiczny.",
    ingredients: "100% naturalne drewno świerkowe (poddane procesowi odpylania).",
    additionalInfo: "Produkt w pełni kompostowalny i biodegradowalny. Należy wymieniać w zależności od potrzeb, zazwyczaj raz w tygodniu, aby zapewnić higienę w klatce.",
    tags: ["Typ: Ściółka"]
  },
  {
    name: "Pawsome Drewniany Żwirek Pellet Niezbrylający 10L",
    animalType: "Małe zwierzęta",
    subCategory: "Ściółka",
    company: "Pawsome",
    price: 29.90,
    promoPrice: null,
    shortDescription: "Silnie chłonny granulat z włókien roślinnych. Doskonale wiąże zapach amoniaku. Sprawdza się idealnie jako podkład do kuwet narożnych dla królików.",
    description: "Wyjątkowo chłonny granulat z włókien roślinnych, który doskonale wiąże wilgoć oraz nieprzyjemne zapachy, utrzymując klatkę w świeżości przez długi czas. Pellet nie przykleja się do łapek zwierzęcia i nie roznosi się po mieszkaniu, co znacząco ułatwia utrzymanie czystości w otoczeniu klatki.",
    ingredients: "100% sprasowane włókna drzew iglastych.",
    additionalInfo: "Produkt w pełni naturalny i biodegradowalny. Można utylizować drogą sanitarną lub kompostować. Idealny dla królików korzystających z kuwet narożnych.",
    tags: ["Typ: Pellet"]
  },
  {
    name: "WoodyPlay Naturalny Drewniany Domek Narożny Dla Świnki Morskiej",
    animalType: "Małe zwierzęta",
    subCategory: "Klatki i domki",
    company: "WoodyPlay",
    price: 45.00,
    promoPrice: null,
    shortDescription: "Wykonany z nielakierowanego drewna, bezpieczny do gryzienia. Narożny kształt pozwala zaoszczędzić miejsce w klatce, a płaski dach stanowi dodatkową półkę do siedzenia.",
    description: "Domek wykonany z surowego, nielakierowanego drewna, które jest w pełni bezpieczne do gryzienia przez małe zwierzęta. Narożny kształt pozwala na optymalne wykorzystanie przestrzeni w klatce, a płaski dach służy jako dodatkowa platforma do obserwacji otoczenia przez świnkę morską. To idealne miejsce na wypoczynek i poczucie bezpieczeństwa.",
    ingredients: "100% naturalne drewno liściaste, klej bezpieczny dla zwierząt.",
    additionalInfo: "Chronić przed nadmiernym zawilgoceniem. Gryzienie elementów domku pomaga w naturalnym ścieraniu siekaczy, co jest kluczowe dla zdrowia gryzoni.",
    tags: ["Typ: Domek", "Materiał: Drewno"]
  },
  {
    name: "ActiveRodent Bezpieczny Kołowrotek Z Pełnym Dnem 20cm",
    animalType: "Małe zwierzęta",
    subCategory: "Zabawki Małe Zwierzęta",
    company: "ActiveRodent",
    price: 59.00,
    promoPrice: null,
    shortDescription: "Całkowicie cichy kołowrotek z jednolitą bieżnią, która chroni drobne łapki chomików przed urazami. Posiada solidną, szeroką podstawę uniemożliwiającą przewrócenie zabawki.",
    description: "Cichy kołowrotek z jednolitą, pełną bieżnią, która eliminuje ryzyko zakleszczenia łapek lub ogonka, co jest częstym problemem w standardowych modelach z pręcikami. Solidna, szeroka podstawa zapewnia stabilność podczas intensywnego biegania, a przemyślana konstrukcja sprawia, że praca urządzenia jest niemal niesłyszalna dla domowników.",
    ingredients: "Wysokiej jakości tworzywo sztuczne (bez BPA), metalowe łożysko kulkowe.",
    additionalInfo: "Odpowiedni dla chomików i myszy. Regularnie czyść bieżnię z zabrudzeń, aby zachować płynność obrotu i higienę.",
    tags: ["Typ zabawki: Interaktywna", "Przeznaczenie: Aktywność"]
  },
  {
    name: "AquaDrop Poidło Kulkowe Odporne Na Gryzienie 250ml",
    animalType: "Małe zwierzęta",
    subCategory: "Miski i poidła Małe Zwierzęta",
    company: "AquaDrop",
    price: 18.90,
    promoPrice: null,
    shortDescription: "Szczelne poidło z podwójnym systemem kulek ze stali nierdzewnej, zapobiegającym kapaniu. Szklana obudowa ułatwia czyszczenie i gwarantuje, że zwierzę nie przegryzie zbiornika.",
    description: "Szczelne poidło z podwójnym systemem kulek ze stali nierdzewnej, które skutecznie zapobiega kapaniu wody w klatce. Szklana obudowa jest nie tylko higieniczna i łatwa do czyszczenia, ale przede wszystkim odporna na ostre zęby gryzoni, co gwarantuje długą żywotność produktu i stały dostęp do czystej wody dla Twojego pupila.",
    ingredients: "Szkło borokrzemowe (obudowa), stal nierdzewna (dysza i kulki), uszczelka silikonowa.",
    additionalInfo: "Mocowanie z drutu pozwala na łatwy montaż na każdym typie klatki. Regularnie sprawdzaj, czy kulka w dyszy nie została zablokowana przez osad z wody.",
    tags: ["Typ: Poidło", "Cechy: Zawieszane"]
  },
  {
    name: "ErgoBowl Ciężka Ceramiczna Miseczka Na Pokarm (Pudrowy Róż)",
    animalType: "Małe zwierzęta",
    subCategory: "Miski i poidła Małe Zwierzęta",
    company: "ErgoBowl",
    price: 15.90,
    promoPrice: null,
    shortDescription: "Niska, stabilna miska z grubej ceramiki. Jej ciężar uniemożliwia radosne wywracanie jedzenia przez energiczne króliki i świnki morskie. Łatwa do mycia, również w zmywarce.",
    description: "Niska, stabilna miska wykonana z grubej ceramiki, która dzięki swojemu ciężarowi uniemożliwia radosne wywracanie jedzenia przez energiczne króliki i świnki morskie. Estetyczny design w kolorze pudrowego różu sprawia, że miseczka ładnie prezentuje się w każdej klatce, a gładka powierzchnia ułatwia codzienne mycie.",
    ingredients: "Wysokiej jakości ceramika wypalana w wysokiej temperaturze, bezpieczne szkliwo dopuszczone do kontaktu z żywnością.",
    additionalInfo: "Można myć w zmywarce. Odporna na zarysowania i przebarwienia.",
    tags: ["Typ: Miska", "Materiał: Ceramiczne"]
  },
  {
    name: "CleanFur Kąpielowy Piasek Pielęgnacyjny Dla Szynszyli i Koszatniczek 1.5kg",
    animalType: "Małe zwierzęta",
    subCategory: "Higiena i pielęgnacja Małe Zwierzęta",
    company: "CleanFur",
    price: 24.90,
    promoPrice: null,
    shortDescription: "Drobniutki, zaokrąglony piasek wulkaniczny, który dociera do najgłębszych warstw futra. Usuwa nadmiar sebum i wilgoci, pozostawiając sierść puszystą i lśniącą.",
    description: "Drobnoziarnisty piasek wulkaniczny, niezbędny dla zdrowia sierści szynszyli i koszatniczek. Podczas kąpieli piaskowych, drobinki wnikają głęboko między włosy, skutecznie usuwając nadmiar sebum, wilgoć oraz zanieczyszczenia, dzięki czemu futro staje się puszyste, miękkie i pozbawione kołtunów.",
    ingredients: "100% naturalny, odpylony piasek sepiolitowy (wulkaniczny).",
    additionalInfo: "Zaleca się kąpiel w piasku min. 3 razy w tygodniu. Po kąpieli warto przesiać piasek przez sitko, aby usunąć zanieczyszczenia i wydłużyć jego świeżość.",
    tags: ["Cechy: Naturalne"]
  },
  {
    name: "SafeClip Bezpieczne Cążki Do Obcinania Pazurków Dla Małych Zwierząt",
    animalType: "Małe zwierzęta",
    subCategory: "Higiena i pielęgnacja Małe Zwierzęta",
    company: "SafeClip",
    price: 22.00,
    promoPrice: null,
    shortDescription: "Precyzyjne nożyczki ze stali nierdzewnej zaprojektowane specjalnie dla drobnych pazurów. Antypoślizgowy, gumowany uchwyt zapewnia pewny chwyt i pełną kontrolę podczas zabiegu.",
    description: "Precyzyjne nożyczki ze stali nierdzewnej, zaprojektowane specjalnie dla drobnych pazurków królików, świnek morskich i innych małych gryzoni. Ergonomiczny kształt i antypoślizgowa rączka zapewniają pewny chwyt, co jest kluczowe dla bezpiecznego przeprowadzenia zabiegu pielęgnacyjnego bez stresu dla zwierzęcia.",
    ingredients: "Stal nierdzewna wysokiej jakości, tworzywo ABS z gumowaną powłoką na uchwytach.",
    additionalInfo: "Przed obcinaniem upewnij się, że widzisz linię żywej tkanki (rdzeń pazurka), aby uniknąć skaleczenia. Regularne przycinanie zapobiega wrastaniu pazurów.",
    tags: ["Typ produktu: Obcinacz do pazurów"]
  }
];

const animalTypeMap: Record<string, string> = {
  "Pies": "DOG",
  "Kot": "CAT",
  "Małe zwierzęta": "SMALL_ANIMALS"
};

const generateSlug = (text: string) => {
  return text.toLowerCase().trim().replace(/[ąáàâãäå]/g, "a").replace(/[ęéèêë]/g, "e").replace(/[íìîï]/g, "i").replace(/[óòôõöø]/g, "o").replace(/[úùûü]/g, "u").replace(/[ć]/g, "c").replace(/[ł]/g, "l").replace(/[ń]/g, "n").replace(/[ś]/g, "s").replace(/[źż]/g, "z").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
};

export async function GET() {
  try {
    const baseUri = process.env.MONGODB_URI;
    if (!baseUri) return NextResponse.json({ success: false, error: "Brak MONGODB_URI!" }, { status: 500 });

    console.log("Łączenie z bazą mydb...");
    const conn = await mongoose.createConnection(baseUri, { dbName: "mydb" }).asPromise();

    const Category = conn.models.Category || conn.model("Category", CategoryModel.schema, "categories");
    const TagGroup = conn.models.TagGroup || conn.model("TagGroup", TagGroupModel.schema, "taggroups");
    const Tag = conn.models.Tag || conn.model("Tag", TagModel.schema, "tags");
    const Product = conn.models.Product || conn.model("Product", ProductModel.schema, "products");
    const Company = conn.models.Company || conn.model("Company", CompanySchema, "companies");

  
    await Product.deleteMany({});

    const allCategories = await Category.find({}).lean();
    const allTagGroups = await TagGroup.find({}).lean();
    const allTags = await Tag.find({}).lean();

    const productsToInsert: any[] = [];

    for (const item of excelProducts) {
      let rawSubCat = item.subCategory;
      let finalTags = [...item.tags];

      
      if (rawSubCat.toLowerCase().includes("karma")) {
        if (rawSubCat.toLowerCase().includes("mokra") && !finalTags.includes("Karma mokra")) finalTags.push("Karma mokra");
        if (rawSubCat.toLowerCase().includes("sucha") && !finalTags.includes("Karma sucha")) finalTags.push("Karma sucha");
        
        if (item.animalType === "Kot") rawSubCat = "Karma Kot";
        else if (item.animalType === "Małe zwierzęta") rawSubCat = "Karma Małe Zwierzęta";
        else rawSubCat = "Karma";
      }

      
      const expectedSlug = generateSlug(rawSubCat);
      const matchedCategory = allCategories.find(c => c.slug === expectedSlug);

      if (!matchedCategory) {
        console.warn(` Pomijam produkt "${item.name}". Brak podkategorii dla sluga: ${expectedSlug}`);
        continue;
      }

      
      let companyDoc = await Company.findOne({ name: item.company });
      if (!companyDoc) {
        companyDoc = await Company.create({ name: item.company });
      }

      
      const allowedGroupIds = allTagGroups
        .filter(g => g.category.toString() === matchedCategory._id.toString())
        .map(g => g._id.toString());

      const matchedTagIds: mongoose.Types.ObjectId[] = [];

      for (const rawTagName of finalTags) {
        
        const cleanTagName = rawTagName.includes(":") ? rawTagName.split(":")[1].trim() : rawTagName.trim();

        
        const foundTag = allTags.find(t => 
          t.name.toLowerCase().trim() === cleanTagName.toLowerCase().trim() && 
          allowedGroupIds.includes(t.group.toString())
        );

        if (foundTag) {
          matchedTagIds.push(foundTag._id as mongoose.Types.ObjectId);
        } else {
          console.warn(`Pomijam tag "${cleanTagName}" w produkcie "${item.name}" (Nie pasuje do filtrów tej kategorii).`);
        }
      }

    
      productsToInsert.push({
        name: item.name,
        description: item.description,
        ingredients: item.ingredients,
        additionalInfo: item.additionalInfo,
        price: item.price,
        promoPrice: item.promoPrice,
        oldPrice: item.promoPrice ? item.price : null,
        stock: 50, 
        category: matchedCategory._id,
        company: companyDoc._id,
        animalType: animalTypeMap[item.animalType] || "DOG",
        images: [], // Obrazki puste
        rating: 0,
        popularity: 0,
        tags: finalTags, 
        isActive: 'isActive' in item ? item.isActive : true 
      });
    }

    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
    }

    await conn.close();

    return NextResponse.json({
      success: true,
      message: `Baza mydb gotowa! Produkty zmapowane bezbłędnie z uwzględnieniem powtarzających się tagów. Dodano ${productsToInsert.length} sztuk.`
    });

  } catch (error: any) {
    console.error("Błąd:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}