
import Image from "next/image";
import styles from "./product.module.css";

import Accordion from "./productInfo";
import ReviewsSection from "./Reviews";
import Carousel from "./photoCarousel";
import QuantitySelector from "./QuantitySelectorProps";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import starIcon from "@/app/Public/Images/tabler-icon-star.svg";

import "@/models/Company";
import "@/models/Category";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {

  // NEXT 15/16
  const { id } = await params;

  // DATABASE
  await connectToDatabase();

  // VALIDATION
  if (!Types.ObjectId.isValid(id)) {
    return <div>Nieprawidłowe ID produktu</div>;
  }

  // PRODUCT
const product = await Product.findById(id)
  .populate({ path: "company" })
  .lean();

  // PRODUCT NOT FOUND
  if (!product) {
    return <div>Produkt nie istnieje</div>;
  }

  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>

        {/* LEWA KOLUMNA */}
        <div className={styles.produktKaruzela}>
          <Carousel />
        </div>

        {/* PRAWA KOLUMNA */}
        <div className={styles.frameGroup}>

          {/* KATEGORIA + SERCE */}
          <div className={styles.frameContainer}>
            <div className={styles.alphawolfParent}>

              <div className={styles.alphawolf}>
                {product.company?.name || "Zootopia"}
              </div>

              <Image
                className={styles.ulubioneIcon}
                src={heartIcon}
                alt="Ulubione"
              />
            </div>

            <div className={styles.divider} />
          </div>

          {/* NAZWA PRODUKTU */}
          <div className={styles.alphawolf400gBezzboowaMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzboowa}>
              {product.name}
            </h1>
          </div>

          <div className={styles.divider} />

          {/* GWIAZDKI */}
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

            <div className={styles.div}>
              (76)
            </div>
          </div>

          {/* CENA */}
          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>

              <div className={styles.z}>
                {product.price} zł
              </div>

              <div className={styles.zkg}>
                Stan: {product.stock}
              </div>

            </div>

            <div className={styles.najniszaCenaZ30DniPrzedParent}>
              <div className={styles.najniszaCenaZ}>
                Dostępny w magazynie
              </div>
            </div>

            <div className={styles.cenaObowizujeDo10052026Wrapper}>
              <div className={styles.div}>
                Wysyłka w ciągu 24h
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* ILOŚĆ + KOSZYK */}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>

              {/* TWOJA KOMPONENTOWA FUNKCJONALNOŚĆ */}
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

      {/* DÓŁ */}
      <div className={styles.vectorParent}>
        <div className={styles.dividerFull} />

        {/* OPIS */}
        <Accordion
          title="Opis"
          content={
            product.description ||
            "Brak opisu produktu"
          }
        />

        {/* SKŁADNIKI */}
        <Accordion
          title="Składniki"
          content={
            <>
              <p>
                W Zootopii nie mamy nic do ukrycia.
              </p>

              <ul>
                <li>
                  Kategoria:{" "}
                  {product.category?.name || "Brak"}
                </li>

                <li>
                  Stan magazynowy: {product.stock}
                </li>

                <li>
                  ID produktu: {product._id.toString()}
                </li>
              </ul>
            </>
          }
        />

        {/* DODATKOWE INFO */}
        <Accordion
          title="Dodatkowe informacje"
          content={
            <ul>
              <li>
                Dostępność: Produkt dostępny
              </li>

              <li>
                Wysyłka: 24h
              </li>

              <li>
                Cena: {product.price} zł
              </li>
            </ul>
          }
        />

        {/* REVIEWS */}
        <ReviewsSection productId={id} />
      </div>
    </div>
  );
};
