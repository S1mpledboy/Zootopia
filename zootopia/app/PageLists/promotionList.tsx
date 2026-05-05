import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';
import categoryNameStyle from '@/app/modulesCSS/categoryName.module.css';

import {PromoItems} from "@/app/Public/Data/promoItems";
import PromotionItem from '../ItemBlocks/promotionItem';

import item1 from "@/app/Public/Images/item1.png";
import item2 from "@/app/Public/Images/item2.png";


const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
                {PromoItems.map((item) => (
                    <PromotionItem
                        key={item.id}
                        id={item.id}
                        brandName={item.brandName}
                        productName={item.productName}
                        price={item.price}
                        promoPrice={item.promoPrice}
                        image={item.image}
                    />
                ))}
    		</div>);
};

export default Kategorie ;
