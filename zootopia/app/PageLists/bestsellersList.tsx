import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import categoryNameStyle from '@/app/modulesCSS/categoryName.module.css';

import PromotionItem from '../ItemBlocks/promotionItem';

// 🔥 Importy bazy danych i modeli
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Company"; // Rejestrujemy model firmy dla .populate()

export default async function Kategorie() {
  // 1. Łączymy się z bazą danych
  await connectToDatabase();

  // 2. Pobieramy 5 produktów:
  // - tylko aktywne (isActive: true)
  // - stan magazynowy większy niż 0 (stock: { $gt: 0 })
  // - sortujemy od najmniejszego stanu (stock: 1)
  // - wyciągamy tylko 5 sztuk (.limit(5))
  const bestsellersData = await Product.find({
    isActive: true,
    stock: { $gt: 0 } 
  })
    .populate("company")
    .sort({ stock: 1 }) 
    .limit(5)
    .lean();

  return (
    <div className={styles.kategorie}>
      {bestsellersData.map((product: any) => {
        // 🔥 Bezpieczne wyciąganie zdjęcia z tablicy w tablicy (images[0][0])
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
            image={productImage} // Przekazujemy przefiltrowany, czysty link URL
          />
        );
      })}
    </div>
  );
}