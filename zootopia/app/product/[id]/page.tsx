'use client';

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
import plusIcon from "@/app/Public/Images/tabler-icon-plus.png";
import minusIcon from "@/app/Public/Images/tabler-icon-minus.png";

import "@/models/Category";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15+
  const { id } = await params;

  // DB
  await connectToDatabase();

  // walidacja ID
  if (!id || !Types.ObjectId.isValid(id)) {
    return <div>Nieprawidłowe ID produktu</div>;
  }

  // Produkt
  const product = await Product.findById(id)
    .populate("category")
    .lean();

  if (!product) {
    return <div>Produkt nie istnieje</div>;
  }

  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>

        {/* LEWA KOLUMNAA */}
        <div className={styles.produktKaruzela}>
          <Carousel />
        </div>

        {/* PRAWAA KOLUMNA */}
        <div className={styles.frameGroup}>

          {/* Kategoria + Serce */}
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

          {/* Nazwa produktu */}
          <div className={styles.alphawolf400gBezzboMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzbo}>
              {product.name}
            </h1>
          </div>

          <div className={styles.divider} />

          {/* Gwzdki */}
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

          {/* Cena + stan */}
          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>

              <div className={styles.z}>
                {product.price} zł
              </div>

              <div className={styles.zkg}>
                stan: {product.stock}
              </div>

            </div>

            <div className={styles.najiszaCenaZ30DniPrzedParent}>
              <div className={styles.najniszaCenaZ}>
                Dostępny w magazyn
              </div>
            </div>

            <div className={styles.cenaObowiazujeDo10052026Wrapper}>
              <div className={styles.div}>
                Wysyzyka w ciągu 24h.
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* KOSZYK + ILOŚĆ */}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>

              {/* Zachowujemy funkcjonalność QuantitySelector */}
              <QuantitySelector />

              <button className={styles.dodajDoKoszykaWrapper}>
                <div className={styles.dodajDoKoszyka}>
                  Dodaj do koszyka
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/*DÓŁ*/}
      <div className={styles.vectorParent}>
        <div className={styles.dividerFull} />

        <Accordion
          title="Opis"
          content={product.description || "Brak opisu"}
        />

        <Accordion
          title="Dodatkowe informacje"
          content={
            <ul>
              <li>Stan magazynowy: {product.stock}</li>
              <li>Kategoria: {product.category?.name || "Brak"}</li>
            </ul>
          }
        />

        <ReviewsSection productId={id} />
      </div>
    </div>
  );
}