import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// Wymuszenie rejestracji powiązanych modeli
import CompanyModel from "@/models/Company";
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

    // Bezpieczne przypisanie modeli
    const Product = mongoose.models.Product || ProductModel;
    const Company = mongoose.models.Company || CompanyModel;

    // 2. KROK 1: Szukamy firm, których nazwa pasuje do zapytania
    const matchingCompanies = await Company.find({
      name: { $regex: cleanQuery, $options: "i" }
    }).select("_id").lean();

    // Wyciągamy same ID znalezionych firm do tablicy
    const companyIds = matchingCompanies.map(company => company._id);

    // 3. KROK 2: Szukamy produktów, które pasują po NAZWIE lub po ID FIRMY
    const products = await Product.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },       // Dopasowanie po nazwie produktu
        { company: { $in: companyIds } }                      // Dopasowanie po firmie (produconcie)
      ],
      isActive: true // Przywracamy produkcyjne zabezpieczenie aktywności
    })
      .select("name price images")
      .limit(6)
      .lean();

    // 4. Konwersja obiektów na czysty JSON (stringowanie ObjectId dla frontendu)
    const serializedProducts = products.map((prod: any) => ({
      ...prod,
      _id: prod._id.toString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("[API SEARCH CRITICAL ERROR]:", error);
    return NextResponse.json(
      { message: "Błąd wyszukiwania", error: error.message },
      { status: 500 }
    );
  }
}