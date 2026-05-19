'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import styles from './Reviews.module.css';

import starFull from "@/app/Public/Images/tabler-icon-star.svg";
import starHalf from "@/app/Public/Images/star-half.svg";
import starEmpty from "@/app/Public/Images/empty-star.svg";
import chevronIcon from "@/app/Public/Images/tabler-icon-chevron.svg";
import lineImg from "@/app/Public/Images/Vector 3.svg";

type Review = {
  _id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

const renderStars = (rating: number, className: string) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let currentIcon = starFull;
    if (i > rating) {
      currentIcon = i - rating <= 0.5 ? starHalf : starEmpty;
    }
    stars.push(
      <Image
        key={i}
        className={className}
        src={currentIcon}
        alt="star"
      />
    );
  }
  return stars;
};

const ReviewItem = ({ review }: { review: Review }) => (
  <>
    <div className={styles.property1opinieZwiniteChild}>
      <div className={styles.frameParent9}>
        <div className={styles.kasiaIRikoWrapper}>
          <div className={styles.kasiaIRiko}>
            {review.user?.firstName || "Użytkownik"} {review.user?.lastName || ""}
          </div>
        </div>

        <div className={styles.frameParent10}>
          <div className={styles.frameParent11}>
            <div className={styles.frameParent12}>
              <div className={styles.tablerIconStarParent}>
                {renderStars(review.rating, styles.tablerIconStar)}
              </div>
              <div className={styles.div}>
                {review.rating}/5
              </div>
            </div>
            <div className={styles.wrapper10}>
              <div className={styles.div}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className={styles.mjCockerSpaniel}>
            {review.text}
          </div>
        </div>
      </div>
    </div>
    <Image className={styles.property1opinieZwiniteItem} src={lineImg} alt="" />
  </>
);

// 🔥 PRZYJMUJEMY INITIAL REVIEWS Z SERWERA
export default function Reviews({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewsData, setReviewsData] = useState<Review[]>(initialReviews);

  // FORMULARZ
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviewsData(data);
  };

  // Synchronizacja stanu, jeśli ID produktu ulegnie zmianie
  useEffect(() => {
    setReviewsData(initialReviews);
  }, [productId, initialReviews]);

  const stats = useMemo(() => {
    const total = reviewsData.length;
    const avg = total > 0 ? reviewsData.reduce((acc, r) => acc + r.rating, 0) / total : 0;

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((r) => {
      const key = Math.floor(r.rating);
      if (counts[key] !== undefined) counts[key]++;
    });

    const bars = [5, 4, 3, 2, 1].map((n) => {
      const p = total ? Math.round((counts[n] / total) * 100) : 0;
      return { label: n.toString(), val: `${p}%`, w: p * 2 };
    });

    return {
      average: Number(avg.toFixed(1)),
      total,
      bars,
    };
  }, [reviewsData]);

  const submitReview = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, rating, text }),
    });

    setLoading(false);
    if (res.ok) {
      setText("");
      setRating(5);
      fetchReviews(); // Pobieramy najnowsze opinie po dodaniu nowej
    }
  };

  return (
    <div className={`${styles.mainContainer} ${!isOpen ? styles.property1opinieZwinite : styles.property1opinieRozwinite}`}>

      {/* HEADER */}
      <div className={styles.frameParent} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <div className={styles.opinieParent}>
          <div className={styles.opinie}>Opinie</div>
          <div className={`${styles.frameGroup} ${isOpen ? styles.hidden : ''}`}>
            <div className={styles.tablerIconStarParent}>
              {renderStars(stats.average, styles.tablerIconStar)}
            </div>
              <div className={styles.div}>({stats.total})</div>
          </div>
        </div>
        <Image
          className={`${styles.tablerIconChevronCompactRi} ${isOpen ? styles.rotate : ''}`}
          src={chevronIcon}
          alt="rozwiń"
        />
      </div>

      {/* STATS */}
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
              {styles.bars ? stats.bars.map((row) => (
                <div key={row.label} className={styles.frameParent4}>
                  <div className={styles.container}>
                    <div className={styles.div3}>{row.label}</div>
                  </div>
                  <div className={styles.rectangleParent}>
                    <div className={styles.frameChild} />
                    {row.w > 0 && <div className={styles.frameItem} style={{ width: row.w }} />}
                  </div>
                  <div className={styles.frame}>
                    <div className={styles.div3}>{row.val}</div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
        </div>
      </div>

      {/* FORMULARZ DODAWANIA */}
      {isOpen && (
        <div style={{ padding: "12px 16px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Napisz opinię..."
            style={{ width: "100%", minHeight: "70px", borderRadius: "8px", padding: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map((n) => (
                <option key={n} value={n}>{n} ⭐</option>
              ))}
            </select>
            <button onClick={submitReview} disabled={loading}>
              {loading ? "Wysyłanie..." : "Dodaj opinię"}
            </button>
          </div>
        </div>
      )}

      {/* LISTA OPINII */}
      {reviewsData.map((review) => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </div>
  );
}