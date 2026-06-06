import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req: Request) {
  try {
    
    const authHeader = req.headers.get("authorization");
    
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Backend: Brak tokenu w nagłówkach. Odmowa dostępu (401).");
      return NextResponse.json({ message: "Brak autoryzacji - zaloguj się" }, { status: 401 });
    }

   
    await connectToDatabase();

    let user = null;
    try {
      user = await getAuthUser(req);
    } catch (authError) {
      console.error("Backend: Błąd weryfikacji tokenu:", authError);
      return NextResponse.json({ message: "Nieprawidłowy token" }, { status: 401 });
    }

   
    if (!user || !user._id) {
      console.log("Backend: Token nie zawiera poprawnego ID użytkownika.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    const dbUser = await User.findById(user._id).select("-password");

    if (!dbUser) {
      console.log(`Backend: Użytkownik o ID ${user._id} nie istnieje w bazie.`);
      return NextResponse.json({ message: "Użytkownik nie istnieje" }, { status: 404 });
    }

    
    console.log("Backend: Pomyślnie odesłano dane dla:", dbUser.email);
    return NextResponse.json(dbUser);

  } catch (error: any) {
    console.error("Błąd krytyczny w endpoint /api/user/me:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}