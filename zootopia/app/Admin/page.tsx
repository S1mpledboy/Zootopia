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
  const { serializedCategories, serializedTagGroups, serializedTags } = await getCachedStructures();

  await getDatabaseConnection();

  const [rawProducts, rawOrders, rawUsers] = await Promise.all([
    ProductModel.find({}).populate("company").sort({ updatedAt: -1 }).lean(),
    OrderModel.find({}).sort({ createdAt: -1 }).lean(),
    UserModel.find({}).sort({ createdAt: -1 }).lean()
  ]);

  // 1. Mapowanie zamówień (Status -> string, Data -> RRRR-MM-DD)
  const sanitizedOrders = rawOrders.map((order: any) => {
    let orderStatus = "w trakcie";
    if (order.status) {
      orderStatus = typeof order.status === "object" ? order.status.name || "w trakcie" : order.status;
    }

    let formattedDate = "";
    if (order.createdAt) {
      const dateObj = new Date(order.createdAt);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
      }
    }

    return {
      ...order,
      id: order._id.toString(), 
      _id: order._id.toString(), 
      status: orderStatus.toLowerCase(), 
      createdAt: formattedDate
    };
  });

  // 2. Mapowanie użytkowników (Data -> RRRR-MM-DD)
  const sanitizedUsers = rawUsers.map((user: any) => {
    let formattedDate = "";
    if (user.createdAt) {
      const dateObj = new Date(user.createdAt);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
      }
    }
    return {
      ...user,
      id: user._id.toString(),
      _id: user._id.toString(),
      createdAt: formattedDate
    };
  });

  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // 3. Mapowanie produktów
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

  const sanitizedProducts = JSON.parse(JSON.stringify(mappedProducts));

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