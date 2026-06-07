import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Company from "@/models/Company";
import mongoose from "mongoose";

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

// GET: Pobieranie i transformacja produktów
export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({ isActive: true })
      .populate("category")
      .populate("company") 
      .sort({ stock: 1 }); 

    if (!products || products.length === 0) {
      return Response.json([]);
    }

    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(),
      id: product._id.toString(),
      productName: product.name,
      name: product.name,
      brandName: product.company?.name || "Unknown Brand", 
      companyName: product.company?.name || "Unknown Brand",
      company: product.company?._id?.toString() || "",
      price: product.price,
      promoPrice: product.promoPrice || null,
      stock: product.stock,
      quantity: product.stock, 
      // Główne zdjęcie to pierwszy element z tablicy, jeśli brak - placeholder
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png", 
      // Zwracamy pełną tablicę wszystkich wgranych zdjęć do galerii/modalu
      images: product.images && product.images.length > 0 ? product.images : ["/placeholder.png"], 
      category: product.category?._id?.toString() || "",
      description: product.description || "",
      ingredients: product.ingredients || "",
      additionalInfo: product.additionalInfo || "",
    }));

    return Response.json(transformedProducts);
  } catch (error) {
    console.error(" Błąd GET /api/products:", error);
    return Response.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}

// POST: Tworzenie nowego produktu z wieloma zdjęciami
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const brandString = body.brand || body.brandName || body.companyName;
    const companyId = await getOrCreateCompany(brandString);

    if (!body.name || !body.price || !body.category) {
      return Response.json({ ok: false, error: "Brak wymaganych pól" }, { status: 400 });
    }

    // Obsługa wielu zdjęć: odfiltrowujemy ewentualne puste stringi
    let productImages = [];
    if (body.images && Array.isArray(body.images)) {
      productImages = body.images.filter(img => img && img.trim() !== "");
    } else if (body.image) {
      productImages = [body.image];
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
      images: productImages, // Zapisujemy tablicę zdjęć
    });

    return Response.json({ ok: true, data: product }, { status: 201 });
  } catch (error) {
    console.error(" Błąd POST /api/products:", error);
    return Response.json({ ok: false, error: "Błąd serwera" }, { status: 500 });
  }
}