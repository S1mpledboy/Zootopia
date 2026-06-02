import Product from "@/models/Product";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

async function requireAdmin(req) {
  const admin = await getAuthUser(req);

  if (!admin) {
    return {
      error: Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (admin.role !== "admin") {
    return {
      error: Response.json(
        { message: "Forbidden: admin only" },
        { status: 403 }
      ),
    };
  }

  return { admin };
}

export async function GET(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);

  if (error) return error;

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const animalType = searchParams.get("animalType");
  const sort = searchParams.get("sort");

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const isActive = searchParams.get("isActive");

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (animalType) {
    filter.animalType = animalType;
  }

  if (isActive === "true") {
    filter.isActive = true;
  }

  if (isActive === "false") {
    filter.isActive = false;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  let sortOption = { createdAt: -1 };

  if (sort === "NAME_ASC") sortOption = { name: 1 };
  if (sort === "NAME_DESC") sortOption = { name: -1 };
  if (sort === "PRICE_ASC") sortOption = { price: 1 };
  if (sort === "PRICE_DESC") sortOption = { price: -1 };
  if (sort === "POPULARITY") sortOption = { popularity: -1 };
  if (sort === "STOCK_ASC") sortOption = { stock: 1 };
  if (sort === "STOCK_DESC") sortOption = { stock: -1 };

  const products = await Product.find(filter).sort(sortOption);

  return Response.json({ products });
}

export async function POST(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);

  if (error) return error;

  const body = await req.json();

  if (!body.name || !body.price || !body.category || !body.animalType) {
    return Response.json(
      { message: "Name, price, category and animalType are required" },
      { status: 400 }
    );
  }

  const product = await Product.create({
    name: body.name,
    brand: body.brand || "",
    description: body.description || "",
    price: body.price,
    oldPrice: body.oldPrice || null,
    imageUrl: body.imageUrl || "",
    category: body.category,
    animalType: body.animalType,
    stock: body.stock || 0,
    rating: body.rating || 0,
    popularity: body.popularity || 0,
    isActive: body.isActive !== undefined ? body.isActive : true,
    tags: body.tags || [],
  });

  return Response.json(
    {
      message: "Product created successfully",
      product,
    },
    { status: 201 }
  );
}