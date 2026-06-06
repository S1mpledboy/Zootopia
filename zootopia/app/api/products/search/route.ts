import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

import CompanyModel from "@/models/Company";
import "@/models/Category";
import ProductModel from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const cleanQuery = query.trim();

    await connectToDatabase();

    const Product = mongoose.models.Product || ProductModel;
    const Company = mongoose.models.Company || CompanyModel;

    const matchingCompanies = await Company.find({
      name: { $regex: cleanQuery, $options: "i" }
    }).select("_id").lean();

    const companyIds = matchingCompanies.map(company => company._id);

    const products = await Product.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { company: { $in: companyIds } }
      ],
      isActive: true
    })
      .select("name price promoPrice images")  
      .limit(6)
      .lean();

    const serializedProducts = products.map((prod: any) => ({
      ...prod,
      _id: prod._id.toString(),
      price: prod.promoPrice ?? prod.price,
      originalPrice: prod.promoPrice ? prod.price : undefined,
    }));

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("[API SEARCH CRITICAL ERROR]:", error);
    return NextResponse.json(
      { message: "Błąd wyszukiwania", error: error.message },
      { status: 500 }
    );
  }
}