import type { NextPage } from 'next';
import Image from "next/image";
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

async function getProductsSortedByLowestQuantity(): Promise<Product[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
  console.log('🌐 URL endpointu:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return [];
    }
    
    const products = await response.json();
    console.log('✅ Pobrano:', products.length, 'produktów');
    
    if (!Array.isArray(products)) {
      console.error('❌ Odpowiedź nie jest tablicą:', products);
      return [];
    }
    
    const productsWithStringId = products.map((item: any) => ({
      ...item,
      id: String(item.id),
    }));
    
    const sorted = productsWithStringId.sort((a: Product, b: Product) => a.quantity - b.quantity);
    console.log('🔽 Posortowano:', sorted.length, 'produktów');
    
    return sorted;
  } catch (error) {
    console.error('❌ Błąd:', error);
    return [];
  }
}

const Kategorie: NextPage = async () => {
  const products = await getProductsSortedByLowestQuantity();
  
  return (
    <div className={styles.kategorie}>
      {products.length === 0 ? (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#999',
          fontSize: '16px'
        }}>
          ⚠️ Brak produktów
        </div>
      ) : (
        products.map((item) => (
          <PromotionItem
            key={item.id}
            id={item.id}
            brandName={item.brandName}
            productName={item.productName}
            price={item.price}
            image={item.image}
          />
        ))
      )}
    </div>
  );
};

export default Kategorie;