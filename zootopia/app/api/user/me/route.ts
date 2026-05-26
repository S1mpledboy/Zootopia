import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req: Request) {
  try {
    // 1. Sprawdzamy, czy nagłówek Authorization w ogóle istnieje w żądaniu
    const authHeader = req.headers.get("authorization");
    
    // Jeśli nie ma nagłówka lub jest pusty -> użytkownik jest NIEZALOGOWANY
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Backend: Brak tokenu w nagłówkach. Odmowa dostępu (401).");
      return NextResponse.json({ message: "Brak autoryzacji - zaloguj się" }, { status: 401 });
    }

    // 2. Łączymy się z bazą danych MongoDB
    await connectToDatabase();

    // 3. Próbujemy odkodować użytkownika z tokenu
    let user = null;
    try {
      user = await getAuthUser(req);
    } catch (authError) {
      console.error("Backend: Błąd weryfikacji tokenu:", authError);
      return NextResponse.json({ message: "Nieprawidłowy token" }, { status: 401 });
    }

    // Jeśli funkcja getAuthUser nie zwróciła obiektu użytkownika
    if (!user || !user._id) {
      console.log("Backend: Token nie zawiera poprawnego ID użytkownika.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 4. Pobieramy dane z bazy na podstawie ID wyciągniętego z tokenu
    const dbUser = await User.findById(user._id).select("-password");

    if (!dbUser) {
      console.log(`Backend: Użytkownik o ID ${user._id} nie istnieje w bazie.`);
      return NextResponse.json({ message: "Użytkownik nie istnieje" }, { status: 404 });
    }

    // Jeśli wszystko jest super, zwracamy dane zalogowanego użytkownika
    console.log("Backend: Pomyślnie odesłano dane dla:", dbUser.email);
    return NextResponse.json(dbUser);

  } catch (error: any) {
    console.error("Błąd krytyczny w endpoint /api/user/me:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}