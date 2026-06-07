// app/admin/page.tsx
import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import AdminClient from "./adminClient";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic"; 

let cachedDb: any = null;
async function getDatabaseConnection() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI!");
  
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  cachedDb = await mongoose.connect(baseUri, { dbName: "mydb" });
  return cachedDb;
}

// Współdzielony cache dla struktur sklepu
const getCachedStructures = unstable_cache(
  async () => {
    await getDatabaseConnection();

    const [categories, tagGroups, tags] = await Promise.all([
      CategoryModel.find({}).lean(),
      TagGroupModel.find({}).lean(),
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
  ["admin-structures-cache"],
  { revalidate: 600, tags: ["structures"] }
);

export default async function AdminPage() {
  // Pobieramy drzewo kategorii i tagów
  const { serializedCategories, serializedTagGroups, serializedTags } = await getCachedStructures();

  await getDatabaseConnection();

  // Admin musi widzieć WSZYSTKIE produkty
  const rawProducts = await ProductModel.find({})
    .populate("company")
    .sort({ updatedAt: -1 })
    .lean();

  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

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
      image: extractImage(product.images), 
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      tags: product.tags || [],
      description: product.description || "",
      ingredients: product.ingredients || "",
      additionalInfo: product.additionalInfo || ""
    };
  });

  return (
    <AdminClient
      productsData={initialProducts}
      categoriesData={serializedCategories}
      tagGroupsData={serializedTagGroups}
      tagsData={serializedTags}
      ordersData={[]} // Jeśli masz pobieranie zamówień na serwerze, wklej je tutaj
      usersData={[]}  // Jeśli masz pobieranie użytkowników na serwerze, wklej je tutaj
    />
  );
}