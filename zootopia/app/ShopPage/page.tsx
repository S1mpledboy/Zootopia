import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import PetCategory from "@/models/Category"; // Twoja nowa kolekcja kategorii zrobiona skryptem
import "@/models/Company"; 
import KategorieClient from "./pageClient";

export const revalidate = 0;

// Pomocniczy mapper zamieniający typ z URL na format z Twojej bazy danych (DOG, CAT...)
const mapUrlTypeToDb = (type: string | null) => {
  switch (type) {
    case 'pies': return 'DOG';
    case 'kot': return 'CAT';
    case 'male-zwierzeta': return 'SMALL_ANIMALS';
    case 'weterynaria': return 'VET';
    case 'promocje': return 'PROMOTIONS';
    default: return 'DOG'; // Domyślnie ładujemy DOG, jeśli brak parametru
  }
};

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await connectToDatabase();

  // Odczytujemy typ z URL (np. 'pies') i zamieniamy go na format bazy (np. 'DOG')
  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';
  const dbAnimalType = mapUrlTypeToDb(urlType);

  // Pobieramy produkty dopasowane TYLKO do danego zwierzęcia, żeby baza nie robiła nadmiernej pracy
  const rawProducts = await Product.find({
    isActive: true,
    animalType: dbAnimalType // Szukamy "DOG", "CAT" itd.
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .lean();

  // Pobieramy strukturę kategorii
  const rawCategories = await PetCategory.find({}).lean();

  const serializedCategories = rawCategories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  const serializedProducts = rawProducts.map((product: any) => {
    let productImage = "/fallback-image.png";
    if (product.images && product.images.length > 0) {
      productImage = product.images[0]; // Poprawione czytanie Twojej płaskiej tablicy [String]
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      promoPrice: product.oldPrice, // W Twojej bazie stare ceny/promocje są w oldPrice
      image: productImage,
      companyName: product.company?.name || "Inna marka",
      // TUTAJ POPRAWA: mapujemy Twoje oryginalne pole 'category' z bazy danych
      petCategoryId: product.category ? product.category.toString() : null,
      // Jeśli na razie nie masz pola 'attributes' w produkcie, przekazujemy pustą tablicę, by kod się nie wywalił
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