
"use client";

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './liked.module.css';
import FavoriteIcon from '@/app/Public/Images/Vector.svg';
import TrashIcon from '@/app/Public/Images/tabler-icon-trash.svg';
import CartIcon from '@/app/Public/Images/tabler-icon-shopping-bag-plus.svg';

interface LikedItemProps {
    product: {
        id: string;
        productName: string;
        brandName: string;
        price: number;
        image: string;
    };
}

const LikedItem: FC<LikedItemProps> = ({ product }) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    

    const [quantity, setQuantity] = useState<number>(1);

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Musisz się zalogować, aby dodać produkt do koszyka!");
            router.push("/Auth");
            return;
        }

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity, 
                }),
            });

            if (res.ok) {
                alert(`Dodano do koszyka (${quantity} szt.) produkt: ${product.productName}`);
            } else {
                const data = await res.json();
                alert(`Błąd: ${data.message || "Nie udało się dodać produktu do koszyka"}`);
            }
        } catch (err) {
            console.error("Błąd podczas dodawania do koszyka:", err);
            alert("Wystąpił błąd sieci podczas dodawania do koszyka.");
        } finally {
            setIsAddingToCart(false);
        }
    };


    const handleRemoveFromLiked = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (isDeleting) return;
        setIsDeleting(true);

        try {
            const res = await fetch('/api/likedList', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product.id })
            });

            if (res.ok) {
                router.refresh(); 
            } else {
                const data = await res.json();
                alert(data.error || "Nie udało się usunąć produktu.");
                setIsDeleting(false);
            }
        } catch (err) {
            console.error("Błąd podczas usuwania z ulubionych:", err);
            alert("Błąd połączenia z serwerem.");
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.property1ulubione} style={{ opacity: isDeleting ? 0.5 : 1 }}>
            

            <Link href={`/product/${product.id}`}>
                <Image
                    className={styles.imgProduktuIcon}
                    src={product.image}
                    width={100}
                    height={100}
                    alt={product.productName}
                    style={{ cursor: "pointer" }}
                />
            </Link>

            <div className={styles.frameParent}>
                <div className={styles.frameGroup}>
                    <div className={styles.frameWrapper}>
                        <div className={styles.krainaNoteciParent}>
                            <b className={styles.krainaNoteci}>
                                {product.brandName.toUpperCase()}
                            </b>
                            <div className={styles.karmaLoremIpsum}>
                                {product.productName}
                            </div>
                        </div>
                    </div>

                    <div className={styles.zWrapper}>
                        <div className={styles.z}>
                            {product.price.toFixed(2).replace('.', ',')} zł
                        </div>
                    </div>
                </div>

                <div className={styles.frameContainer}>

                    <div className={styles.parent}>
                        <div className={styles.div} onClick={handleDecrease} style={{ cursor: "pointer", userSelect: "none" }}>-</div>
                        <div className={styles.wrapper}>
                            <div className={styles.div2}>{quantity}</div>
                        </div>
                        <div className={styles.div3} onClick={handleIncrease} style={{ cursor: "pointer", userSelect: "none" }}>+</div>
                    </div>

                    <div className={styles.ulubioneParent}>
                        <Image src={FavoriteIcon} alt="Ulubione" className={styles.ulubioneIcon} width={24} height={24} />
                        
                        <div 
                            className={styles.dodajDoKoszyka} 
                            onClick={handleAddToCart}
                            style={{ 
                                cursor: isAddingToCart ? "not-allowed" : "pointer",
                                opacity: isAddingToCart ? 0.5 : 1 
                            }}
                        >
                            <Image src={CartIcon} alt="Koszyk" className={styles.vectorIcon} width={24} height={24} />
                        </div>
                        

                        <Image 
                            src={TrashIcon} 
                            alt="Usuń" 
                            className={styles.ulubioneIcon} 
                            width={24} 
                            height={24} 
                            onClick={handleRemoveFromLiked}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LikedItem;