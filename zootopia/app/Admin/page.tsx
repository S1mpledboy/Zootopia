import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Category from "@/models/Category";   // NOWOŚĆ
import TagGroup from "@/models/TagGroup"; // NOWOŚĆ
import Tag from "@/models/Tag";           // NOWOŚĆ
import AdminClient from "./adminClient";

// Wymuszenie pobierania świeżych danych z bazy przy każdym wejściu na stronę panelu
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1. Połączenie z bazą danych
  await connectToDatabase();

  // 2. Pobranie wszystkich danych RÓWNOLEGLE (optymalizacja wydajności)
  const [
    rawOrders, 
    users, 
    rawProducts, 
    categories, 
    tagGroups, 
    tags
  ] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).lean(),
    User.find({}).lean(),
    Product.find({ isActive: true }).populate("company").sort({ updatedAt: -1 }).lean(),
    Category.find({}).lean(),
    TagGroup.find({}).lean(),
    Tag.find({}).sort({ name: 1 }).lean()
  ]);

  // Funkcja pomocnicza mapująca statusy z bazy (enum) na stringi w UI
  const mapStatusToUI = (status: string): string => {
    switch (status) {
      case "IN_PROGRESS": return "w trakcie";
      case "SHIPPED": return "wysłane";
      case "CANCELLED": return "anulowane";
      case "COMPLETED": return "ukończone";
      default: return "w trakcie";
    }
  };

  // 3. SERIALIZACJA DANYCH

  // Zamówienia
  const serializedOrders = rawOrders.map((order: any) => ({
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: mapStatusToUI(order.status),
    totalAmount: order.totalAmount,
    deliveryAddress: order.deliveryAddress,
    shippingMethod: order.shippingMethod,
    paymentMethod: order.paymentMethod,
    invoiceData: order.invoiceData,
    createdAt: order.createdAt ? new Date(order.createdAt).toLocaleDateString("pl-PL") : "",
    updatedAt: order.updatedAt ? new Date(order.updatedAt).toLocaleDateString("pl-PL") : "",
    items: (order.items || []).map((item: any) => ({
      productId: item.productId?.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  }));

  // Użytkownicy
  const serializedUsers = users.map(user => ({
    _id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '—'
  }));

  // Produkty
  const serializedProducts = rawProducts.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    promoPrice: p.promoPrice ?? null,
    companyName: p.company?.name || "Zootopia"
  }));

  // Kategorie (Główne oraz podkategorie poziomu 1)
  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug || "",
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // Grupy tagów (Podkategorie poziomu 2)
  const serializedTagGroups = tagGroups.map((group: any) => ({
    _id: group._id.toString(),
    name: group.name,
    category: group.category ? group.category.toString() : null
  }));

  // Pojedyncze Tagi
  const serializedTags = tags.map((tag: any) => ({
    _id: tag._id.toString(),
    name: tag.name,
    group: tag.group ? tag.group.toString() : null
  }));

  // 4. Przekazanie kompletnych danych do AdminClient
  return (
    <AdminClient 
      ordersData={serializedOrders} 
      productsData={serializedProducts}
      usersData={serializedUsers}
      categoriesData={serializedCategories} // Przekazujemy do klienta
      tagGroupsData={serializedTagGroups}   // Przekazujemy do klienta
      tagsData={serializedTags}             // Przekazujemy do klienta
    />
  );
}