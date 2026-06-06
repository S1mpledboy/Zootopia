"use client";

import { useState } from "react";
import styles from "./product.module.css";

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz się zalogować, aby dodać produkt do koszyka!");
      window.location.href = "/Auth"; 
      return;
    }

    setIsAdding(true);

    try {

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (res.ok) {
        alert("Dodano produkt do koszyka!");
      } else {
        const data = await res.json();
        alert(`Błąd: ${data.message || "Nie udało się dodać produktu"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd sieci podczas dodawania do koszyka.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.frameParent3}>
      <div className={styles.quantitySelectorContainer} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={handleDecrease} style={{ cursor: 'pointer', padding: '5px 10px' }}>-</button>
        <span>{quantity}</span>
        <button onClick={handleIncrease} style={{ cursor: 'pointer', padding: '5px 10px' }}>+</button>
      </div>

      <button 
        className={styles.dodajDoKoszykaWrapper} 
        onClick={handleAddToCart}
        disabled={isAdding}
        style={{ cursor: isAdding ? 'not-allowed' : 'pointer' }}
      >
        <div className={styles.dodajDoKoszyka}>
          {isAdding ? "Dodawanie..." : "Dodaj do koszyka"}
        </div>
      </button>
    </div>
  );
}