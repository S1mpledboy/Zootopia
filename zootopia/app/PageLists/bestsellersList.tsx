'use client';

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '@/app/modulesCSS/promotionList.module.css';

import PromotionItem from '../ItemBlocks/promotionItem';

interface Product {
  id: string;
  brandName: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

const Kategorie: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        
        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status}`);
        }
        
        const data: Product[] = await response.json();
        
        // Sortowanie po najniższej ilości
        const sorted = [...data].sort((a, b) => a.quantity - b.quantity);
        setProducts(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nieznany błąd');
        console.error('Błąd:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className={styles.kategorie}>Ładowanie produktów...</div>;
  if (error) return <div className={styles.kategorie}>Błąd: {error}</div>;
  if (products.length === 0) return <div className={styles.kategorie}>Brak produktów</div>;

  return (
    <div className={styles.kategorie}>
      {products.map((item) => (
        <PromotionItem
          key={item.id}
          id={item.id}
          brandName={item.brandName}
          productName={item.productName}
          price={item.price}
          image={item.image}
        />
      ))}
    </div>
  );
};

export default Kategorie;
