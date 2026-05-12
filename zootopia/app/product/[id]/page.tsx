import Image from "next/image";
import styles from "./product.module.css";
import Accordion from "./productInfo";
import ReviewsSection from "./Reviews";
import Carousel from "./photoCarousel";
import QuantitySelector from "./QuantitySelectorProps";
import { connectToDatabase } from "@/lib/mongodb.js";
import Product from "@/models/Product";
import { Types } from "mongoose";

import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import starIcon from "@/app/Public/Images/tabler-icon-star.svg";
import "@/models/Category";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🔥 Next 15+: params to Promise
  const { id } = await params;

  // 🔥 DB connection
  await connectToDatabase();

  // 🔥 walidacja ID
  if (!id || !Types.ObjectId.isValid(id)) {
    return <div>Nieprawidłowe ID produktu</div>;
  }

  // 🔥 pobranie produktu
  const product = await Product.findById(id)
    .populate("category")
    .lean();

  if (!product) {
    return <div>Produkt nie istnieje</div>;
  }

  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>
        
        {/* LEWA */}
        <div className={styles.produktKaruzela}>
          <Carousel />
        </div>

        {/* PRAWA */}
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.alphawolfParent}>
              <div className={styles.alphawolf}>
                {product.category?.name || "Kategoria"}
              </div>

              <Image
                className={styles.ulubioneIcon}
                src={heartIcon}
                alt="Ulubione"
              />
            </div>

            <div className={styles.divider} />
          </div>

          <div className={styles.alphawolf400gBezzboowaMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzboowa}>
              {product.name}
            </h1>
          </div>

          <div className={styles.divider} />

          <div className={styles.frameDiv}>
            <div className={styles.tablerIconStarParent}>
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  className={styles.tablerIconStar}
                  src={starIcon}
                  alt="star"
                />
              ))}
            </div>
            <div className={styles.div}>(76)</div>
          </div>

          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>
              <div className={styles.z}>{product.price} zł</div>
              <div className={styles.zkg}>stan: {product.stock}</div>
            </div>
          </div>

          <div className={styles.divider} />

          <div style={{ marginBottom: 16 }}>
            <QuantitySelector />
          </div>

          {/* AKCJA */}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>
              <button className={styles.dodajDoKoszykaWrapper}>
                <div className={styles.dodajDoKoszyka}>
                  Dodaj do koszyka
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DÓŁ */}
      <div className={styles.vectorParent}>
        <div className={styles.dividerFull} />

        <Accordion
          title="Opis"
          content={product.description || "Brak opisu"}
        />

        <Accordion
          title="Dodatkowe informacje"
          content={`Stan magazynowy: ${product.stock}`}
        />

         <ReviewsSection productId={id} />
      </div>
    </div>
  );
}