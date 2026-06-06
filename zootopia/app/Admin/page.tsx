import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import AdminClient from "./adminClient";

// Wymuszenie pobierania świeżych danych z bazy przy każdym wejściu na stronę panelu
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1. Połączenie z bazą danych
  await connectToDatabase();

  // 2. Pobranie zamówień z bazy (sortowanie od najnowszych)
  const rawOrders = await Order.find({}).sort({ createdAt: -1 }).lean();

  // Funkcja pomocnicza mapująca statusy z bazy (enum) na stringi w Twoim UI
  const mapStatusToUI = (status: string): string => {
    switch (status) {
      case "IN_PROGRESS": return "w trakcie";
      case "SHIPPED": return "wysłane";
      case "CANCELLED": return "anulowane";
      case "COMPLETED": return "ukończone";
      default: return "w trakcie";
    }
  };

  // 3. Serializacja danych (konwersja obiektów bazy ObjectId/Date na zwykłe stringi JSON)
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

  // (Opcjonalnie) Pobranie produktów dla drugiej zakładki
  const rawProducts = await Product.find({ isActive: true }).populate("company").sort({ updatedAt: -1 }).lean();
  const serializedProducts = rawProducts.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    promoPrice: p.promoPrice ?? null,
    companyName: p.company?.name || "Zootopia"
  }));

  // Przekazanie bezpiecznych danych serwerowych do głównego layoutu klienta
  return (
    <AdminClient 
      ordersData={serializedOrders} 
      productsData={serializedProducts}
    />
  );
}