'use client';

import type { NextPage } from 'next';
import Image from "next/image";
import { useState } from "react";
import styles from './Carousel.module.css';

interface CarouselProps {
  images?: string[];
}

const Carousel: NextPage<CarouselProps> = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return <div>Brak zdjęć produktu</div>;
  }

  return (
    <div className={styles.property1img1}>

      {/* GŁÓWNE ZDJĘCIE */}
      <div className={styles.property1img1Child}>
        <Image
          src={images[activeIndex]}
          alt={`product-${activeIndex}`}
          width={500}
          height={500}
          unoptimized
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* MINIATURKI */}
      <div className={styles.frameParent}>
        {images.map((photo, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={
              index === activeIndex
                ? styles.frameChildActive
                : styles.frameChild
            }
          >
            <Image
              src={photo}
              width={100}
              height={100}
              alt={`Miniaturka ${index + 1}`}
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;