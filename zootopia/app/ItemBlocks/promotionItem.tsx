import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/promotionList.module.css';

import item1 from "@/app/Public/Images/item1.png";
import hearth from "@/app/Public/Images/tabler-icon-heart.svg";
import Link from 'next/link';

type PromotionItemProps = {
    id: string;
    brandName: string;
    productName: string;
    price: number;
    promoPrice?: number;
    image: any;
}


const PromotionItem = ({
        id, brandName, productName, price, promoPrice, image,
    }: PromotionItemProps) => {
  	return (	
        <div className={styles.produktPromocjaPies}>
            <Link key={id} href={`/product/${id}`}>
                <Image src={image} className={styles.produktPromocjaPiesChild} width={240} height={240} sizes="100vw" alt="" />
            </Link>
                <div className={styles.nazwaMarkiParent}>
                    <b className={styles.nazwaMarki}>{brandName}</b>
                    <Image src={hearth} className={styles.ulubioneIcon} width={21.8} height={21.8} sizes="100vw" alt="" />
                </div>
                <div className={styles.loremIpsumDolorSitAmetConWrapper}>
                    <div className={styles.loremIpsumDolor}>Item z id: #{id} <br /> {productName}</div>
                </div>
                <div className={styles.cenaRegularnaParent}>
                    <div className={`${styles.cenaRegularna} ${
                        promoPrice !== undefined ? styles.przekreslona : ""
                    }`}>{price} zł</div>
                    {promoPrice && <b className={styles.cenaPromocyjna}>{promoPrice} zł</b>}
                </div>
                <div className={styles.doKoszykaWrapper}>
                    <div className={styles.doKoszyka}>Do koszyka</div>
                </div>
        </div>);
};

export default PromotionItem ;
