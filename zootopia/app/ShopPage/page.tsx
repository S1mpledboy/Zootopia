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
  const urlType = resolvedSearchParams.type || 'pies'; 

  // 1. Pobieramy wszystkie kategorie z bazy
  const allCategoriesRaw = await Category.find({}).lean();

  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // 2. Szukamy ID dokumentu głównego zwierzaka (np. slug: "pies")
  const currentAnimalCategory = serializedCategories.find(
    cat => cat.slug === urlType && cat.parent === null
  );

  let targetCategoryIds: string[] = [];

  if (currentAnimalCategory) {
    // Pobieramy podkategorie, które bezpośrednio należą do tego zwierzaka
    const childCategories = serializedCategories.filter(
      cat => cat.parent === currentAnimalCategory._id
    );
    targetCategoryIds = childCategories.map(cat => cat._id);
  }

  // 3. Pobieramy produkty pasujące do wyciągniętych podkategorii
  const rawProducts = await Product.find({
    isActive: true,
    category: { $in: targetCategoryIds }
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

  const serializedProducts = rawProducts.map((product: any) => {
    let productImage = "/fallback-image.png";
    if (product.images && product.images.length > 0) {
      productImage = product.images[0]; 
    }

    // BEZPIECZNE I PEWNE KONWERTOWANIE ID KATEGORII DO STRINGA
    let catId = null;
    if (product.category) {
      catId = product.category._id 
        ? product.category._id.toString() 
        : product.category.toString();
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.oldPrice || null, 
      image: productImage,
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId, // To musi idealnie pasować do sub._id w kliencie
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