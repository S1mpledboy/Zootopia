import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Company"; 
import KategorieClient from "./pageClient"; // Zmień ścieżkę jeśli plik nazywa się inaczej lub jest w innym folderze

export const revalidate = 0;

export default async function KategoriePage() {
  // 1. Połączenie z bazą danych
  await connectToDatabase();

  // 2. Pobieramy produkty z bazy
  const rawProducts = await Product.find({
    isActive: true,
    //promoPrice: { $ne: null, $exists: true }
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

  // 3. Formatyzujemy dane, aby móc je przekazać do Client Component 
  // (Next.js wymaga prostych obiektów, nie możemy przekazać całego modelu Mongoose)
  const serializedProducts = rawProducts.map((product: any) => {
    
    // Bezpieczne wyciąganie pierwszego zdjęcia
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
      companyName: product.company?.name || "Zootopia"
    };
  });

  // Renderujemy Client Component przekazując sformatowane produkty jako prop
  return <KategorieClient initialProducts={serializedProducts} />;
}