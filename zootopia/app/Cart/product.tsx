import React from 'react';
import Image from "next/image";
import styles from './product.module.css';

import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import trashicon from "@/app/Public/Images/bin.svg";

interface CartItemProps {
  id: string;        
  name: string;
  price: number;
  promoPrice?: number | null; // 🔥 DODANE DO TYPÓW
  companyName: string;
  images: any;       
  quantity: number;
  onCartChanged: () => void; 
}

const Property1Koszyk: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  promoPrice, // 🔥 ODBIERAMY PROMO CENE
  companyName,
  images,
  quantity,
  onCartChanged
}) => {
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleIncrease = async () => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: id, action: 'increase' })
    });
    if (res.ok) onCartChanged(); 
  };

  const handleDecrease = async () => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: id, action: 'decrease' })
    });
    if (res.ok) onCartChanged();
  };

  const handleRemove = async () => {
    const res = await fetch(`/api/cart?productId=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) onCartChanged();
  };

  const handleAddToFavorites = () => {};

  // 🔥 LOGIKA WYŚWIETLANIA CENY PROMOCYJNEJ
  const hasValidPromo = promoPrice !== undefined && promoPrice !== null;
  const displayPrice = hasValidPromo ? promoPrice : price;

  const formattedRegularPrice = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);
  const formattedPromoPrice = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(promoPrice));

  let mainImage = "/fallback-image.png";
  if (images && images.length > 0) {
    const innerArray = images[0];
    if (Array.isArray(innerArray) && innerArray.length > 0) {
      mainImage = innerArray[0];
    } else if (typeof innerArray === 'string') {
      mainImage = innerArray;
    }
  }

  return (
    <div className={styles.property1koszyk}>
      <Image className={styles.imgProduktuIcon} src={mainImage} width={100} height={100} alt={name} unoptimized={true} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.frameWrapper}>
            <div className={styles.krainaNoteciParent}>
              <b className={styles.krainaNoteci}>{companyName.toUpperCase()}</b>
              <div className={styles.karmaLoremIpsum}>{name}</div>
            </div>
          </div>
          
          {/* 🔥 POPRAWIONA SEKCJA CENY W KOSZYKU */}
          <div className={styles.zWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <div className={`${styles.z} ${hasValidPromo ? styles.przekreslona : ""}`} style={{ fontSize: hasValidPromo ? '14px' : 'inherit' }}>
              {formattedRegularPrice}
            </div>
            {hasValidPromo && (
              <b className={styles.cenaPromocyjna} style={{ color: '#d2465e', fontSize: '18px' }}>
                {formattedPromoPrice}
              </b>
            )}
          </div>

        </div>
        <div className={styles.frameContainer}>
          <div className={styles.parent}>
            <div className={styles.div} onClick={handleDecrease} style={{ cursor: 'pointer', userSelect: 'none' }}>-</div>
            <div className={styles.wrapper}><div className={styles.div2}>{quantity}</div></div>
            <div className={styles.div3} onClick={handleIncrease} style={{ cursor: 'pointer', userSelect: 'none' }}>+</div>
          </div>
          <div className={styles.ulubioneParent}>
            <button onClick={handleAddToFavorites} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Image className={styles.ulubioneIcon} src={hearticon} width={24} height={24} alt="Polub" />
            </button>
            <button onClick={handleRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Image className={styles.ulubioneIcon} src={trashicon} width={24} height={24} alt="Usuń" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property1Koszyk;