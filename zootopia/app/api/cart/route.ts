import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getAuthUser } from "@/middleware/auth";

// 1. POBIERANIE ZAWARTOŚCI KOSZYKA
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Pobieramy wpisy z koszyka, automatycznie wyciągając dane produktu 
    // oraz nazwę firmy (company), czyli dokładnie to, czego wymaga nasz komponent!
    const cartItems = await Cart.find({ user: user._id })
      .populate({
        path: "product",
        populate: {
          path: "company",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(cartItems);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. DODAWANIE PRODUKTU DO KOSZYKA (np. z poziomu karty produktu)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Missing productId" }, { status: 400 });
    }

    // Sprawdzamy czy produkt w ogóle istnieje
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Jeśli produkt już jest w koszyku, po prostu zwiększamy jego ilość
    const existingItem = await Cart.findOne({ user: user._id, product: productId });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return NextResponse.json(existingItem);
    }

    // Jeśli go nie ma, tworzymy nowy wpis
    const newItem = await Cart.create({
      user: user._id,
      product: productId,
      quantity,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 3. AKTUALIZACJA ILOŚCI (Uruchamiane przy kliknięciu + / - w koszyku)
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, action } = await req.json(); // action może być 'increase' lub 'decrease'

    if (!productId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const cartItem = await Cart.findOne({ user: user._id, product: productId });

    if (!cartItem) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }

    if (action === "increase") {
      cartItem.quantity += 1;
    } else if (action === "decrease") {
      // Jeśli użytkownik odejmuje, a ma już tylko 1 sztukę – nie pozwalamy zejść poniżej 1 
      // (do usuwania służy metoda DELETE)
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      }
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await cartItem.save();
    return NextResponse.json(cartItem);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 4. USUNIĘCIE PRODUKTU Z KOSZYKA (Kliknięcie ikony kosza)
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "Missing productId" }, { status: 400 });
    }

    const deletedItem = await Cart.findOneAndDelete({ user: user._id, product: productId });

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}