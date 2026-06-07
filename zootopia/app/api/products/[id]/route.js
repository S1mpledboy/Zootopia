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

// PATCH: Aktualizacja produktu z obsługą wielu zdjęć
export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ ok: false, error: "Niepoprawne ID produktu" }, { status: 400 });
    }

    const body = await req.json();
    const updateData = {};

    if (body.name !== undefined && body.name !== "") updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
    if (body.additionalInfo !== undefined) updateData.additionalInfo = body.additionalInfo;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.promoPrice !== undefined) updateData.promoPrice = body.promoPrice ? parseFloat(body.promoPrice) : null;
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);

    // KONTROLA WIELU ZDJĘĆ PRZY EDYCJI:
    // Aktualizujemy galerię tylko wtedy, gdy z frontendu przyszła zdefiniowana tablica nowo wybranych zdjęć
    if (body.images !== undefined && Array.isArray(body.images)) {
      // Odrzucamy placeholder, jeśli w tablicy znajdują się też inne, poprawne zdjęcia
      const cleanImages = body.images.filter(img => img && img !== "/placeholder.png" && img.trim() !== "");
      
      // Jeśli użytkownik usunął wszystkie zdjęcia, zostanie pusta tablica (lub zachowaj placeholder)
      updateData.images = cleanImages.length > 0 ? cleanImages : (body.images.includes("/placeholder.png") ? ["/placeholder.png"] : []);
    }

    if (body.category && mongoose.Types.ObjectId.isValid(body.category)) {
      updateData.category = new mongoose.Types.ObjectId(body.category);
    }

    const brandString = body.brand || body.brandName || body.companyName;
    if (brandString && brandString !== "Unknown Brand") {
      updateData.company = await getOrCreateCompany(brandString);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("company");

    if (!updatedProduct) {
      return Response.json({ ok: false, error: "Nie znaleziono produktu" }, { status: 404 });
    }

    // Odpowiedź zwrotna dla zsynchronizowania stanu frontendu
    const responseData = {
      _id: updatedProduct._id.toString(),
      id: updatedProduct._id.toString(),
      productName: updatedProduct.name,
      name: updatedProduct.name,
      brandName: updatedProduct.company?.name || "Unknown Brand",
      companyName: updatedProduct.company?.name || "Unknown Brand",
      price: updatedProduct.price,
      promoPrice: updatedProduct.promoPrice,
      stock: updatedProduct.stock,
      quantity: updatedProduct.stock,
      image: updatedProduct.images?.[0] || "/placeholder.png",
      images: updatedProduct.images && updatedProduct.images.length > 0 ? updatedProduct.images : ["/placeholder.png"],
      category: updatedProduct.category?.toString(),
      description: updatedProduct.description,
    };

    return Response.json({ ok: true, data: responseData });
  } catch (error) {
    console.error(" Błąd PATCH /api/products/[id]:", error);
    return Response.json({ ok: false, error: "Błąd podczas edycji" }, { status: 500 });
  }
}

// DELETE: Bez zmian
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ ok: false, error: "Niepoprawne ID produktu" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json({ ok: false, error: "Produkt nie istnieje" }, { status: 404 });
    }

    return Response.json({ ok: true, message: "Produkt pomyślnie usunięty" });
  } catch (error) {
    console.error(" Błąd DELETE /api/products/[id]:", error);
    return Response.json({ ok: false, error: "Błąd podczas usuwania" }, { status: 500 });
  }
}