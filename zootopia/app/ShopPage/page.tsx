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

  const allCategoriesRaw = await Category.find({}).lean();

  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // 🔥 HELPER: identyczne rozpakowywanie obrazka jak na stronie głównej
  const extractImage = (images: any[]): string => {
    if (!images || images.length === 0) return "/fallback-image.png";
    const first = images[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
    if (typeof first === "string") return first;
    return "/fallback-image.png";
  };

  // 🔥 HELPER: serializacja produktu (jedno miejsce, brak duplikacji)
  const serializeProduct = (product: any) => {
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
      promoPrice: product.oldPrice ?? null, // 🔥 oldPrice z modelu → promoPrice dla komponentu
      image: extractImage(product.images),
      companyName: product.company?.name || "Inna marka",
      petCategoryId: catId,
      attributes: product.attributes || []
    };
  };

  // ============================================================
  // PROMOCJE: filtrujemy po oldPrice (nie po kategorii)
  // ============================================================
  if (urlType === 'promocje') {
    const rawProducts = await Product.find({
      isActive: true,
      oldPrice: { $ne: null, $exists: true, $gt: 0 } // 🔥 oldPrice, nie promoPrice
    })
      .populate("company")
      .sort({ updatedAt: -1 })
      .lean();

    return (
      <KategorieClient
        initialProducts={rawProducts.map(serializeProduct)}
        allCategories={serializedCategories}
      />
    );
  }

  // ============================================================
  // NORMALNA ŚCIEŻKA: filtrowanie po kategorii zwierzaka
  // ============================================================
  const currentAnimalCategory = serializedCategories.find(
    cat => cat.slug === urlType && cat.parent === null
  );

  let targetCategoryIds: string[] = [];

  if (currentAnimalCategory) {
    const childCategories = serializedCategories.filter(
      cat => cat.parent === currentAnimalCategory._id
    );
    targetCategoryIds = childCategories.map(cat => cat._id);
  }

  const rawProducts = await Product.find({
    isActive: true,
    category: { $in: targetCategoryIds }
  })
    .populate("company")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <KategorieClient
      initialProducts={rawProducts.map(serializeProduct)}
      allCategories={serializedCategories}
    />
  );
}