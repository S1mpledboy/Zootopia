
import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import categoryNameStyle from '@/app/modulesCSS/categoryName.module.css';

import PromotionItem from '../ItemBlocks/promotionItem';

interface Product {
  id: string;  // Zmień na string
  brandName: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

async function getProductsSortedByLowestQuantity(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Błąd pobierania produktów');
    }
    
    const products = await response.json();
    
    // Konwertuj id na string przy pobieraniu
    const productsWithStringId = products.map((item: any) => ({
      ...item,
      id: String(item.id),  // Konwertuj liczebę na string
    }));
    
    return productsWithStringId.sort(((a: Product, b: Product) => a.quantity - b.quantity));
  } catch (error) {
    console.error('Błąd:', error);
    return [];
  }
}

const Kategorie: NextPage = async () => {
  const products = await getProductsSortedByLowestQuantity();
  
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
