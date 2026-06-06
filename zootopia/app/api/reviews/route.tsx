import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

import Review from "@/models/Review";
import Product from "@/models/Product";

import { getAuthUser } from "@/middleware/auth";

// GET REVIEWS
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { message: "Missing productId" },
      { status: 400 }
    );
  }

  const reviews = await Review.find({ product: productId })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}

// POST REVIEW
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 🔥 WAŻNE: Twój auth musi dostać req
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { productId, rating, text } = body;

    if (!productId || !rating || !text) {
      return NextResponse.json(
        { message: "Missing data" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // 1 review per user
    const existing = await Review.findOne({
      user: user._id,
      product: productId,
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already reviewed" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      user: user._id,
      product: productId,
      rating,
      text,
    });

    const populated = await review.populate(
      "user",
      "firstName lastName"
    );

    return NextResponse.json(populated);
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}