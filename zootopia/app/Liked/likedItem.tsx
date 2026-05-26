"use client";

import type { FC } from 'react';
import Image from 'next/image';

import styles from './liked.module.css';
import FavoriteIcon from '@/app/Public/Images/Vector.svg';
import TrashIcon from '@/app/Public/Images/tabler-icon-trash.svg';
import CartIcon from '@/app/Public/Images/tabler-icon-shopping-bag-plus.svg';

interface LikedItemProps {
    product: {
        id: string;
        productName: string;
        brandName: string;
        price: number;
        image: string;
    };
}

const LikedItem: FC<LikedItemProps> = ({ product }) => {
    return (
        <div className={styles.property1ulubione}>
            <Image
                className={styles.imgProduktuIcon}
                src={product.image}
                width={100}
                height={100}
                alt={product.productName}
            />

            <div className={styles.frameParent}>
                <div className={styles.frameGroup}>
                    <div className={styles.frameWrapper}>
                        <div className={styles.krainaNoteciParent}>
                            <b className={styles.krainaNoteci}>
                                {product.brandName.toUpperCase()}
                            </b>
                            <div className={styles.karmaLoremIpsum}>
                                {product.productName}
                            </div>
                        </div>
                    </div>

                    <div className={styles.zWrapper}>
                        <div className={styles.z}>
                            {product.price.toFixed(2).replace('.', ',')} zł
                        </div>
                    </div>
                </div>

                <div className={styles.frameContainer}>
                    <div className={styles.parent}>
                        <div className={styles.div}>-</div>
                        <div className={styles.wrapper}>
                            <div className={styles.div2}>1</div>
                        </div>
                        <div className={styles.div3}>+</div>
                    </div>

                    <div className={styles.ulubioneParent}>
                        <Image 
                            src={FavoriteIcon}
                            alt="Ulubione" 
                            className={styles.ulubioneIcon}
                            width={24}
                            height={24}
                        />

                        <div className={styles.dodajDoKoszyka}>
                            <Image 
                                src={CartIcon}
                                alt="Koszyk" 
                                className={styles.vectorIcon}
                                width={24}
                                height={24}
                            />
                        </div>

                        <Image 
                            src={TrashIcon}
                            alt="Usuń" 
                            className={styles.ulubioneIcon}
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LikedItem;