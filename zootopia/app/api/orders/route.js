import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getAuthUser } from "@/middleware/auth";
import mongoose from "mongoose";

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

    const mappedItems = cartItems.map((item) => {
      const prodId = item.product?._id || item._id || item.productId;

      if (!prodId) {
        throw new Error("Błąd struktury: Brak poprawnego identyfikatora ID dla przedmiotu.");
      }

      const name = item.product?.name || item.name || "Produkt bez nazwy";
      const price = item.product?.promoPrice !== undefined && item.product?.promoPrice !== null
        ? item.product.promoPrice
        : (item.product?.price || item.price || 0);

      return {
        productId: new mongoose.Types.ObjectId(prodId.toString()),
        name: name,
        price: price,
        quantity: item.quantity || 1
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

    try {
      const stockUpdates = mappedItems.map((item) =>
        Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      );
      await Promise.all(stockUpdates);
      console.log(`[MongoDB] Pomyślnie zaktualizowano stock dla ${mappedItems.length} produktów.`);
    } catch (stockError) {
      console.error("[MongoDB Error] Błąd podczas aktualizacji stocku:", stockError);
    }

    try {
      const userId = new mongoose.Types.ObjectId(user._id.toString());
      const result = await Cart.deleteMany({ user: userId });
      console.log(`[MongoDB] Pomyślnie wyczyszczono koszyk dla ${userId}. Skasowano: ${result.deletedCount}`);
    } catch (cartError) {
      console.error("[MongoDB Error] Błąd podczas kasowania koszyka:", cartError);
    }

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