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
  const company = searchParams.get("company");
  const animalType = searchParams.get("animalType");
  const sort = searchParams.get("sort");

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const isActive = searchParams.get("isActive");
  const isPromotion = searchParams.get("isPromotion");

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { ingredients: { $regex: search, $options: "i" } },
      { additionalInfo: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (company) {
    filter.company = company;
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

  if (isPromotion === "true") {
    filter.isPromotion = true;
  }

  if (isPromotion === "false") {
    filter.isPromotion = false;
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

  const products = await Product.find(filter)
    .populate("category", "name slug parent")
    .populate("company", "name slug")
    .sort(sortOption);

  return Response.json({ products });
}

export async function POST(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);

  if (error) return error;

  const body = await req.json();

  if (!body.name || body.price === undefined || !body.category || !body.company) {
    return Response.json(
      { message: "Name, price, category and company are required" },
      { status: 400 }
    );
  }

  if (body.promoPrice !== undefined && body.promoPrice !== null) {
    if (Number(body.promoPrice) >= Number(body.price)) {
      return Response.json(
        { message: "Promo price must be lower than regular price" },
        { status: 400 }
      );
    }
  }

  const product = await Product.create({
    name: body.name,
    description: body.description || "",
    ingredients: body.ingredients || "",
    additionalInfo: body.additionalInfo || "",

    price: Number(body.price),
    oldPrice: body.oldPrice !== undefined && body.oldPrice !== null
      ? Number(body.oldPrice)
      : null,

    promoPrice: body.promoPrice !== undefined && body.promoPrice !== null
      ? Number(body.promoPrice)
      : null,

    isPromotion: body.isPromotion !== undefined
      ? Boolean(body.isPromotion)
      : false,

    stock: body.stock !== undefined
      ? Number(body.stock)
      : 0,

    category: body.category,
    company: body.company,

    animalType: body.animalType || null,

    images: Array.isArray(body.images)
      ? body.images
      : [],

    rating: body.rating !== undefined
      ? Number(body.rating)
      : 0,

    popularity: body.popularity !== undefined
      ? Number(body.popularity)
      : 0,

    isActive: body.isActive !== undefined
      ? Boolean(body.isActive)
      : true,

    tags: Array.isArray(body.tags)
      ? body.tags
      : [],
  });

  return Response.json(
    {
      message: "Product created successfully",
      product,
    },
    { status: 201 }
  );
}