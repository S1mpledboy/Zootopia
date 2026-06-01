import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    // Jeśli zapytanie jest za krótkie, nie obciążamy bazy danych
    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Połączenie z bazą danych (zgodnie z Twoim przykładem)
    await connectToDatabase();

    // Wyszukiwanie produktów po nazwie za pomocą wyrażenia regularnego (uproszczone i case-insensitive)
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      isActive: true,
    })
      .select("name price images") // Pobieramy tylko niezbędne dane dla nawigacji
      .limit(6)                    // Ograniczamy liczbę podpowiedzi
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Błąd podczas wyszukiwania:", error);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}