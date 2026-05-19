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
  // Automatyczne dopasowanie adresu URL dla serwera i środowiska lokalnego
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/products`;
  
  try {
    // cache: 'no-store' wymusza pobranie świeżych danych z bazy przy każdym żądaniu
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store', 
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error w getProductsSortedByLowestQuantity:', response.status);
      return [];
    }
    
    const jsonData = await response.json();
    
    // Sprawdzenie czy otrzymaliśmy poprawną tablicę danych
    const products = Array.isArray(jsonData) ? jsonData : [];
    
    if (products.length === 0) {
      return [];
    }

    // Mapowanie odporne na format danych (zadziała dla wersji z API oraz surowej z Mongo)
    const formattedProducts = products.map((item: any) => {
      // Wyciąganie zdjęcia z pola 'image' (string) lub pierwszej pozycji z tablicy 'images'
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

    // Sortowanie lokalne od najniższego stanu magazynowego na wypadek, gdyby inne skrypty zmieniały sortowanie w API
    const sorted = formattedProducts.sort((a, b) => a.quantity - b.quantity);

    // Wybór dokładnie 3 produktów o najniższym stanie
    return sorted.slice(0, 3);

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