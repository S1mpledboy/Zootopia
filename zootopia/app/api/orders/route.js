import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart"; // 🔥 DODANY IMPORT: Zaimportuj swój model koszyka
import { getAuthUser } from "@/middleware/auth";

// ==========================================================================
// 1. POBIERANIE HISTORII ZAMÓWIEŃ (Metoda GET)
// ==========================================================================
export async function GET(req) {
  try {
    await connectToDatabase();

    const user = await getAuthUser(req);
    if (!user || !user._id) {
      return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }

    // Pobieramy zamówienia danego użytkownika, od najnowszego
    const userOrders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    return NextResponse.json({ message: error.message || "Błąd serwera" }, { status: 500 });
  }
}

// ==========================================================================
// 2. TWORZENIE NOWEGO ZAMÓWIENIA (Metoda POST)
// ==========================================================================
export async function POST(req) {
  try {
    await connectToDatabase();

    const user = await getAuthUser(req);
    if (!user || !user._id) {
      return NextResponse.json({ message: "Musisz być zalogowany, aby złożyć zamówienie." }, { status: 401 });
    }

    const body = await req.json();
    const { 
      cartItems, 
      deliveryAddress, 
      shippingMethod, 
      paymentMethod, 
      invoiceData, 
      alternativeShippingAddress, 
      notes, 
      totalAmount,
      discountCode, // 🔥 NOWE: Odebranie kodu z frontendu
      discountValue // 🔥 NOWE: Odebranie kwoty zniżki
    } = body;

    // Walidacja koszyka
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Koszyk jest pusty." }, { status: 400 });
    }

    // Walidacja danych adresowych
    if (!deliveryAddress || !deliveryAddress.firstName || !deliveryAddress.street || !deliveryAddress.city) {
      return NextResponse.json({ message: "Brakujące podstawowe dane adresowe." }, { status: 400 });
    }

    // Generowanie unikalnego numeru zamówienia
    const orderNumber = `ZOOTOPIA-${Date.now().toString().slice(-6)}`;

    // Mapowanie produktów z koszyka, aby zamrozić ceny w momencie zakupu
    const mappedItems = cartItems.map((item) => {
      const prodInfo = item.product ? item.product : item;
      return {
        productId: prodInfo._id || item.productId,
        name: prodInfo.name,
        price: prodInfo.promoPrice !== undefined && prodInfo.promoPrice !== null ? prodInfo.promoPrice : prodInfo.price,
        quantity: item.quantity
      };
    });

    // Tworzenie zamówienia w bazie
    const newOrder = new Order({
      userId: user._id,
      orderNumber,
      items: mappedItems,
      totalAmount,
      status: "IN_PROGRESS",
      deliveryAddress: {
        firstName: deliveryAddress.firstName,
        lastName: deliveryAddress.lastName,
        country: deliveryAddress.country || "Polska",
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        postalCode: deliveryAddress.postalCode,
        phone: deliveryAddress.phone,
        email: deliveryAddress.email
      },
      shippingMethod,
      paymentMethod,
      invoiceData: invoiceData || { companyName: "", nip: "" },
      alternativeShippingAddress: alternativeShippingAddress || { country: "", street: "", city: "", postalCode: "" },
      notes: notes || "",
      discountCode: discountCode || null,   // 🔥 NOWE: Zapis do bazy (upewnij się, że Twój model Order ma te pola)
      discountValue: discountValue || 0     // 🔥 NOWE: Zapis do bazy
    });

    await newOrder.save();

    // ==========================================================================
    // 🔥 AUTOMATYCZNE CZYSZCZENIE KOSZYKA W BAZIE MONGODB PO ZAPISIE ZAMÓWIENIA
    // ==========================================================================
    try {
      // Usuwamy wszystkie pozycje z koszyka przypisane do ID tego zalogowanego użytkownika
      await Cart.deleteMany({ userId: user._id }); 
    } catch (cartError) {
      // Logujemy błąd, ale nie przerywamy procesu, bo zamówienie już pomyślnie się zapisało
      console.error("Zamówienie złożone, ale nie udało się wyczyścić koszyka w bazie:", cartError);
    }
    // ==========================================================================

    return NextResponse.json({ 
      success: true, 
      message: "Zamówienie zostało pomyślnie zapisane w bazie!", 
      orderNumber,
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Błąd podczas procesowania zamówienia:", error);
    return NextResponse.json({ message: error.message || "Błąd serwera" }, { status: 500 });
  }
}