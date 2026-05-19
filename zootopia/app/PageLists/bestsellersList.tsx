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
  // ✅ Zabezpieczenie adresu URL dla środowiska serwerowego i lokalnego
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/products`;
  
  console.log('🌐 Fetching z adresu:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error w komponencie:', response.status, response.statusText);
      return [];
    }
    
    const products = await response.json();
    console.log('📦 Surowe dane z API w komponencie:', products);
    
    if (!Array.isArray(products) || products.length === 0) {
      console.warn('⚠️ API nie zwróciło tablicy lub tablica jest pusta.');
      return [];
    }

    // ✅ Mapowanie dopasowane do struktury z Twojego route.ts i MongoDB
    const formattedProducts = products.map((item: any) => {
      // Obsługa zdjęcia: jeśli w API przekazałeś obiekt 'image' jako string, bierzemy go. 
      // Jeśli to surowy obiekt z Mongo, szukamy w tablicy 'images'
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

    // ✅ Sortowanie od najniższego stanu (na wypadek gdyby API nie posortowało)
    const sorted = formattedProducts.sort((a, b) => a.quantity - b.quantity);

    // ✅ Wycinamy dokładnie 3 produkty z najniższym stanem
    const limited = sorted.slice(0, 3);
    console.log('✅ Sukces! Wybrane 3 produkty:', limited);
    
    return limited;

  } catch (error) {
    // Sprawdź konsolę (terminal), tu pojawi się dokładny powód błędu
    console.error('❌ Krytyczny błąd w funkcji getProductsSortedByLowestQuantity:', error);
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