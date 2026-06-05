import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import CompanyModel from "@/models/Company";

// Import komponentu klienckiego z tego samego folderu
import KategorieClient from "./pageClient"; 

export const revalidate = 0;

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI w zmiennych środowiskowych!");

  // Bezpieczne połączenie i wymuszenie bazy mydb
  const conn = await mongoose.createConnection(baseUri, { dbName: "mydb" }).asPromise();

  // Rejestracja modeli na aktywnym połączeniu
  const Company = conn.models.Company || conn.model("Company", CompanyModel.schema, "companies");
  const Category = conn.models.Category || conn.model("Category", CategoryModel.schema, "categories");
  const TagGroup = conn.models.TagGroup || conn.model("TagGroup", TagGroupModel.schema, "taggroups");
  const Tag = conn.models.Tag || conn.model("Tag", TagModel.schema, "tags");
  const Product = conn.models.Product || conn.model("Product", ProductModel.schema, "products");

  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';

  // Pobranie struktur danych z bazy mydb
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

  // Serializacja grup filtrów
  const serializedTagGroups = allTagGroupsRaw.map((group: any) => ({
    _id: group._id.toString(),
    name: group.name,
    category: group.category.toString()
  }));

  // 🔥 ZMIANA: Serializacja poszczególnych tagów połączona z sortowaniem alfabetycznym (uwzględnia polskie znaki)
  const serializedTags = allTagsRaw
    .map((tag: any) => ({
      _id: tag._id.toString(),
      name: tag.name,
      group: tag.group.toString()
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));

  // Helper do wyciągania pierwszego poprawnego zdjęcia z bazy danych
  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // Helper do mapowania produktu z bazy na czysty obiekt tekstowy (z tags dla Excela)
  const serializeProduct = (product: any) => {
    let catId = null;
    if (product.category) {
      catId = product.category._id ? product.category._id.toString() : product.category.toString();
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.promoPrice ?? null,
      image: extractImage(product.images),
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      tags: product.tags || []
    };
  };

  // Namierzanie głównego działu zwierzaka (Menu boczne)
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

  // Pobranie gotowych produktów i wyciągnięcie danych o marce przez .populate()
  const rawProducts = await Product.find(productQuery)
    .populate("company")
    .sort({ updatedAt: -1 })
    .lean();

  // Zamykamy sesję połączenia
  await conn.close();

  // Wysyłamy komplet w 100% zmapowanych danych na front-end
  return (
    <KategorieClient
      initialProducts={rawProducts.map(serializeProduct)}
      allCategories={serializedCategories}
      allTagGroups={serializedTagGroups}
      allTags={serializedTags}
    />
  );
}