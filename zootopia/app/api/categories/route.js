import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

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

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const category = await Category.create({
      name: body.name,
      description: body.description || "",
    });

    return Response.json(
      {
        ok: true,
        data: category,
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