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

// PATCH: Aktualizacja istniejącego produktu
export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ ok: false, error: "Niepoprawne ID produktu" }, { status: 400 });
    }

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
    if (body.additionalInfo !== undefined) updateData.additionalInfo = body.additionalInfo;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.promoPrice !== undefined) updateData.promoPrice = body.promoPrice ? parseFloat(body.promoPrice) : null;
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);
    if (body.images !== undefined) updateData.images = body.images;
    if (body.tags !== undefined) updateData.tags = body.tags;

    if (body.category && mongoose.Types.ObjectId.isValid(body.category)) {
      updateData.category = new mongoose.Types.ObjectId(body.category);
    }

    // Jeśli zmieniła się nazwa firmy w formularzu, aktualizujemy powiązanie
    if (body.brand || body.companyName) {
      updateData.company = await getOrCreateCompany(body.brand || body.companyName);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return Response.json({ ok: false, error: "Nie znaleziono produktu" }, { status: 404 });
    }

    return Response.json({
      ok: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(" Błąd PATCH /api/products/[id]:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: Usuwanie produktu z bazy danych
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ ok: false, error: "Niepoprawne ID produktu" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json({ ok: false, error: "Produkt nie istnieje" }, { status: 404 });
    }

    return Response.json({ ok: true, message: "Produkt pomyślnie usunięty" });
  } catch (error) {
    console.error(" Błąd DELETE /api/products/[id]:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}