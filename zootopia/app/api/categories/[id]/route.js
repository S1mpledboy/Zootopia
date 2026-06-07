import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Category from '@/models/Category';

function generateBaseSlug(text) {
  const polishMap = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
  };
  return text
    .toLowerCase()
    .split('')
    .map(char => polishMap[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { name } = await request.json();

    const updateData = { name };

    // Jeśli aktualizujemy nazwę, musimy wygenerować nowy slug
    if (name) {
      let finalSlug = generateBaseSlug(name);
      
      // Sprawdzamy czy edytowana kategoria ma przypisanego rodzica
      const currentCategory = await Category.findById(id);
      if (currentCategory && currentCategory.parent) {
        const parentCategory = await Category.findById(currentCategory.parent);
        if (parentCategory) {
          finalSlug = `${finalSlug}-${parentCategory.slug}`;
        }
      }
      
      updateData.slug = finalSlug;
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ message: "Nie znaleziono kategorii." }, { status: 404 });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("Błąd przy edycji kategorii:", error);
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Nie znaleziono kategorii." }, { status: 404 });

    // Usuwanie kaskadowe podkategorii
    await Category.deleteMany({ parent: id });

    return NextResponse.json({ message: "Usunięto pomyślnie." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}