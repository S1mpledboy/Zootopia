"use client"; 

import { useState } from "react";
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import Link from 'next/link';

import hearth from "@/app/Public/Images/tabler-icon-heart.svg";


type PromotionItemProps = {
    id: string; 
    brandName: string;
    productName: string;
    price: number;
    promoPrice?: number | null;
    image: string; 
}

const PromotionItem = ({
        id, brandName, productName, price, promoPrice, image,
    }: PromotionItemProps) => {
    
    const [isAdding, setIsAdding] = useState(false);

    
    const hasValidPromo = promoPrice !== undefined && promoPrice !== null;

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

   
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Musisz się zalogować, aby dodać produkt do koszyka!");
            window.location.href = "/Auth"; 
            return;
        }

        setIsAdding(true);

        try {

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

   
    const handleAddToFavorites = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Dodano do ulubionych produkt o ID:", id);
    };

    return (    
        <div className={styles.produktPromocjaPies}>

            <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                
                <Image 
                    src={image || "/fallback-image.png"} 
                    className={styles.produktPromocjaPiesChild} 
                    width={240} 
                    height={240} 
                    sizes="100vw" 
                    alt={productName} 
                    unoptimized={true} 
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

                    <div className={styles.loremIpsumDolor}>{productName}</div>
                </div>

                <div className={styles.cenaRegularnaParent}>

                    <div className={`${styles.cenaRegularna} ${
                        hasValidPromo ? styles.przekreslona : ""
                    }`}>{price} zł</div>
                    

                    {hasValidPromo && <b className={styles.cenaPromocyjna}>{promoPrice} zł</b>}
                </div>

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