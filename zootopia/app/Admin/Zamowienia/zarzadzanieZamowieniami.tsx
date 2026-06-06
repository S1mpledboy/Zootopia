import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import ZarzadzanieZamowieniamiClient from "./zarzadzanieClient";

// Wymuszenie pobierania świeżych danych przy każdym przeładowaniu
export const dynamic = "force-dynamic"; 

export default async function ZarzadzanieZamowieniamiPage() {
  // Połączenie z bazą danych
  await connectToDatabase();

  // Pobranie wszystkich zamówień posortowanych od najnowszych
  const rawOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  // Funkcja mapująca statusy z bazy (enum) na stringi w UI
  const mapStatusToUI = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "w trakcie";
      case "SHIPPED": return "wysłane";
      case "CANCELLED": return "anulowane";
      default: return "w trakcie";
    }
  };

  // Serializacja danych (konwersja ObjectId i Date na zwykłe stringi)
  const serializedOrders = rawOrders.map((order: any) => ({
    ...order,
    id: order._id.toString(),
    _id: order._id.toString(),
    userId: order.userId?.toString(),
    status: mapStatusToUI(order.status),
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
    items: order.items.map((item: any) => ({
      ...item,
      productId: item.productId?.toString(),
    })),
  }));

  // Przekazanie gotowych danych do komponentu klienckiego
  return <ZarzadzanieZamowieniamiClient initialOrders={serializedOrders} />;
}