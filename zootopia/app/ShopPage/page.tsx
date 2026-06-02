import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; 
import "@/models/Company"; 
import KategorieClient from "./pageClient";

export const revalidate = 0;

// POPRAWIONY MAPPER: Teraz szuka dokładnie takich wartości, jakie masz w bazie danych!
const mapUrlTypeToDb = (type: string | null) => {
  switch (type) {
    case 'pies': return 'pies';           // W bazie masz "pies", a nie "DOG"
    case 'kot': return 'kot';             // W bazie masz "kot", a nie "CAT"
    case 'male-zwierzeta': return 'male-zwierzeta'; 
    case 'weterynaria': return 'weterynaria';
    case 'promocje': return 'promocje';
    default: return 'pies';
  }
};

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await connectToDatabase();

  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';
  const dbAnimalType = mapUrlTypeToDb(urlType);

  // 1. Pobieramy produkty z bazy (szuka np. animalType: "pies")
  const rawProducts = await Product.find({
    isActive: true,
    animalType: dbAnimalType 
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

  // 2. Pobieramy kategorie z kolekcji 'categories'
  const rawCategories = await Category.find({}).lean();

  const serializedCategories = rawCategories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  const serializedProducts = rawProducts.map((product: any) => {
    let productImage = "/fallback-image.png";
    if (product.images && product.images.length > 0) {
      productImage = product.images[0]; 
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.oldPrice, 
      image: productImage,
      companyName: product.company?.name || "Inna marka",
      // Przypisujemy ID kategorii
      petCategoryId: product.category ? product.category.toString() : null,
      attributes: (product as any).attributes || []
    };
  });

  return (
    <KategorieClient 
      initialProducts={serializedProducts} 
      allCategories={serializedCategories} 
    />
  );
}