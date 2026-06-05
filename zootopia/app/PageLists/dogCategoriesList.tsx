import type { NextPage } from 'next';
import Image from "next/image";
import Link from "next/link"; // Importujemy komponent odnośnika
import styles from '@/app/modulesCSS/categoryItem.module.css';

import Category from "@/app/ItemBlocks/categoryItem";
import { items } from "@/app/Public/Data/dogCategories"; // Pobieramy czystą tablicę danych

import dog from "@/app/Public/Images/piesCat.png";

const Kategorie: NextPage = () => {
  return (
    <div className={styles.kategorie}>
      
      {/* 1. Pierwszy stały kafelek */}
      <Link 
        href="/ShopPage?type=pies" 
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <Category
          id={0}
          name={"Wszystko dla psa"}
          image={dog}
          bgColor="#c3e2ed"
        />
      </Link>
      
      {/* 2. Dynamiczne renderowanie kafelków z Excela */}
      {items.map((item) => {
        const targetLink = (item as any).link || "/ShopPage?type=pies";
        
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
              bgColor="#c3e2ed"
            />
          </Link>
        );
      })}

    </div>
  );
};

export default Kategorie;