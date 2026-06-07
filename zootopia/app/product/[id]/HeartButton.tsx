
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Importy obu ikon
import heartIcon from "@/app/Public/Images/tabler-icon-heart.svg";
import FavoriteIcon from "@/app/Public/Images/Vector.svg";    
import styles from "./product.module.css";

interface HeartButtonProps {
  productId: string;
}

export default function HeartButton({ productId }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; 

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

        const found = likedProducts.some((item) => item.id === productId);
        setIsLiked(found);
      })
      .catch((err) => console.error("Błąd sprawdzania statusu polubienia:", err));
  }, [productId]);


  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("token");

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

      className={`${styles.ulubioneIcon} ${isLiked ? styles.ulubioneIconActive : ""}`}

      src={isLiked ? FavoriteIcon : heartIcon}
      alt="Ulubione"
      onClick={handleFavoriteClick}
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      width={36}
      height={36}
    />
  );
}