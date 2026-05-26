// app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb.js"; // Używamy Twojego połączenia
import User from "@/models/User";

export async function GET() {
  try {
    // Odpalamy Twoją funkcję łączącą z MongoDB
    await connectToDatabase();
    
    // Szukamy JEDNEGO (najnowszego) użytkownika z bazy, aby sprawdzić działanie bez sesji
    const user = await User.findOne().sort({ createdAt: -1 });
    
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Brak użytkowników w bazie" }, 
        { status: 404 }
      );
    }

    // Zwracamy obiekt w formacie oczekiwanym przez frontend koszyka
    return NextResponse.json(
      { 
        ok: true, 
        data: user 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message || "Błąd serwera" 
      }, 
      { status: 500 }
    );
  }
}