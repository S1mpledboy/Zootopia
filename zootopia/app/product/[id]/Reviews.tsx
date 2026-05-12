'use client';

import { useState, useMemo } from 'react';
import Image from "next/image";
import styles from './Reviews.module.css';

// --- IMPORTY STATYCZNE ---
import starFull from "@/app/Public/Images/tabler-icon-star.svg";
import starHalf from "@/app/Public/Images/star-half.svg";
import starEmpty from "@/app/Public/Images/empty-star.svg";
import chevronIcon from "@/app/Public/Images/tabler-icon-chevron.svg";
import lineImg from "@/app/Public/Images/Vector 3.svg";

// Przykładowe dane z połówkami
const reviewsData = [
  { name: "Kasia i Riko", date: "21.04.2026", rating: 5, text: "Mój cocker spaniel jest bardzo wybredny..." },
  { name: "Ania_Z", date: "18.04.2026", rating: 4.5, text: "Bardzo dobra karma, ale puszka mogłaby się łatwiej otwierać." },
  { name: "Piotr_W-wa", date: "13.04.2026", rating: 5, text: "Szukałem karmy z glukozaminą..." },
  { name: "DogMom88", date: "13.04.2026", rating: 3.5, text: "Karma ok, ale mojemu psu średnio smakuje." },
];

interface ReviewsProps {
  productId: number;
}

// FUNKCJA POMOCNICZA DO GWIAZDEK
const renderStars = (rating: number, className: string) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let currentIcon = starFull;
    
    if (i > rating) {
      currentIcon = (i - rating <= 0.5) ? starHalf : starEmpty;
    }

    stars.push(
      <Image 
        key={i} 
        className={className} 
        src={currentIcon} 
        alt={`gwiazdka ${i}`} 
      />
    );
  }
  return stars;
};

const ReviewItem = ({ name, date, rating, text }: any) => (
  <>
    <div className={styles.property1opinieZwiniteChild}>
      <div className={styles.frameParent9}>
        <div className={styles.kasiaIRikoWrapper}>
          <div className={styles.kasiaIRiko}>{name}</div>
        </div>
        <div className={styles.frameParent10}>
          <div className={styles.frameParent11}>
            <div className={styles.frameParent12}>
              <div className={styles.tablerIconStarParent}>
                {renderStars(rating, styles.tablerIconStar)}
              </div>
              <div className={styles.div}>{rating}/5</div>
            </div>
            <div className={styles.wrapper10}>
              <div className={styles.div}>{date}</div>
            </div>
          </div>
          <div className={styles.mjCockerSpaniel}>{text}</div>
        </div>
      </div>
    </div>
    <Image className={styles.property1opinieZwiniteItem} src={lineImg} alt="" />
  </>
);

const Reviews = ({ productId }: ReviewsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = useMemo(() => {
    const total = reviewsData.length;
    const avg = total > 0 
      ? (reviewsData.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
      : "0.0";
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(r => counts[Math.floor(r.rating) as keyof typeof counts]++);

    const bars = [5, 4, 3, 2, 1].map(n => {
      const p = total > 0 ? Math.round((counts[n as keyof typeof counts] / total) * 100) : 0;
      return { label: n.toString(), val: `${p}%`, w: p * 2 };
    });

    return { average: parseFloat(avg), total, bars };
  }, []);

  return (
    <div className={`${styles.mainContainer} ${!isOpen ? styles.property1opinieZwinite : styles.property1opinieRozwinite}`}>
      
      {/* NAGŁÓWEK */}
      <div className={styles.frameParent} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <div className={styles.opinieParent}>
          <div className={styles.opinie}>Opinie (ID: {productId})</div>
          <div className={`${styles.frameGroup} ${isOpen ? styles.hidden : ''}`}>
            <div className={styles.tablerIconStarParent}>
              {renderStars(stats.average, styles.tablerIconStar)}
            </div>
            <div className={styles.div}>({stats.total})</div>
          </div>
        </div>
        <Image 
          className={`${styles.tablerIconChevronCompactRi} ${isOpen ? styles.rotate : ''}`} 
          src={chevronIcon} alt="rozwiń" 
        />
      </div>

      {/* ŚRODEK */}
      <div className={styles.property1opinieZwiniteInner}>
        <div className={styles.frameContainer}>
          <div className={styles.frameDiv}>
            <div className={styles.tablerIconStarGroup}>
              {renderStars(stats.average, styles.tablerIconStar6)}
            </div>
            <div className={styles.wrapper}>
              <div className={styles.div2}>{stats.average}/5</div>
            </div>
            <div className={styles.frameParent2}>
              <div className={styles.naPodstawieParent}>
                <div className={styles.naPodstawie}>na podstawie</div>
                <b className={styles.naPodstawie}>{stats.total} opinii</b>
              </div>
            </div>
          </div>

          <div className={styles.frameWrapper}>
            <div className={styles.frameParent3}>
              {stats.bars.map((row) => (
                <div key={row.label} className={styles.frameParent4}>
                  <div className={styles.container}><div className={styles.div3}>{row.label}</div></div>
                  <div className={styles.rectangleParent}>
                    <div className={styles.frameChild} />
                    {row.w > 0 && <div className={styles.frameItem} style={{ width: row.w }} />}
                  </div>
                  <div className={styles.frame}><div className={styles.div3}>{row.val}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LISTA */}
      {reviewsData.map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}
    </div>
  );
};

export default Reviews;