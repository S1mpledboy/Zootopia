import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/categoryItem.module.css'

import Category from "@/app/ItemBlocks/categoryItem";
import {items} from "@/app/Public/Data/dogCategories";

import dog from "@/app/Public/Images/piesCat.png";


const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
                <Category
                    id={0}
                    name={"Wszystko dla psa"}
                    image={dog}
                    bgColor="#c3e2ed"
                />
      			{items.map((item) => (
                    <Category
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        bgColor="#c3e2ed"
                    />
                ))}
    		</div>);
};

export default Kategorie ;
