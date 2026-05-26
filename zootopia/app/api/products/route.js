// app/api/products/route.ts

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Pobierz produkty z bazy
    const products = await Product.find({ isActive: true })
      .populate("category")
      .populate("company") // ✅ Dodaj company populate dla brandName
      .sort({ stock: 1 }); // ✅ Sortuj po stock (najniższa ilość pierwsza)

    // Sprawdzenie czy są produkty
    if (!products || products.length === 0) {
      console.warn("⚠️ Brak produktów w bazie");
      return Response.json([]);
    }

    // ✅ TRANSFORMACJA: Konwertuj format z MongoDB na format Frontend-u
    const transformedProducts = products.map((product) => ({
      id: product._id.toString(), // Konwertuj ObjectId na string
      productName: product.name, // ✅ name → productName
      brandName: product.company?.name || "Unknown Brand", // ✅ company.name → brandName
      price: product.price,
      quantity: product.stock, // ✅ stock → quantity
      image: product.images?.[0] || "/placeholder.png", // ✅ Pierwsza grafika
      description: product.description,
    }));

    console.log(`✅ Pobrano i transformowano ${transformedProducts.length} produktów`);

    // ✅ Zwróć tablicę BEZPOŚREDNIO, a nie { ok: true, data: [...] }
    return Response.json(transformedProducts);
  } catch (error) {
    console.error("❌ Błąd GET /api/products:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      price: body.price,
      stock: body.stock ?? 0,
      category: body.category,
      company: body.company, // ✅ Dodaj company przy tworzeniu
      isActive: body.isActive ?? true,
      images: body.images ?? [],
    });

    return Response.json(
      {
        ok: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Błąd POST /api/products:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}