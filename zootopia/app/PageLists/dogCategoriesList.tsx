import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/categoryItem.module.css';

import Category from "@/app/ItemBlocks/categoryItem";
import { items } from "@/app/Public/Data/dogCategories";

import dog from "@/app/Public/Images/piesCat.png";

// Rzutujemy komponent na typ dynamiczny 'any', aby TypeScript pozwolił na przekazanie propsu 'link'
const SafeCategory = Category as any;

const Kategorie: NextPage = () => {
  return (
    <div className={styles.kategorie}>
      {/* Pierwszy kafelek: Wszystko dla psa */}
      <SafeCategory
        id={0}
        name={"Wszystko dla psa"}
        image={dog}
        bgColor="#c3e2ed"
        link="/ShopPage?type=pies"
      />
      
      {/* Dynamiczna pętla mapująca kafelki z pliku dogCategories.ts */}
      {items.map((item) => (
        <SafeCategory
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image}
          bgColor="#c3e2ed"
          link={(item as any).link || "/ShopPage?type=pies"}
        />
      ))}
    </div>
  );
};

export default Kategorie;