"use client"; // 🔥 Wymagane do obsługi kliknięć i wysyłania danych do bazy (fetch)

import { useState } from "react";
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import Link from 'next/link';

import hearth from "@/app/Public/Images/tabler-icon-heart.svg";

// 1. Aktualizujemy typy danych pod MongoDB
type PromotionItemProps = {
    id: string; // Zmienione na string dla MongoDB ObjectId
    brandName: string;
    productName: string;
    price: number;
    promoPrice?: number | null; // Może przyjść jako liczba, undefined lub null z bazy
    image: string; // URL zdjęcia z bazy danych
}

const PromotionItem = ({
        id, brandName, productName, price, promoPrice, image,
    }: PromotionItemProps) => {
    
    const [isAdding, setIsAdding] = useState(false);

    // Sprawdzamy, czy produkt ma PRAWIDŁOWĄ cenę promocyjną (nie jest null ani undefined)
    const hasValidPromo = promoPrice !== undefined && promoPrice !== null;

    // Funkcja pobierająca token użytkownika do autoryzacji koszyka
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // 🔥 DYNAMICZNE DODAWANIE DO KOSZYKA W BAZIE DANYCH
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Blokuje przejście do Linku karty produktu przy kliknięciu w przycisk
        e.stopPropagation(); // Blokuje propagację eventu w górę

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Musisz się zalogować, aby dodać produkt do koszyka!");
            window.location.href = "/Auth"; 
            return;
        }

        setIsAdding(true);

        try {
            // Strzał do Twojego endpointu API koszyka
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ 
                    productId: id, 
                    quantity: 1 
                })
            });

            if (res.ok) {
                alert(`Dodano do koszyka: ${productName}`);
            } else {
                const data = await res.json();
                alert(`Błąd: ${data.message || "Nie udało się dodać produktu"}`);
            }
        } catch (err) {
            console.error("Błąd sieci koszyka:", err);
            alert("Wystąpił błąd sieciowy podczas dodawania do koszyka.");
        } finally {
            setIsAdding(false);
        }
    };

    // Obsługa ulubionych (serduszko)
    const handleAddToFavorites = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Dodano do ulubionych produkt o ID:", id);
    };

    return (    
        <div className={styles.produktPromocjaPies}>
            {/* Cała karta produktu przenosi teraz do dynamicznej podstrony na podstawie ID z bazy */}
            <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                
                <Image 
                    src={image || "/fallback-image.png"} 
                    className={styles.produktPromocjaPiesChild} 
                    width={240} 
                    height={240} 
                    sizes="100vw" 
                    alt={productName} 
                    unoptimized={true} // Omija blokady domen Next.js dla Vercel Blob
                />
                
                <div className={styles.nazwaMarkiParent}>
                    <b className={styles.nazwaMarki}>{brandName}</b>
                    <button 
                        onClick={handleAddToFavorites}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <Image src={hearth} className={styles.ulubioneIcon} width={21.8} height={21.8} alt="Polub" />
                    </button>
                </div>

                <div className={styles.loremIpsumDolorSitAmetConWrapper}>
                    {/* 🔥 NAPRAWIONE: Wyświetlamy tylko czystą nazwę produktu z bazy danych */}
                    <div className={styles.loremIpsumDolor}>{productName}</div>
                </div>

                <div className={styles.cenaRegularnaParent}>
                    {/* 🔥 DYNAMICZNA CENA: Przekreśla się automatycznie, gdy hasValidPromo jest prawdziwe */}
                    <div className={`${styles.cenaRegularna} ${
                        hasValidPromo ? styles.przekreslona : ""
                    }`}>{price} zł</div>
                    
                    {/* Wyświetlamy cenę promocyjną tylko wtedy, gdy faktycznie istnieje w bazie danych */}
                    {hasValidPromo && <b className={styles.cenaPromocyjna}>{promoPrice} zł</b>}
                </div>

                {/* Aktywny, połączony z bazą przycisk koszyka */}
                <div 
                    className={styles.doKoszykaWrapper} 
                    onClick={handleAddToCart}
                    style={{ 
                        cursor: isAdding ? 'not-allowed' : 'pointer',
                        opacity: isAdding ? 0.6 : 1
                    }}
                >
                    <div className={styles.doKoszyka}>
                        {isAdding ? "Dodawanie..." : "Do koszyka"}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PromotionItem;