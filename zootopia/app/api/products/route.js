

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

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

    const transformedProducts = products.map((product) => ({
      id: product._id.toString(), 
      productName: product.name,
      brandName: product.company?.name || "Unknown Brand", 
      price: product.price,
      quantity: product.stock, 
      image: product.images?.[0] || "/placeholder.png", 
      description: product.description,
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

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      price: body.price,
      stock: body.stock ?? 0,
      category: body.category,
      company: body.company, 
      isActive: body.isActive ?? true,
      images: body.images ?? [],
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