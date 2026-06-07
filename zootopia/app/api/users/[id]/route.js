import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; 
import User from '@/models/User'; 

export async function DELETE(request, { params }) {
  try {
    // 1. Połączenie z bazą danych
    await connectDB();

    // 2. Rozpakowanie asynchronicznych parametrów (poprawka dla Next.js 15+)
    const { id } = await params; 
    const userId = id;

    if (!userId) {
      return NextResponse.json(
        { message: "Brak ID użytkownika w żądaniu." },
        { status: 400 }
      );
    }

    // 3. Usunięcie użytkownika z kolekcji MongoDB
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Nie znaleziono takiego użytkownika w bazie." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Użytkownik został pomyślnie usunięty." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Błąd serwera podczas usuwania:", error);
    return NextResponse.json(
      { message: "Wewnętrzny błąd serwera." },
      { status: 500 }
    );
  }
}