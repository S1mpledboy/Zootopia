import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/categoryItem.module.css'

import Category from "@/app/ItemBlocks/categoryItem";
import {items} from "@/app/Public/Data/catCategories";

import cat from "@/app/Public/Images/KotCat.png";


const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
                <Category
                    id={0}
                    name={"Wszystko dla psa"}
                    image={cat}
                    bgColor="#ecb3c0"
                />
      			{items.map((item) => (
                    <Category
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        bgColor="#ecb3c0"
                    />
                ))}
    		</div>);
};

export default Kategorie ;
