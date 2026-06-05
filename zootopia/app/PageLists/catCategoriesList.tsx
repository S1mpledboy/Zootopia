import type { NextPage } from 'next';
import Image from "next/image";
import Link from "next/link"; // Oficjalny komponent linkowania Next.js
import styles from '@/app/modulesCSS/categoryItem.module.css';

import Category from "@/app/ItemBlocks/categoryItem";
import { items } from "@/app/Public/Data/catCategories"; // Pobieranie czystej tablicy z pliku powyżej

import cat from "@/app/Public/Images/KotCat.png";

const Kategorie: NextPage = () => {
  return (
    <div className={styles.kategorie}>
      
      {/* 1. Pierwszy kafelek: Wszystko dla kota */}
      <Link 
        href="/ShopPage?type=kot" 
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <Category
          id={0}
          name={"Wszystko dla kota"} // Poprawione z "Wszystko dla psa"
          image={cat}
          bgColor="#ecb3c0"
        />
      </Link>
      
      {/* 2. Dynamiczne renderowanie kafelków dla kota */}
      {items.map((item) => {
        const targetLink = item.link || "/ShopPage?type=kot";
        
        return (
          <Link 
            key={item.id}
            href={targetLink} 
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <Category
              id={item.id}
              name={item.name}
              image={item.image}
              bgColor="#ecb3c0"
            />
          </Link>
        );
      })}

    </div>
  );
};

export default Kategorie;