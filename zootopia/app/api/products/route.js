import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Company from "@/models/Company"; // Jawny import, aby populate() działało bezbłędnie
import mongoose from "mongoose";

// Funkcja pomocnicza do pobierania lub tworzenia marki na podstawie nazwy tekstowej
async function getOrCreateCompany(companyName) {
  if (!companyName) return null;
  
  let company = await Company.findOne({ 
    name: { $regex: new RegExp(`^${companyName.trim()}$`, 'i') } 
  });
  
  if (!company) {
    company = await Company.create({ name: companyName.trim() });
  }
  return company._id;
}

// GET: Pobieranie i transformacja produktów pod Twój interfejs frontendu
export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({ isActive: true })
      .populate("category")
      .populate("company") 
      .sort({ stock: 1 }); 

    if (!products || products.length === 0) {
      console.warn(" Brak produktów w bazie");
      return Response.json([]);
    }

    // Twoja oryginalna transformacja danych z zachowaniem spójności pól
    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(), // Zmiana na _id, żeby pasowało do AdminProductsTab
      name: product.name,
      companyName: product.company?.name || "Unknown Brand", 
      company: product.company?._id?.toString() || "",
      price: product.price,
      promoPrice: product.promoPrice || null,
      stock: product.stock, 
      image: product.images?.[0] || "/placeholder.png", 
      images: product.images || [],
      petCategoryId: product.category?._id?.toString() || null,
      category: product.category?._id?.toString() || "",
      description: product.description || "",
      ingredients: product.ingredients || "",
      additionalInfo: product.additionalInfo || "",
      tags: product.tags || [],
    }));

    console.log(` Pobrano i transformowano ${transformedProducts.length} produktów`);
    return Response.json(transformedProducts);
  } catch (error) {
    console.error(" Błąd GET /api/products:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Tworzenie nowego produktu z automatyczną obsługą Company
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Wyciągamy 'brand' przesłany z modalu i zamieniamy go na ObjectId firmy
    const companyId = await getOrCreateCompany(body.brand || body.companyName);

    if (!body.name || !body.price || !body.category) {
      return Response.json({ ok: false, error: "Brak wymaganych pól (name, price, category)" }, { status: 400 });
    }

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      ingredients: body.ingredients || "",
      additionalInfo: body.additionalInfo || "",
      price: parseFloat(body.price),
      promoPrice: body.promoPrice ? parseFloat(body.promoPrice) : null,
      stock: body.stock ?? 0,
      category: new mongoose.Types.ObjectId(body.category),
      company: companyId, 
      isActive: body.isActive ?? true,
      images: body.images ?? [],
      tags: body.tags ?? [],
    });

    return Response.json(
      {
        ok: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(" Błąd POST /api/products:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}