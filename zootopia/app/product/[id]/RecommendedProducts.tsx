import Image from "next/image";
import Link from "next/link";
import styles from "./RecommendedProducts.module.css";

type RecommendedProduct = {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  images?: string[];
  company?: { name?: string };
};

type Props = {
  products: RecommendedProduct[];
};

export default function RecommendedProducts({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Polecane produkty</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          const image = product.images?.[0] || "/fallback-image.png";
          const hasPromo =
            product.promoPrice !== undefined && product.promoPrice !== null;

          return (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className={styles.info}>
                <p className={styles.brand}>
                  {product.company?.name || "Zootopia"}
                </p>
                <p className={styles.name}>{product.name}</p>
                <div className={styles.priceRow}>
                  <span
                    className={`${styles.price} ${hasPromo ? styles.oldPrice : ""}`}
                  >
                    {product.price} zł
                  </span>
                  {hasPromo && (
                    <span className={styles.promoPrice}>
                      {product.promoPrice} zł
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}