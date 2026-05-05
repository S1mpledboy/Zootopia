'use client';

import Image from "next/image";
import styles from './product.module.css';
import Accordion from './productInfo';
import ReviewsSection from './Reviews';
import Carousel from './photoCarousel';

// --- IMPORTY STATYCZNE IKON ---
// Zakładam, że Twoje ikony są w folderze public. 
// W plikach wewnątrz folderu 'app/productPage' używamy '../../public/...'
import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import starIcon from "@/app/Public/Images/tabler-icon-star.svg";
import plusIcon from "@/app/Public/Images/tabler-icon-plus.png";
import minusIcon from "@/app/Public/Images/tabler-icon-minus.png";

const ProductPage = () => {
  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>
        
        {/* LEWA KOLUMNA: Karuzela zdjęć */}
        <div className={styles.produktKaruzela}>
          <Carousel />
        </div>

        {/* PRAWA KOLUMNA: Informacje o zakupie */}
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.alphawolfParent}>
              <div className={styles.alphawolf}>ALPHAWOLF</div>
              {/* Użycie zaimportowanej ikony serca */}
              <Image className={styles.ulubioneIcon} src={heartIcon} alt="Ulubione" />
            </div>
            <div className={styles.divider} />
          </div>

          <div className={styles.alphawolf400gBezzboowaMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzboowa}>
              AlphaWolf 400g Bezzbożowa Mokra Karma Dla Szczeniąt Rasy Średniej Delikatny Mus Z Jagnięciną Batatami I Glukozaminą
            </h1>
          </div>
          
          <div className={styles.divider} />

          <div className={styles.frameDiv}>
            <div className={styles.tablerIconStarParent}>
              {[...Array(5)].map((_, i) => (
                <Image key={i} className={styles.tablerIconStar} src={starIcon} alt="star" />
              ))}
            </div>
            <div className={styles.div}>(76)</div>
          </div>

          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent}>
              <div className={styles.z}>28,50 zł</div>
              <div className={styles.zkg}>(71,25 zł/kg)</div>
            </div>
            <div className={styles.najniszaCenaZ30DniPrzedParent}>
              <div className={styles.najniszaCenaZ}>Najniższa cena z 30 dni przed obniżką: 34,90 zł</div>
            </div>
            <div className={styles.cenaObowizujeDo10052026Wrapper}>
              <div className={styles.div}>Cena obowiązuje do 10.05.2026 lub do wyczerpania zapasów.</div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Koszyk i ilość */}
          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>
              <div className={styles.opcjaSortowaniaParent}>
                <div className={styles.tablerIconPlusWrapper}>
                  {/* Użycie zaimportowanej ikony minus */}
                  <Image src={minusIcon} alt="minus" />
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.dodajDoKoszyka}>1</div>
                </div>
                <div className={styles.tablerIconPlusWrapper}>
                  {/* Użycie zaimportowanej ikony plus */}
                  <Image src={plusIcon} alt="plus" />
                </div>
              </div>
              <button className={styles.dodajDoKoszykaWrapper}>
                <div className={styles.dodajDoKoszyka}>Dodaj do koszyka</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEKCJA DOLNA: Informacje rozwijane (Accordions) */}
      <div className={styles.vectorParent}>
        <div className={styles.dividerFull} />
        
        <Accordion 
          title="Opis" 
          content="Pierwsze miesiące życia to kluczowy czas dla rozwoju Twojego psa. AlphaWolf Puppy Mus to coś więcej niż karma – to paliwo dla rosnącego organizmu..." 
        />

        <Accordion 
          title="Składniki" 
          content={
            <>
              <p>W Zootopii nie mamy nic do ukrycia. Skład AlphaWolf jest krótki i przejrzysty.</p>
              <ul>
                <li>Jagnięcina 65% (mięso mięśniowe, serca, płuca), wywar z jagnięciny 26%, bataty 7%</li>
                <li>Białko surowe 10,8%, tłuszcz surowy 6,5%</li>
                <li>Dodatki: Witamina D3 200 j.m., cynk 25 mg</li>
              </ul>
            </>
          } 
        />

        <Accordion 
          title="Dodatkowe informacje" 
          content={
            <ul>
              <li>Dla kogo: Szczenięta rasy średniej (11-25 kg)</li>
              <li>Przechowywanie: W lodówce do 24h po otwarciu</li>
              <li>Dawkowanie: Szczeniak 2-4 miesiące: ok. 400-600g dziennie</li>
            </ul>
          } 
        />

        <ReviewsSection />
      </div>
    </div>
  );
};

export default ProductPage;