import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import CompanyModel from "@/models/Company";
import KategorieClient from "./pageClient";
import { unstable_cache } from "next/cache";

// Wywalamy revalidate = 0. Dynamiczne będą tylko produkty, struktury zostaną w cache.
export const dynamic = "force-dynamic"; 

// 1. POPRAWNE, REUŻYWALNE POŁĄCZENIE (Connection Pooling)
let cachedDb: any = null;
async function getDatabaseConnection() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI!");
  
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  // Tworzymy stałe połączenie, nie zamykamy go po każdym rysowaniu strony!
  cachedDb = await mongoose.connect(baseUri, { dbName: "mydb" });
  return cachedDb;
}

// 2. CACHE DLA STRUKTUR (Kategorie i Tagi pobierają się z bazy RAZ, a potem z pamięci)
// Rewalidacja co 10 minut (600 sekund) - zmieni się coś w panelu, odświeży się po max 10 min.
const getCachedStructures = unstable_cache(
  async () => {
    await getDatabaseConnection();
    
    // Pobieramy dane równolegle (Promise.all jest o wiele szybszy niż 3x await)
    const [categories, tagGroups, tags] = await Promise.all([
      CategoryModel.find({}).lean(),
      TagGroupModel.find({}).lean(),
      // Sortowanie przeniesione bezpośrednio do MongoDB (wykorzystuje indeksy!)
      TagModel.find({}).sort({ name: 1 }).lean()
    ]);

    return {
      serializedCategories: categories.map((cat: any) => ({
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        parent: cat.parent ? cat.parent.toString() : null
      })),
      serializedTagGroups: tagGroups.map((group: any) => ({
        _id: group._id.toString(),
        name: group.name,
        category: group.category.toString()
      })),
      serializedTags: tags.map((tag: any) => ({
        _id: tag._id.toString(),
        name: tag.name,
        group: tag.group.toString()
      }))
    };
  },
  ["shop-structures-cache"],
  { revalidate: 600, tags: ["structures"] }
);

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  // Pobieramy (lub wyciągamy z pamięci podręcznej) struktury menu i tagów
  const { serializedCategories, serializedTagGroups, serializedTags } = await getCachedStructures();

  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';

  // Namierzanie głównego działu zwierzaka
  const currentAnimalCategory = serializedCategories.find(
    cat => cat.slug === urlType && cat.parent === null
  );

  let targetCategoryIds: string[] = [];
  if (currentAnimalCategory) {
    const childCategories = serializedCategories.filter(
      cat => cat.parent === currentAnimalCategory._id
    );
    targetCategoryIds = childCategories.map(cat => cat._id);
  }

  // Kryteria zapytania o produkty
  let productQuery: any = { isActive: true };
  if (urlType === 'promocje') {
    productQuery.promoPrice = { $ne: null, $exists: true, $gt: 0 };
  } else {
    productQuery.category = { $in: targetCategoryIds };
  }

  // Połączenie przed zapytaniem o produkty
  await getDatabaseConnection();

  // Pobieramy TYLKO produkty potrzebne dla danej kategorii
  const rawProducts = await ProductModel.find(productQuery)
    .populate("company")
    .sort({ updatedAt: -1 })
    // Limituj produkty! Jeśli masz ich 500, nie pchaj wszystkich na raz na front. 
    // .limit(40) // <-- Odkomentuj to, jeśli produktów jest za dużo i zrób pagynację!
    .lean();

  // Helper do wyciągania zdjęcia
  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // Mapowanie produktów
  const initialProducts = rawProducts.map((product: any) => {
    let catId = null;
    if (product.category) {
      catId = product.category._id ? product.category._id.toString() : product.category.toString();
    }
    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.promoPrice ?? null,
      image: extractImage(product.images), // <--- TUTAJ upewnij się, że w komponencie KategorieClient używasz next/image!
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      tags: product.tags || []
    };
  });

  return (
    <KategorieClient
      initialProducts={initialProducts}
      allCategories={serializedCategories}
      allTagGroups={serializedTagGroups}
      allTags={serializedTags}
    />
  );
}