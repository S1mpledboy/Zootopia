import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import "@/models/Company"; // Rejestracja modelu firmy dla .populate()
import jwt from "jsonwebtoken";

// 📥 GET: Pobieranie listy polubionych produktów użytkownika
export async function GET(req) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TWÓJ_SEKRETNY_KLUCZ');
    const userId = decoded.userId;

    const user = await User.findById(userId)
      .populate({
        path: "likedProducts",
        populate: { path: "company" }
      })
      .lean();

    if (!user) {
      return Response.json({ error: "Użytkownik nie istnieje" }, { status: 404 });
    }

    const products = user.likedProducts || [];

    // Transformacja danych na czysty format frontendowy
    const transformedProducts = products.map((product) => {
      let productImage = "/placeholder.png";
      if (product.images && product.images.length > 0) {
        const innerImages = product.images[0];
        if (Array.isArray(innerImages) && innerImages.length > 0) {
          productImage = innerImages[0];
        } else if (typeof innerImages === "string") {
          productImage = innerImages;
        }
      }

      return {
        id: product._id.toString(),
        productName: product.name,
        brandName: product.company?.name || "ZOOTOPIA",
        price: product.price,
        image: productImage,
      };
    });

    return Response.json(transformedProducts);
  } catch (error) {
    console.error("❌ Błąd GET /api/likedList:", error);
    return Response.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}

// 📤 POST: Dodawanie produktu do listy ulubionych
export async function POST(req) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TWÓJ_SEKRETNY_KLUCZ');
    const userId = decoded.userId;

    const { productId } = await req.json();
    if (!productId) {
      return Response.json({ error: "Brak ID produktu" }, { status: 400 });
    }

    // $addToSet zapewnia, że ID produktu doda się do tablicy tylko raz (unikamy duplikatów)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likedProducts: productId } },
      { new: true }
    );

    if (!user) {
      return Response.json({ error: "Użytkownik nie istnieje" }, { status: 404 });
    }

    return Response.json({ ok: true, message: "Dodano do ulubionych" });
  } catch (error) {
    console.error("❌ Błąd POST /api/likedList:", error);
    return Response.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}