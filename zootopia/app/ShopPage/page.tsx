import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import PetCategory from "@/models/Category";
import "@/models/Company"; 
import KategorieClient from "./pageClient";

export const revalidate = 0;

export default async function KategoriePage() {
  // 1. Połączenie z bazą danych
  await connectToDatabase();

  // 2. Pobieramy produkty z bazy
  const rawProducts = await Product.find({ isActive: true })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

  // 3. Pobieramy wszystkie kategorie zwierzaków, by dynamicznie zbudować menu na froncie
  const rawCategories = await PetCategory.find({}).lean();

  // 4. Serializacja kategorii dla Next.js
  const serializedCategories = rawCategories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // 5. Formatujemy dane produktów
  const serializedProducts = rawProducts.map((product: any) => {
    let productImage = "/fallback-image.png";
    if (product.images && product.images.length > 0) {
      const innerImages = product.images[0];
      if (Array.isArray(innerImages) && innerImages.length > 0) {
        productImage = innerImages[0];
      } else if (typeof innerImages === "string") {
        productImage = innerImages;
      }
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.promoPrice,
      image: productImage,
      companyName: product.company?.name || "Zootopia",
      // Mapujemy pole petCategory i atrybuty z nowego schematu bazy danych
      petCategoryId: product.petCategory ? product.petCategory.toString() : null,
      attributes: product.attributes || []
    };
  });

  return (
    <KategorieClient 
      initialProducts={serializedProducts} 
      allCategories={serializedCategories} 
    />
  );
}