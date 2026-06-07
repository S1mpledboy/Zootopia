import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Category from '@/models/Category';
import mongoose from 'mongoose'; // <-- WAŻNE: Dodane do weryfikacji formatu ID

function generateBaseSlug(text) {
  if (!text) return '';
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

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, parent } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Nazwa kategorii jest wymagana." }, { status: 400 });
    }

    let finalSlug = generateBaseSlug(name);

    // BEZPIECZNY WARUNEK: Sprawdzamy, czy parent istnieje ORAZ czy jest poprawnym ObjectId.
    // Jeśli z frontendu przyjdzie "" (pusty string), ten blok zostanie bezpiecznie pominięty.
    const hasValidParent = parent && mongoose.Types.ObjectId.isValid(parent);

    if (hasValidParent) {
      const parentCategory = await Category.findById(parent);
      if (parentCategory) {
        finalSlug = `${finalSlug}-${parentCategory.slug}`;
      }
    }

    // Sprawdzenie, czy generowany slug nie dubluje się w kolekcji
    const existingCategory = await Category.findOne({ slug: finalSlug });
    if (existingCategory) {
      return NextResponse.json(
        { message: `Kategoria ze slugiem '${finalSlug}' już istnieje.` }, 
        { status: 400 }
      );
    }

    // Zapis do bazy danych
    const newCategory = await Category.create({ 
      name, 
      slug: finalSlug, 
      parent: hasValidParent ? parent : null 
    });

    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Krytyczny błąd podczas tworzenia kategorii:", error);
    return NextResponse.json({ message: "Błąd serwera.", error: error.message }, { status: 500 });
  }
}