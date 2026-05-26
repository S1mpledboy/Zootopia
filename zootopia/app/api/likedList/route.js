// app/api/likedList/route.js

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User"; // Upewnij się, że masz model User
import Product from "@/models/Product";
import "@/models/Company"; // Rejestracja modelu firmy dla .populate()
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectToDatabase();

    // 1. Pobranie tokenu z nagłówka Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    // 2. Weryfikacja tokenu JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TWÓJ_SEKRETNY_KLUCZ');
    const userId = decoded.userId; // Upewnij się czy w tokenie zapisujesz userId czy id

    // 3. Pobranie użytkownika wraz z jego polubionymi produktami
    const user = await User.findById(userId)
      .populate({
        path: "likedProducts", // nazwa pola w schemacie User przechowująca ulubione produkty
        populate: { path: "company" } // Głębokie populate dla pobrania marki/firmy
      })
      .lean();

    if (!user) {
      console.warn(`⚠️ Nie znaleziono użytkownika o ID: ${userId}`);
      return Response.json({ error: "Użytkownik nie istnieje" }, { status: 404 });
    }

    const products = user.likedProducts || [];

    // 4. TRANSFORMACJA: Formatowanie danych z MongoDB do struktury frontendowej
    const transformedProducts = products.map((product) => {
      // Bezpieczne czyszczenie struktury zdjęć, podobnie jak w Twojej liście kategorii
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
        productName: product.name, // ✅ name → productName
        brandName: product.company?.name || "ZOOTOPIA", // ✅ company.name → brandName
        price: product.price,
        image: productImage, // ✅ Wyczyszczony URL zdjęcia
      };
    });

    console.log(`✅ Pobrano ${transformedProducts.length} polubionych produktów dla użytkownika ${userId}`);

    // Zwracamy czystą tablicę obiektów bezpośrednio
    return Response.json(transformedProducts);

  } catch (error) {
    console.error("❌ Błąd GET /api/likedList:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}