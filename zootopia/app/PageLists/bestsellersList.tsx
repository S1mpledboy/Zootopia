import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import categoryNameStyle from '@/app/modulesCSS/categoryName.module.css';

import PromotionItem from '../ItemBlocks/promotionItem';
import {BestsellersItems} from "@/app/Public/Data/bestsellerItems";



const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
                {BestsellersItems.map((item) => (
                    <PromotionItem
                        key={item.id}
                        id={item.id}
                        brandName={item.brandName}
                        productName={item.productName}
                        price={item.price}
                        image={item.image}
                    />
                ))}
    		</div>);
};

export default Kategorie ;
