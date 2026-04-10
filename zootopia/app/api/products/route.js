import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return Response.json({
      ok: true,
      data: products,
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
    });

    return Response.json(
      {
        ok: true,
        data: product,
      },
      { status: 201 }
    );
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