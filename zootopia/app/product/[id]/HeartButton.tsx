// Komponent: HeartButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import styles from "./product.module.css";

interface HeartButtonProps {
  productId: string;
}

export default function HeartButton({ productId }: HeartButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("token");

    // Jeśli brak tokenu -> przekieruj do logowania
    if (!token) {
      router.push("/Auth");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/likedList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        alert("Dodano produkt do ulubionych!");
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
      className={`${styles.ulubioneIcon} ${loading ? styles.disabled : ""}`}
      src={heartIcon}
      alt="Ulubione"
      onClick={handleFavoriteClick}
      style={{ cursor: "pointer", opacity: loading ? 0.5 : 1 }}
    />
  );
}