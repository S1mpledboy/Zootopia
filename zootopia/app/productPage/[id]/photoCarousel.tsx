'use client'; // Pamiętaj o tym w Next.js 13/14

import type { NextPage } from 'next';
import Image from "next/image";
import styles from './Carousel.module.css';

// IMPORTUJEMY ZDJĘCIA JAKO MODUŁY
// Musisz podać poprawną ścieżkę relatywną z folderu 'app/productPage' do folderu 'public'
import mainPhoto from "@/app/Public/Images/freepik_photo-of-a-single-premium_1.png";
import Photo1 from "@/app/Public/Images/freepik_photo-of-a-single-premium_2.png";
import Photo2 from "@/app/Public/Images/freepik_photo-of-a-single-premium_3.png";
import Photo3 from "@/app/Public/Images/freepik_photo-of-a-single-premium_4.png";


const Property1IMG1: NextPage = () => {
    return (
        <div className={styles.property1img1}>
            {/* Główne zdjęcie używa zaimportowanej zmiennej mainPhoto */}
            <div className={styles.property1img1Child}>
                <Image 
                    src={mainPhoto} 
                    alt="Główne zdjęcie produktu"
                    priority
                    placeholder="blur" // Opcjonalnie: dodaje efekt ładowania
                />
            </div>

            <div className={styles.frameParent}>
                {/* Miniaturki również używają tej samej zmiennej */}
                <Image 
                    src={Photo1} 
                    className={styles.frameChild} 
                    width={100} 
                    height={100} 
                    alt="Miniaturka 1" 
                />
                <Image 
                    src={Photo2} 
                    className={styles.frameChild} 
                    width={100} 
                    height={100} 
                    alt="Miniaturka 2" 
                />
                <Image 
                    src={Photo3} 
                    className={styles.frameChild} 
                    width={100} 
                    height={100} 
                    alt="Miniaturka 3" 
                />
            </div>
        </div>
    );
};

export default Property1IMG1;