// Ścieżka: app/Product/HeartButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Importy obu ikon
import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg"; // Puste serce
import FavoriteIcon from "@/app/Public/Images/Vector.svg";      // Pokolorowane serce
import styles from "./product.module.css";

interface HeartButtonProps {
  productId: string;
}

export default function HeartButton({ productId }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 🔄 Po załadowaniu strony sprawdź, czy produkt jest już w ulubionych
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Jeśli niezalogowany, domyślnie puste serce

    fetch("/api/likedList", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((likedProducts: any[]) => {
        // Sprawdź, czy ID tego produktu znajduje się w tablicy ulubionych
        const found = likedProducts.some((item) => item.id === productId);
        setIsLiked(found);
      })
      .catch((err) => console.error("Błąd sprawdzania statusu polubienia:", err));
  }, [productId]);

  // 👆 Obsługa kliknięcia (Dodawanie / Usuwanie)
  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Auth");
      return;
    }

    if (loading) return;
    setLoading(true);

    // Decydujemy o metodzie: jeśli już lubi, to usuwamy (DELETE), jeśli nie, to dodajemy (POST)
    // Uwaga: Możesz użyć POST do obu akcji i obsłużyć to w API (toggle)
    try {
      const res = await fetch("/api/likedList", {
        method: "POST", // Wysyłamy POST do naszego API, które przełącza stan
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        // Zmień stan wizualny na przeciwny po udanej odpowiedzi z serwera
        setIsLiked(!isLiked);
      } else {
        const data = await res.json();
        alert(data.error || "Coś poszło nie tak.");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Image
      // Jeśli produkt jest polubiony, opcjonalnie możesz też dodać klasę aktywnego serca dla stylów CSS
      className={`${styles.ulubioneIcon} ${isLiked ? styles.ulubioneIconActive : ""}`}
      // Dynamiczna zmiana ikony w zależności od stanu isLiked
      src={isLiked ? FavoriteIcon : heartIcon}
      alt="Ulubione"
      onClick={handleFavoriteClick}
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      width={36}
      height={36}
    />
  );
}