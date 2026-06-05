import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ProductModel from "@/models/Product";
import CompanyModel from "@/models/Company";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "pies";

    // Reużywanie aktywnego połączenia z MongoDB
    if (mongoose.connection.readyState === 0) {
      const baseUri = process.env.MONGODB_URI;
      if (!baseUri) throw new Error("Brak MONGODB_URI w środowisku!");
      await mongoose.connect(baseUri, { dbName: "mydb" });
    }

    // Dynamiczne budowanie zapytania Mongoose
    let query: any = { isActive: true };

    if (type === 'promocje') {
      query.promoPrice = { $ne: null, $exists: true, $gt: 0 };
    }

    // Pobieramy produkty i dołączamy dane o producentach przez lean() dla prędkości
    const rawProducts = await ProductModel.find(query)
      .populate("company")
      .sort({ updatedAt: -1 })
      .lean();

    // Helper do wyciągania pierwszego zdjęcia
    const extractImage = (images: any[]): string => {
      if (!images || images.length === 0) return "/fallback-image.png";
      const first = images[0];
      if (Array.isArray(first) && first.length > 0) return first[0];
      if (typeof first === "string") return first;
      return "/fallback-image.png";
    };

    // Przekształcamy dane na lżejszy i czystszy JSON dla front-endu
    const serializedProducts = rawProducts.map((product: any) => {
      let catId = null;
      if (product.category) {
        catId = product.category._id ? product.category._id.toString() : product.category.toString();
      }

      return {
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        promoPrice: product.promoPrice ?? null,
        image: extractImage(product.images),
        companyName: product.company?.name || "Inna marka",
        petCategoryId: catId,
        tags: product.tags || []
      };
    });

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("Błąd API /api/shop-products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}