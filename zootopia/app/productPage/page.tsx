// /app/productPage/page.tsx
import ProductDetails from './ProductDetails'; // Ścieżka do Twojego szablonu
import { ProductProps } from './types';      // Ścieżka do Twoich typów

// 1. Musisz przygotować dane (możesz je pobierać z bazy/API)
const productData: ProductProps = {
  brand: "ALPHAWOLF",
  fullName: "AlphaWolf 400g Bezzbożowa Mokra Karma Jagnięcina",
  mainImage: "/images/product-main.png",
  gallery: ["/images/side1.png", "/images/side2.png"],
  price: 28.50,
  pricePerKg: "71,25 zł/kg",
  oldPrice: 34.90,
  promoEndDate: "10.05.2026",
  rating: 5,
  reviewsCount: 76,
  description: "Pierwsze miesiące życia to kluczowy czas...",
  ingredients: {
    intro: "W Zootopii nie mamy nic do ukrycia.",
    list: ["Jagnięcina 65%", "Bataty 7%", "Olej z łososia"]
  },
  additionalInfo: ["Przechowywać w lodówce", "Podawać w temp. pokojowej"],
  reviews: [
    { author: "Kasia i Riko", rating: 5, date: "21.04.2026", comment: "Mój cocker spaniel uwielbia tę karmę!" }
  ]
};

// 2. KLUCZOWE: Musisz użyć 'export default function', 
// a nazwa komponentu powinna zaczynać się od wielkiej litery.
export default function Page() {
  return (
    <main>
      <ProductDetails {...productData} />
    </main>
  );
}