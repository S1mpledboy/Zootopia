import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import categoryNameStyle from '@/app/modulesCSS/categoryName.module.css';

import PromotionItem from '../ItemBlocks/promotionItem';

// Importy bazy danych i modeli Mongoose
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Company"; 

export default async function Kategorie() {
  // 1. Połączenie z bazą danych
  await connectToDatabase();

  // 2. Pobieramy produkty promocyjne i ograniczamy wynik do 5:
  const promoProducts = await Product.find({
    isActive: true,
    promoPrice: { $ne: null, $exists: true }
  })
    .populate("company")
    .sort({ updatedAt: -1 }) 
    .limit(5) // 🔥 TA LINIJKA: Gwarantuje, że pobierze się maksymalnie 5 produktów
    .lean();

  return (
    <div className={styles.kategorie}>
      {promoProducts.map((product: any) => {
        // Bezpieczne wyciąganie pierwszego zdjęcia ze struktury tablicy w tablicy
        let productImage = "/fallback-image.png";
        if (product.images && product.images.length > 0) {
          const innerImages = product.images[0];
          if (Array.isArray(innerImages) && innerImages.length > 0) {
            productImage = innerImages[0];
          } else if (typeof innerImages === "string") {
            productImage = innerImages;
          }
        }

        return (
          <PromotionItem
            key={product._id.toString()}
            id={product._id.toString()} 
            brandName={product.company?.name || "Zootopia"}
            productName={product.name}
            price={product.price}
            promoPrice={product.promoPrice} 
            image={productImage}
          />
        );
      })}
    </div>
  );
}