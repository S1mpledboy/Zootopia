import type { NextPage } from 'next';
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
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return [];
    }
    
    const jsonData = await response.json();
    
    // API zwraca bezpośrednio tablicę sformatowanych obiektów
    const products = Array.isArray(jsonData) ? jsonData : [];
    
    if (products.length === 0) {
      return [];
    }
    
    // API sortuje już po `stock: 1`, więc obiekty przychodzą od najmniejszej ilości.
    // Wystarczy wyciąć pierwsze 3 elementy za pomocą .slice(0, 3)
    const limitedProducts = products.slice(0, 3);
    
    console.log('🔽 Wybrano 3 produkty o najniższym stanie:', limitedProducts);
    return limitedProducts;
  } catch (error) {
    console.error('❌ Błąd pobierania produktów:', error);
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
          ⚠️ Brak produktów na stanie
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