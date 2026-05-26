"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LikedItem from "./likedItem"; // Zmieniono nazwę na bardziej intuicyjną
import styles from './liked.module.css';

interface TransformedProduct {
    id: string;
    productName: string;
    brandName: string;
    price: number;
    image: string;
}

const UlubionePage: NextPage = () => {
  const [likedProducts, setLikedProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/Auth');
      return;
    }

    fetch('/api/likedList', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error('Błąd pobierania danych');
      return res.json();
    })
    .then((data) => {
      setLikedProducts(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      router.push('/Auth');
    });
  }, [router]);

  // 🧮 Dynamiczne obliczanie sumy cen produktów
  const totalPrice = likedProducts.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Ładowanie ulubionych...</div></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Polubione produkty</h1>

      <div className={styles.listWrapper}>
        <div className={styles.list}>
          {likedProducts.length === 0 ? (
            <div className={styles.empty}>Twoja lista ulubionych produktów jest pusta.</div>
          ) : (
            // ✅ Renderujemy komponent pojedynczego produktu w pętli
            likedProducts.map((product) => (
              <LikedItem key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {likedProducts.length > 0 && (
        <div className={styles.summary}>
          <span>Razem:</span>
          <span>{totalPrice.toFixed(2).replace('.', ',')} zł</span>
        </div>
      )}

      <Link href="/" className={styles.backButton}>
        <span className={styles.arrow}>‹</span>
        <span className={styles.backButtonText}>Kontynuuj zakupy</span>
      </Link>
    </div>
  );
};

export default UlubionePage;