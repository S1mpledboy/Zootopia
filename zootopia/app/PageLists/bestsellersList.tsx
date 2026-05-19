import type { NextPage } from 'next';
import styles from '@/app/modulesCSS/promotionList.module.css';
import PromotionItem from '../ItemBlocks/promotionItem';

// ✅ TA LINIA JEST KLUCZOWA DLA VERCELA:
// Wymusza renderowanie dynamiczne przy każdym wejściu na stronę i wyłącza cache static-site
export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  brandName: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

async function getProductsSortedByLowestQuantity(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/products`;
  
  try {
    // Używamy cache: 'no-store' w połączeniu z force-dynamic
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store', 
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error w getProductsSortedByLowestQuantity:', response.status);
      return [];
    }
    
    const jsonData = await response.json();
    const products = Array.isArray(jsonData) ? jsonData : [];
    
    if (products.length === 0) {
      return [];
    }

    // Bezpieczne mapowanie danych (na wypadek surowego Mongo lub przetworzonego API)
    const formattedProducts = products.map((item: any) => {
      let finalImage = '/placeholder.png';
      if (typeof item.image === 'string' && item.image) {
        finalImage = item.image;
      } else if (Array.isArray(item.images) && item.images.length > 0) {
        finalImage = item.images[0];
      }

      return {
        id: String(item.id || item._id),
        brandName: item.brandName || "Unknown Brand",
        productName: item.productName || item.name || "Bez nazwy",
        price: Number(item.price || 0),
        image: finalImage,
        quantity: Number(item.quantity !== undefined ? item.quantity : (item.stock || 0))
      };
    });

    // Sortujemy od najniższego stanu magazynowego i bierzemy 3 sztuki
    return formattedProducts
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 3);

  } catch (error) {
    console.error('❌ Krytyczny błąd pobierania produktów:', error);
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