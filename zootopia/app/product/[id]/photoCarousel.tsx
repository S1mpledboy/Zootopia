'use client';

import type { NextPage } from 'next';
import Image from "next/image";
import styles from './Carousel.module.css';

interface CarouselProps {
  mainImage?: string;
  images?: string[];
}

const Carousel: NextPage<CarouselProps> = ({ mainImage = "", images = [] }) => {
    return (
        <div className={styles.property1img1}>
            {/* Główne zdjęcie */}
            <div className={styles.property1img1Child}>
                {mainImage && (
                    <Image 
                        src={mainImage} 
                        alt="Główne zdjęcie produktu"
                        priority
                        placeholder="blur"
                        width={500}
                        height={500}
                    />
                )}
            </div>

            {/* Miniaturki */}
            <div className={styles.frameParent}>
                {images.map((photo, index) => (
                    <Image 
                        key={index}
                        src={photo} 
                        className={styles.frameChild} 
                        width={100} 
                        height={100} 
                        alt={`Miniaturka ${index + 1}`} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;