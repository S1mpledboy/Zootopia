"use client";
import type { NextPage } from 'next';
import Image from "next/image";
import styles from './product.module.css';
import { ProductProps } from './types';
import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";

const ProductDetails: NextPage<ProductProps> = (product) => {
  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>
        {/* LEWA KOLUMNA: GALERIA */}
        <div className={styles.produktKaruzela}>
          <Image 
            className={styles.produktKaruzelaChild} 
            src={product.mainImage} 
            width={500} height={500} alt={product.fullName} 
          />
          <div className={styles.frameParent}>
            {product.gallery.map((img, idx) => (
              <Image 
                key={idx} 
                className={styles.frameChild} 
                src={img} width={100} height={100} alt={`Galeria ${idx}`} 
              />
            ))}
          </div>
        </div>

        {/* PRAWA KOLUMNA: NAGŁÓWEK I CENA */}
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.alphawolfParent}>
              <div className={styles.alphawolf}>{product.brand}</div>
              {/* Zakładam, że masz te ikony w public/images/ */}
              <Image 
                src={heartIcon} 
                 alt="Ulubione" 
                width={40}  // Dodaj to
                height={40} // Dodaj to
                />
            </div>
            <div style={{ borderBottom: '1px solid #eee', width: '100%' }} />
          </div>

          <div className={styles.alphawolf400gBezzboowaMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzboowa}>{product.fullName}</h1>
          </div>

          <div className={styles.frameDiv}>
            <div className={styles.tablerIconStarParent}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < product.rating ? '#FFD700' : '#CCC' }}>★</span>
              ))}
            </div>
            <div className={styles.div}>({product.reviewsCount})</div>
          </div>

          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>
              <div className={styles.z}>{product.price.toFixed(2)} zł</div>
              <div className={styles.zkg}>({product.pricePerKg})</div>
            </div>
            {product.oldPrice && (
              <div className={styles.najniszaCenaZ30DniPrzedParent}>
                <div className={styles.najniszaCenaZ}>Najniższa cena z 30 dni: {product.oldPrice.toFixed(2)} zł</div>
              </div>
            )}
          </div>

          {/* ILOŚĆ I KOSZYK */}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>
              <div className={styles.opcjaSortowaniaParent}>
                <button className={styles.tablerIconPlusWrapper}>-</button>
                <div className={styles.wrapper}>1</div>
                <button className={styles.tablerIconPlusWrapper}>+</button>
              </div>
              <button className={styles.dodajDoKoszykaWrapper}>
                <span className={styles.dodajDoKoszyka}>Dodaj do koszyka</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOLNA SEKCJA: SZCZEGÓŁY */}
      <div className={styles.vectorParent}>
        <div className={styles.produktInformacje}>
          <h3>Opis produktu</h3>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        <div className={styles.produktInformacje}>
          <h3>Składniki</h3>
          <p>{product.ingredients.intro}</p>
          <ul>
            {product.ingredients.list.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* OPINIE */}
        <div className={styles.produktOpinie}>
          <h3>Opinie klientów ({product.reviewsCount})</h3>
          {product.reviews.map((rev, i) => (
            <div key={i} className={styles.produktOpinieChild} style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
              <strong>{rev.author}</strong> — <span>{rev.rating}/5</span>
              <p>{rev.comment}</p>
              <small>{rev.date}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;