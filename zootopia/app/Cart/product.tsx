import React from 'react';
import Image from "next/image";
import styles from './product.module.css';

import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import trashicon from "@/app/Public/Images/bin.svg";

interface CartItemProps {
  id: string;        // ID produktu
  name: string;
  price: number;
  companyName: string;
  images: string[];
  quantity: number;
  onCartChanged: () => void; // 🔥 JEDYNA funkcja z góry - informuje rodzica, że trzeba odświeżyć koszyk
}

const Property1Koszyk: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  companyName,
  images,
  quantity,
  onCartChanged
}) => {
  
  // Helper do nagłówków z tokenem
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 🔥 Logika Plusa przeniesiona tutaj
  const handleIncrease = async () => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: id, action: 'increase' })
    });
    if (res.ok) onCartChanged(); // Mówimy rodzicowi: "Ej, odśwież dane!"
  };

  // 🔥 Logika Minusa przeniesiona tutaj
  const handleDecrease = async () => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: id, action: 'decrease' })
    });
    if (res.ok) onCartChanged();
  };

  // 🔥 Logika Usuwania przeniesiona tutaj
  const handleRemove = async () => {
    const res = await fetch(`/api/cart?productId=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) onCartChanged();
  };

  const handleAddToFavorites = () => {
    console.log("Ulubione:", id);
  };

  const formattedPrice = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);
  const mainImage = images && images.length > 0 ? images[0] : "/fallback-image.png";

  return (
    <div className={styles.property1koszyk}>
      <Image className={styles.imgProduktuIcon} src={mainImage} width={100} height={100} alt={name} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.frameWrapper}>
            <div className={styles.krainaNoteciParent}>
              <b className={styles.krainaNoteci}>{companyName.toUpperCase()}</b>
              <div className={styles.karmaLoremIpsum}>{name}</div>
            </div>
          </div>
          <div className={styles.zWrapper}><div className={styles.z}>{formattedPrice}</div></div>
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