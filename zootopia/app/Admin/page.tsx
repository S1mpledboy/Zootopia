// app/admin/page.tsx
import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import OrderModel from "@/models/Order"; 
import UserModel from "@/models/User";   
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
      serializedCategories: categories,
      serializedTagGroups: tagGroups,
      serializedTags: tags
    };
  },
  ["admin-structures-cache"],
  { revalidate: 600, tags: ["structures"] }
);

export default async function AdminPage() {
  // 1. Pobieramy drzewo kategorii i tagów z cache
  const { serializedCategories, serializedTagGroups, serializedTags } = await getCachedStructures();

  await getDatabaseConnection();

  // 2. Pobieramy równolegle dane z bazy
  const [rawProducts, rawOrders, rawUsers] = await Promise.all([
    ProductModel.find({}).populate("company").sort({ updatedAt: -1 }).lean(),
    OrderModel.find({}).sort({ createdAt: -1 }).lean(),
    UserModel.find({}).sort({ createdAt: -1 }).lean()
  ]);

  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // 3. Mapujemy produkty zachowując absolutnie wszystkie oryginalne właściwości bazy (...product)
  const mappedProducts = rawProducts.map((product: any) => {
    let catId = null;
    if (product.category) {
      catId = product.category._id ? product.category._id.toString() : product.category.toString();
    }
    return {
      ...product, 
      _id: product._id.toString(),
      image: extractImage(product.images), 
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      description: product.description || "",
      ingredients: product.ingredients || "",
      additionalInfo: product.additionalInfo || ""
    };
  });

  // 4. Bezpieczna konwersja obiektów na stringi (w tym obiektów Date)
  // Przejście przez JSON.stringify automatycznie zamienia obiekty typu Date na stringi ISO, 
  // eliminując błąd "Objects are not valid as a React child" na froncie, bez uszkadzania statusów i struktur.
  const sanitizedProducts = JSON.parse(JSON.stringify(mappedProducts));
  const sanitizedOrders = JSON.parse(JSON.stringify(rawOrders));
  const sanitizedUsers = JSON.parse(JSON.stringify(rawUsers));

  const finalCategories = JSON.parse(JSON.stringify(
    serializedCategories.map((cat: any) => ({
      ...cat,
      _id: cat._id.toString(),
      parent: cat.parent ? cat.parent.toString() : null
    }))
  ));

  const finalTagGroups = JSON.parse(JSON.stringify(
    serializedTagGroups.map((g: any) => ({
      ...g,
      _id: g._id.toString(),
      category: g.category ? g.category.toString() : null
    }))
  ));

  const finalTags = JSON.parse(JSON.stringify(
    serializedTags.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      group: t.group ? t.group.toString() : null
    }))
  ));

  return (
    <AdminClient
      productsData={sanitizedProducts}
      categoriesData={finalCategories}
      tagGroupsData={finalTagGroups}
      tagsData={finalTags}
      ordersData={sanitizedOrders} 
      usersData={sanitizedUsers}   
    />
  );
}