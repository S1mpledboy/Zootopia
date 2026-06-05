import styles from '@/app/modulesCSS/promotionList.module.css';
import PromotionItem from '../ItemBlocks/promotionItem';
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Company";

export const dynamic = "force-dynamic";  // ← zamiast revalidate = 0

export default async function Kategorie() {
  await connectToDatabase();

  const promoProducts = await Product.find({
    isActive: true,
    promoPrice: { $ne: null, $exists: true, $gt: 0 }  // ← dodane $gt: 0 dla pewności
  })
    .populate("company")
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  return (
    <div className={styles.kategorie}>
      {promoProducts.map((product: any) => {
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