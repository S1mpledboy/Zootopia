import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart"; 
import { getAuthUser } from "@/middleware/auth";
import mongoose from "mongoose";

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
      discountCode,
      discountValue
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Koszyk jest pusty." }, { status: 400 });
    }

    if (!deliveryAddress || !deliveryAddress.firstName || !deliveryAddress.street || !deliveryAddress.city) {
      return NextResponse.json({ message: "Brakujące podstawowe dane adresowe." }, { status: 400 });
    }

    const orderNumber = `ZOOTOPIA-${Date.now().toString().slice(-6)}`;

    // Mapowanie elementów na strukturę ObjectId akceptowaną przez model Order
    const mappedItems = cartItems.map((item) => {
      const prodInfo = item.product ? item.product : item;
      return {
        productId: new mongoose.Types.ObjectId(prodInfo._id.toString()),
        name: prodInfo.name,
        price: prodInfo.promoPrice !== undefined && prodInfo.promoPrice !== null ? prodInfo.promoPrice : prodInfo.price,
        quantity: item.quantity
      };
    });

    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(user._id.toString()),
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
      discountCode: discountCode || null,
      discountValue: discountValue || 0
    });

    await newOrder.save();

    // ==========================================================================
    // 🔥 CZYSZCZENIE BAZY DANYCH (Model koszyka używa klucza "user")
    // ==========================================================================
    try {
      const result = await Cart.deleteMany({ user: user._id });
      console.log(`[MongoDB] Wyczyszczono koszyk dla ${user._id}. Skasowano dokumentów: ${result.deletedCount}`);
    } catch (cartError) {
      console.error("[MongoDB Error] Nie udało się wyczyścić koszyka z bazy:", cartError);
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