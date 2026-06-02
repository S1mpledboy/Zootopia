import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; 
import "@/models/Company"; 
import KategorieClient from "./pageClient";

export const revalidate = 0;

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await connectToDatabase();

  const resolvedSearchParams = await searchParams;
  // Parametr z URL: 'pies', 'kot', 'male-zwierzeta'
  const urlType = resolvedSearchParams.type || 'pies'; 

  // 1. Pobieramy WSZYSTKIE kategorie, będą nam potrzebne do zbudowania menu
  const allCategoriesRaw = await Category.find({}).lean();

  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // 2. Znajdujemy ID głównego zwierzęcia na podstawie sluga (np. slug: "pies")
  const currentAnimalCategory = serializedCategories.find(cat => cat.slug === urlType && cat.parent === null);

  let targetCategoryIds: string[] = [];

  if (currentAnimalCategory) {
    // Szukamy wszystkich podkategorii (dzieci), które należą do tego zwierzaka (np. Karma mokra, Zabawki)
    const childCategories = serializedCategories.filter(cat => cat.parent === currentAnimalCategory._id);
    targetCategoryIds = childCategories.map(cat => cat._id);
  }

  // 3. Pobieramy produkty, które należą do podkategorii przypisanych do wybranego zwierzaka
  const rawProducts = await Product.find({
    isActive: true,
    category: { $in: targetCategoryIds } // Szuka produktów ze wszystkich podkategorii "Psa"
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

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