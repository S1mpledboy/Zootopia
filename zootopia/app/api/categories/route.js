import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

function generateBaseSlug(text) {
  const polishMap = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => polishMap[char] || char) // Zamiana polskich znaków
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')       // Usunięcie innych znaków specjalnych
    .trim()
    .replace(/\s+/g, '-')               // Spacje na myślniki
    .replace(/-+/g, '-');               // Usunięcie podwójnych myślników
}

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find().sort({ createdAt: -1 });

    return Response.json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, parent } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Nazwa jest wymagana." }, { status: 400 });
    }

    // 1. Generujemy bazowy slug dla nowej kategorii
    let finalSlug = generateBaseSlug(name);

    // 2. Jeśli kategoria posiada rodzica, pobieramy go z bazy i doklejamy jego slug
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (parentCategory) {
        finalSlug = `${finalSlug}-${parentCategory.slug}`;
      }
    }

    // 3. Sprawdzamy, czy taki slug już przypadkiem nie istnieje (wymóg unique: true)
    const existingCategory = await Category.findOne({ slug: finalSlug });
    if (existingCategory) {
      return NextResponse.json(
        { message: `Kategoria ze slugiem '${finalSlug}' już istnieje.` }, 
        { status: 400 }
      );
    }

    // 4. Zapis do bazy z wygenerowanym polem slug
    const newCategory = await Category.create({ 
      name, 
      slug: finalSlug, 
      parent: parent || null 
    });

    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Błąd przy tworzeniu kategorii:", error);
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}