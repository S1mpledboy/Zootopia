import Image from "next/image";
import styles from "./product.module.css";

import Accordion from "./productInfo";
import ReviewsSection from "./Reviews";
import Carousel from "./photoCarousel";
import QuantityitySelector from "./QuantitySelectorProps";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import starIcon from "@/app/Public/Images/tabler-icon-star.svg";

import "@/models/Category";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = params;

  // Połączenie z bazą danych
  await connectToDatabase();

  // Walid ID validation
  if (!Types.ObjectId.isValid(id)) {
    return <div>Nieprawidłowe ID produktu</div>;
  }

  // Pobranie produktu
  const product = await Product.findById(id)
    .populate("category")
    .lean();

  if (!product) {
    return <div>Produkt nie istnieje</div>;
  }

  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>
        
        {/* LEWA KOLUMNA*/}
        <div className={styles.produktKaruzela}>
          <Carousel />
        </div>

        {/*PRAWA KOLUMNA*/}
        <div className={styles.frameGroup}>

          {/* Kategoria + Serce*/}
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

          {/*NOWA*/}
          <div className={styles.alphawolf400gBezzboMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzbo}>
              {product.name}
            </h1>
          </div>

          <div className={styles.divider} />

          {/*Gwiadki*/}
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

          {/*CENA + STAN*/}
          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>

              <div className={styles.z}>
                {product.price} zł
              </div>

              <div className={styles.zkg}>
                Stan: {product.stockock}
              </div>
            </div>

            <div className={styles.najiszaCenanaZ30DniPrzedParent}>
              <div className={styles.najnizsCena}>
                Dostępny w magazynie
              </div>
            </div>

            <div className={styles.cenaObowiazujeDo10052026Wrapper}>
              <div className={styles.div}>
                Wysyłka w ciągu 24h
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/*KZYK + ILOŚĆ*/}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>

              <QuantityitySelector />

              <button className={styles.dodajDoKoszykaWrapper}>
                <div className={styles.dodajDoKoszyka}>
                  Dodaj do koszyka
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*DOŁ*/}
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
              <li>Stan magazynowy: {product.stockock}</li>
              <li>
                Kategoria: {product.category?.name || "Brak"}
              </li>
            </ul>
          }
        />

        <ReviewsSection productId={id} />
      </div>
    </div>
  );
}