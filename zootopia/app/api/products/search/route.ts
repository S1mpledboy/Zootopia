import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

// Wymuszenie rejestracji modeli powiązanych
import "@/models/Company";
import "@/models/Category";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();

    // 1. Łączenie z bazą danych
    await connectToDatabase();

    // 2. Bardziej elastyczne wyszukiwanie (szuka fragmentu słowa niezależnie od wielkości liter)
    const products = await Product.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { tags: { $regex: cleanQuery, $options: "i" } }
      ]
      // Usunęliśmy tymczasowo isActive: true, aby wykluczyć sytuację, 
      // w której testowy produkt jest domyślnie ustawiony jako nieaktywny
    })
      .select("name price images")
      .limit(6)
      .lean();

    // Debuggowanie w konsoli serwera (terminalu VS Code) - zobaczysz co dokładnie wypluwa baza
    console.log(`[API Serwer] Szukana fraza: "${cleanQuery}". Znaleziono w bazie:`, products);

    // Przekształcamy _id na string, aby frontend nie miał problemów z obiektem ObjectId
    const serializedProducts = products.map((prod: any) => ({
      ...prod,
      _id: prod._id.toString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("[API ERROR] Krytyczny błąd wyszukiwania:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message },
      { status: 500 }
    );
  }
}