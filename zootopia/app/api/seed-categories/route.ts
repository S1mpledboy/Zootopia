import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Struktura danych pozostaje bez zmian
const fullShopStructure = [
  // ... (tutaj znajduje się Twoja pełna struktura z psami, kotami i małymi zwierzętami)
  {
    mainCategory: "Pies",
    subCategory: "Karma",
    groups: [
      { name: "Wiek", tags: ["Szczenię", "Dorosły", "Senior"] },
      { name: "Wielkość rasy", tags: ["Mini/mała <10kg", "Średnia 10-25kg", "Duża >25kg"] },
      { name: "Specjalne potrzeby", tags: ["Bezzbożowa", "Dla alergików", "Wysoka aktywność", "Nadwaga"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Legowiska",
    groups: [
      { name: "Rozmiar", tags: ["S", "M", "L", "XL"] },
      { name: "Materiał", tags: ["Plusz", "Welur", "Bawełna"] },
      { name: "Typ", tags: ["Kanapa", "Mata", "Budka", "Ortopedyczne"] },
      { name: "Cechy", tags: ["Wodoodporne", "Antypoślizgowe", "Chłodzące"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Zabawki",
    groups: [
      { name: "Typ zabawki", tags: ["Gryzak", "Piłka", "Szarpak", "Interaktywna"] },
      { name: "Materiał", tags: ["Guma", "Plusz", "Lina"] },
      { name: "Przeznaczenie", tags: ["Do aportu", "Na przysmaki", "Dentystyczne"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Smycze i obroże",
    groups: [
      { name: "Typ", tags: ["Smycz", "Automatyczna", "Obroża", "Szelki"] },
      { name: "Rozmiar", tags: ["XS", "S", "M", "L", "XL"] },
      { name: "Materiał", tags: ["Nylon", "Skóra", "Taśma", "Odblaskowe"] },
      { name: "Cechy", tags: ["Regulowane", "Odblaskowe", "Treningowe", "Wodoodporne"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Transportery",
    groups: [
      { name: "Rozmiar", tags: ["S", "M", "L", "XL"] },
      { name: "Typ", tags: ["Torba", "Plastikowy transporter", "Składany", "Samochodowy"] },
      { name: "Cechy", tags: ["Lotniczy", "Wentylowany", "Na kółkach", "Wodoodporny", "Miękkie wnętrze"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Miski i poidła",
    groups: [
      { name: "Typ", tags: ["Miska", "Podwójna miska", "Fontanna", "Automatyczny podajnik"] },
      { name: "Materiał", tags: ["Metalowe", "Ceramiczne", "Plastikowe", "Silikonowe"] },
      { name: "Cechy", tags: ["Antypoślizgowe", "Automatyczne", "Podwyższane", "Turystyczne"] }
    ]
  },
  {
    mainCategory: "Pies",
    subCategory: "Higiena i pielęgnacja",
    groups: [
      { name: "Typ produktu", tags: ["Szampon", "Szczotka", "Obcinacz do pazurów", "Preparaty przeciwkleszczowe", "Chusteczki"] },
      { name: "Przeznaczenie", tags: ["Krótka sierść", "Długa sierść", "Wrażliwa skóra", "Szczenięta"] },
      { name: "Cechy", tags: ["Naturalne", "Hipoalergiczne", "Weterynaryjne", "Bezzapachowe"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Karma Kot",
    displayName: "Karma",
    groups: [
      { name: "Wiek", tags: ["Kocię", "Dorosły", "Senior"] },
      { name: "Wielkość rasy", tags: ["Mini/mała <4kg", "Średnia 4-6kg", "Duża >6kg"] },
      { name: "Specjalne potrzeby", tags: ["Bezzbożowa", "Dla alergików", "Wysoka aktywność", "Nadwaga"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Drapaki",
    groups: [
      { name: "Typ", tags: ["Wieża", "Mata", "Słupek", "Wiszący", "Narożny"] },
      { name: "Rozmiar", tags: ["Niski", "Średni", "Wysoki"] },
      { name: "Materiał", tags: ["Sizal", "Drewno", "Plusz"] },
      { name: "Funkcje", tags: ["Z domkiem", "Z legowiskiem", "Wielopoziomowy", "Modułowy"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Legowiska Kot",
    displayName: "Legowiska",
    groups: [
      { name: "Rozmiar", tags: ["S", "M", "L"] },
      { name: "Typ", tags: ["Budka", "Mata", "Poduszka"] },
      { name: "Materiał", tags: ["Plusz", "Welur", "Bawełna", "Filc"] },
      { name: "Cechy", tags: ["Antypoślizgowe", "Chłodzące", "Wodoodporne", "Zdejmowany pokrowiec"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Zabawki Kot",
    displayName: "Zabawki",
    groups: [
      { name: "Typ zabawki", tags: ["Wędka", "Piłka", "Pluszowa", "Interaktywna", "Laser", "Na przysmaki"] },
      { name: "Materiał", tags: ["Plusz", "Guma", "Piórka", "Sizal"] },
      { name: "Przeznaczenie", tags: ["Aktywność", "Samodzielna zabawa", "Inteligencja", "Odkłaczanie", "Dentystyczne"] },
      { name: "Cechy", tags: ["Z kocimiętką", "Dźwiękowe", "Świecące", "Automatyczne"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Żwirek",
    groups: [
      { name: "Typ", tags: ["Bentonitowy", "Silikonowy", "Drewniany", "Kukurydziany"] },
      { name: "Właściwości", tags: ["Zbrylający", "Bezzapachowy", "Lawendowy", "Antybakteryjny", "Ekologiczny", "Niskopylący"] },
      { name: "Waga opakowania", tags: ["Małe", "Średnie", "Duże"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Transportery Kot",
    displayName: "Transportery",
    groups: [
      { name: "Rozmiar", tags: ["S", "M", "L"] },
      { name: "Typ", tags: ["Torba", "Plecak", "Plastikowy transporter", "Składany"] },
      { name: "Cechy", tags: ["Lotniczy", "Wodoodporny", "Wentylowany", "Na kółkach", "Miękkie wnętrze"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Miski i poidła Kot",
    displayName: "Miski i poidła",
    groups: [
      { name: "Typ", tags: ["Miska", "Podwójna miska", "Fontanna", "Automatyczny podajnik"] },
      { name: "Materiał", tags: ["Ceramiczne", "Metalowe", "Plastikowe", "Szklane"] },
      { name: "Cechy", tags: ["Antypoślizgowe", "Automatyczne", "Filtrujące wodę", "Podwyższane"] }
    ]
  },
  {
    mainCategory: "Kot",
    subCategory: "Higiena i pielęgnacja Kot",
    displayName: "Higiena i pielęgnacja",
    groups: [
      { name: "Typ produktu", tags: ["Szampon", "Szczotka", "Obcinacz do pazurów", "Chusteczki", "Preparaty przeciwpchelne"] },
      { name: "Przeznaczenie", tags: ["Krótka sierść", "Długa sierść", "Wrażliwa skóra", "Odkłaczanie"] },
      { name: "Cechy", tags: ["Naturalne", "Hipoalergiczne", "Bezzapachowe", "Weterynaryjne"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Karma Małe Zwierzęta",
    displayName: "Karma",
    groups: [
      { name: "Gatunek", tags: ["Królik", "Chomik", "Świnka morska", "Szynszyla"] },
      { name: "Wiek", tags: ["Junior", "Dorosły", "Senior"] },
      { name: "Dieta", tags: ["Bezzbożowa", "Naturalna", "High Fiber"] },
      { name: "Potrzeby", tags: ["Wrażliwy układ pokarmowy", "Kontrola wagi", "Wysoka aktywność"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Siano i przysmaki",
    groups: [
      { name: "Typ", tags: ["Siano", "Kolby", "Przysmaki", "Gryzaki"] },
      { name: "Smak / dodatki", tags: ["Ziołowe", "Owocowe", "Warzywne"] },
      { name: "Cechy", tags: ["Naturalne", "Dentystyczne", "Ekologiczne"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Klatki i domki",
    groups: [
      { name: "Typ", tags: ["Klatka", "Domek", "Tunel", "Hamak"] },
      { name: "Rozmiar", tags: ["S", "M", "L"] },
      { name: "Materiał", tags: ["Drewno", "Metal", "Plastik"] },
      { name: "Cechy", tags: ["Składane", "Łatwe w czyszczeniu", "Z wyposażeniem"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Zabawki Małe Zwierzęta",
    displayName: "Zabawki",
    groups: [
      { name: "Typ zabawki", tags: ["Gryzak", "Tunel", "Piłka", "Interaktywna"] },
      { name: "Materiał", tags: ["Drewno", "Sizal", "Plusz"] },
      { name: "Przeznaczenie", tags: ["Aktywność", "Ścieranie zębów", "Inteligencja"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Ściółka",
    groups: [
      { name: "Typ", tags: ["Drewniana", "Papierowa", "Pellet"] },
      { name: "Właściwości", tags: ["Ekologiczna", "Niskopyląca", "Bezzapachowe"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Miski i poidła Małe Zwierzęta",
    displayName: "Miski i poidła",
    groups: [
      { name: "Typ", tags: ["Miska", "Poidło", "Automatyczne poidło"] },
      { name: "Materiał", tags: ["Plastikowe", "Ceramiczne", "Metalowe"] },
      { name: "Cechy", tags: ["Antypoślizgowe", "Zawieszane", "Automatyczne"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Transportery Małe Zwierzęta",
    displayName: "Transportery",
    groups: [
      { name: "Typ", tags: ["Plastikowy transporter", "Torba", "Składany"] },
      { name: "Rozmiar", tags: ["S", "M", "L"] },
      { name: "Cechy", tags: ["Wentylowany", "Lekki", "Wodoodporny"] }
    ]
  },
  {
    mainCategory: "Małe zwierzęta",
    subCategory: "Higiena i pielęgnacja Małe Zwierzęta",
    displayName: "Higiena i pielęgnacja",
    groups: [
      { name: "Typ produktu", tags: ["Szczotka", "Szampon", "Obcinacz do pazurów"] },
      { name: "Cechy", tags: ["Naturalne", "Hipoalergiczne", "Bezzapachowe"] }
    ]
  }
];

const generateSlug = (text: string) => {
  return text.toLowerCase().trim().replace(/[ąáàâãäå]/g, "a").replace(/[ęéèêë]/g, "e").replace(/[íìîï]/g, "i").replace(/[óòôõöø]/g, "o").replace(/[úùûü]/g, "u").replace(/[ć]/g, "c").replace(/[ł]/g, "l").replace(/[ń]/g, "n").replace(/[ś]/g, "s").replace(/[źż]/g, "z").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
};

const CategorySchema = new mongoose.Schema({ name: String, slug: String, parent: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const TagGroupSchema = new mongoose.Schema({ name: String, category: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const TagSchema = new mongoose.Schema({ name: String, group: mongoose.Schema.Types.ObjectId }, { timestamps: true });

export async function GET() {
  try {
    const baseUri = process.env.MONGODB_URI;
    if (!baseUri) return NextResponse.json({ success: false, error: "Brak MONGODB_URI!" }, { status: 500 });
    const cleanUri = baseUri.endsWith("/") ? baseUri.slice(0, -1) : baseUri;

    const connCategories = await mongoose.createConnection(`${cleanUri}/CategoriesDB`).asPromise();
    const connTagGroups = await mongoose.createConnection(`${cleanUri}/TagGroupsDB`).asPromise();
    const connTags = await mongoose.createConnection(`${cleanUri}/TagsDB`).asPromise();

    const Category1 = connCategories.models.Category1 || connCategories.model("Category1", CategorySchema, "category1s");
    const TagGroup1 = connTagGroups.models.TagGroup1 || connTagGroups.model("TagGroup1", TagGroupSchema, "taggroup1s");
    const Tag1 = connTags.models.Tag1 || connTags.model("Tag1", TagSchema, "tag1s");

    // PRZED URUCHOMIENIEM: Czyścimy kolekcje testowe, aby zapisać wszystko od zera bez duplikatów i przerw
    await Category1.deleteMany({});
    await TagGroup1.deleteMany({});
    await Tag1.deleteMany({});

    console.log("🧹 Wyczyszczono stare kolekcje testowe. Budowanie struktur w pamięci...");

    // Słowniki pomocnicze mapujące unikalne nazwy na wygenerowane ID
    const mainCategoryIds: Record<string, mongoose.Types.ObjectId> = {};
    const subCategoryIds: Record<string, mongoose.Types.ObjectId> = {};

    const categoriesToInsert: any[] = [];
    const tagGroupsToInsert: any[] = [];
    const tagsToInsert: any[] = [];

    // KROK 1: Wygeneruj ID i przygotuj dokumenty dla głównych kategorii (Pies, Kot, Małe zwierzęta)
    const mainNames = ["Pies", "Kot", "Małe zwierzęta"];
    for (const name of mainNames) {
      const id = new mongoose.Types.ObjectId();
      mainCategoryIds[name] = id;
      categoriesToInsert.push({ _id: id, name, slug: generateSlug(name), parent: null });
    }

    // KROK 2: Przygotuj podkategorie oraz grupy tagów
    for (const item of fullShopStructure) {
      const parentId = mainCategoryIds[item.mainCategory];
      const subId = new mongoose.Types.ObjectId();
      subCategoryIds[item.subCategory] = subId;

      categoriesToInsert.push({
        _id: subId,
        name: item.displayName || item.subCategory,
        slug: generateSlug(item.subCategory),
        parent: parentId
      });

      for (const groupData of item.groups) {
        const groupId = new mongoose.Types.ObjectId();
        
        tagGroupsToInsert.push({
          _id: groupId,
          name: groupData.name,
          category: subId
        });

        for (const tagName of groupData.tags) {
          tagsToInsert.push({
            name: tagName,
            group: groupId
          });
        }
      }
    }

    console.log(`📦 Przygotowano do wysyłki: ${categoriesToInsert.length} kategorii, ${tagGroupsToInsert.length} grup, ${tagsToInsert.length} tagów.`);

    // KROK 3: Masowy ultra-szybki zapis w paczkach (Jedno zapytanie na kolekcję)
    await Category1.insertMany(categoriesToInsert);
    await TagGroup1.insertMany(tagGroupsToInsert);
    await Tag1.insertMany(tagsToInsert);

    await connCategories.close();
    await connTagGroups.close();
    await connTags.close();

    return NextResponse.json({ 
      success: true, 
      message: `Baza zasilona błyskawicznie! Zapisano: ${categoriesToInsert.length} kategorii, ${tagGroupsToInsert.length} grup filtrów oraz ${tagsToInsert.length} tagów w kolekcjach z końcówką 1.` 
    });

  } catch (error: any) {
    console.error("❌ Błąd masowego zapisu:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}