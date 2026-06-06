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

export async function GET(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const { error } = await requireAdmin(req);

  if (error) return error;

  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("company", "name slug");

  if (!product) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json({ product });
}

export async function PATCH(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const { error } = await requireAdmin(req);

  if (error) return error;

  const body = await req.json();

  const allowedFields = [
    "name",
    "description",
    "ingredients",
    "additionalInfo",
    "price",
    "oldPrice",
    "promoPrice",
    "isPromotion",
    "category",
    "company",
    "animalType",
    "stock",
    "rating",
    "popularity",
    "images",
    "isActive",
    "tags",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  if (
    body.promoPrice !== undefined &&
    body.promoPrice !== null &&
    body.price !== undefined
  ) {
    if (Number(body.promoPrice) >= Number(body.price)) {
      return Response.json(
        {
          message:
            "Promo price must be lower than regular price",
        },
        { status: 400 }
      );
    }
  }

  if (Object.keys(updateData).length === 0) {
    return Response.json(
      { message: "No data to update" },
      { status: 400 }
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name slug")
    .populate("company", "name slug");

  if (!updatedProduct) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
}

export async function DELETE(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const { error } = await requireAdmin(req);

  if (error) return error;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "Product deleted successfully",
  });
}