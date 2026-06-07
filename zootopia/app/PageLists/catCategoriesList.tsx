import type { NextPage } from 'next';
import Image from "next/image";
import Link from "next/link"; 
import styles from '@/app/modulesCSS/categoryItem.module.css';

import Category from "@/app/ItemBlocks/categoryItem";
import { items } from "@/app/Public/Data/catCategories"; 

import cat from "@/app/Public/Images/KotCat.png";

const Kategorie: NextPage = () => {
  return (
    <div className={styles.kategorie}>
      

      <Link 
        href="/ShopPage?type=kot" 
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <Category
          id={0}
          name={"Wszystko dla kota"} 
          image={cat}
          bgColor="#ecb3c0"
        />
      </Link>
      

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