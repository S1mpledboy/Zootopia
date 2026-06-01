import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// 🔥 Wymuszamy rejestrację wszystkich powiązanych modeli, aby Mongoose widział ich relacje na Vercelu
import "@/models/Company";
import "@/models/Category";
import ProductModel from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();

    // 1. Połączenie z bazą danych
    await connectToDatabase();

    // 2. Bezpieczne pobranie modelu (zapobiega konfliktom i pustym kolekcjom na Vercelu)
    const Product = mongoose.models.Product || ProductModel;

    // 3. Wyszukiwanie uproszczone za pomocą samego $regex (niezależne od indeksów tekstowych MongoDB)
    const products = await Product.find({
      name: { $regex: cleanQuery, $options: "i" },
      isActive: true
    })
      .select("name price images")
      .limit(6)
      .lean();

    // 4. Mapowanie _id na ciąg tekstowy dla frontendu
    const serializedProducts = products.map((prod: any) => ({
      ...prod,
      _id: prod._id.toString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("[API SEARCH ERROR]:", error);
    return NextResponse.json(
      { message: "Błąd wyszukiwania", error: error.message },
      { status: 500 }
    );
  }
}