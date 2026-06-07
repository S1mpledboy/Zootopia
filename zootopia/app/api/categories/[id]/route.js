import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Category from '@/models/Category';

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { name } = await request.json();

    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return NextResponse.json({ message: "Nie znaleziono." }, { status: 404 });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Nie znaleziono." }, { status: 404 });

    // OPCJONALNIE: Dodaj usuwanie dzieci (podkategorii powiązanych z parent: id)
    await Category.deleteMany({ parent: id });

    return NextResponse.json({ message: "Usunięto pomyślnie." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}