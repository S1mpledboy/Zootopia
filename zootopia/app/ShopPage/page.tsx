import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import "@/models/Company";
import KategorieClient from "./pageClient";

export const revalidate = 0;

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI w zmiennych środowiskowych!");

  // 🔥 KLUCZOWE: Łączymy się i wymuszamy bazę mydb, dokładnie tak samo jak w skryptach seedujących
  const conn = await mongoose.createConnection(baseUri, { dbName: "mydb" }).asPromise();

  // Wiążemy Twoje oficjalne modele z połączeniem do mydb
  const Category = conn.models.Category || conn.model("Category", CategoryModel.schema, "categories");
  const TagGroup = conn.models.TagGroup || conn.model("TagGroup", TagGroupModel.schema, "taggroups");
  const Tag = conn.models.Tag || conn.model("Tag", TagModel.schema, "tags");
  const Product = conn.models.Product || conn.model("Product", ProductModel.schema, "products");

  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';

  // 🔥 NOWOŚĆ: Pobieramy KOMPLET danych strukturalnych z bazy mydb
  const allCategoriesRaw = await Category.find({}).lean();
  const allTagGroupsRaw = await TagGroup.find({}).lean();
  const allTagsRaw = await Tag.find({}).lean();

  // Serializacja kategorii
  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // 🔥 NOWOŚĆ: Serializacja grup filtrów pod komponent kliencki
  const serializedTagGroups = allTagGroupsRaw.map((group: any) => ({
    _id: group._id.toString(),
    name: group.name,
    category: group.category.toString()
  }));

  // 🔥 NOWOŚĆ: Serializacja tagów pod komponent kliencki
  const serializedTags = allTagsRaw.map((tag: any) => ({
    _id: tag._id.toString(),
    name: tag.name,
    group: tag.group.toString()
  }));

  // HELPER: rozpakowywanie obrazka (tablicа w tablicy)
  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // HELPER: serializacja produktu
  const serializeProduct = (product: any) => {
    let catId = null;
    if (product.category) {
      catId = product.category._id
        ? product.category._id.toString()
        : product.category.toString();
    }

    // Zamieniamy tablicę atrybutów (ObjectId) na tablicę czystych stringów tekstowych dla frontu
    const serializedAttributes = product.attributes
      ? product.attributes.map((attr: any) => attr.toString())
      : [];

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.promoPrice ?? null,
      image: extractImage(product.images),
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      attributes: serializedAttributes // 🔥 Poprawione przekazywanie atrybutów
    };
  };

  // ============================================================
  // WYBÓR KATEGORII DOCELOWYCH
  // ============================================================
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

  // Budujemy zapytanie do bazy produktów
  let productQuery: any = { isActive: true };
  if (urlType === 'promocje') {
    productQuery.promoPrice = { $ne: null, $exists: true, $gt: 0 };
  } else {
    productQuery.category = { $in: targetCategoryIds };
  }

  // Pobieramy produkty
  const rawProducts = await Product.find(productQuery)
    .populate("company")
    .sort({ updatedAt: -1 })
    .lean();

  // 🔥 Zamykamy aktywne połączenie po ściągnięciu kompletu danych
  await conn.close();

  // Zwracamy komponent kliencki i przekazujemy mu WSZYSTKIE 4 tablice z bazy mydb
  return (
    <KategorieClient
      initialProducts={rawProducts.map(serializeProduct)}
      allCategories={serializedCategories}
      allTagGroups={serializedTagGroups}
      allTags={serializedTags}
    />
  );
}