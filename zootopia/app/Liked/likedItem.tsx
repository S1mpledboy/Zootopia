"use client";

import type { NextPage } from 'next';
import Image from 'next/image';

import styles from './liked.module.css';
import ProductImage from '@/app/Public/Images/kotMokra.png';
import FavoriteIcon from '@/app/Public/Images/Vector.svg';
import CartIcon from '@/app/Public/Images/tabler-icon-shopping-bag-plus.svg';

const Property1Ulubione: NextPage = () => {
	return (
		<div className={styles.property1ulubione}>
			<Image
				className={styles.imgProduktuIcon}
				src={ProductImage}
				width={100}
				height={100}
				alt="Produkt"
			/>

			<div className={styles.frameParent}>
				<div className={styles.frameGroup}>
					<div className={styles.frameWrapper}>
						<div className={styles.krainaNoteciParent}>
							<b className={styles.krainaNoteci}>
								KRAINA NOTECI
							</b>

							<div className={styles.karmaLoremIpsum}>
								KARMA LOREM IPSUM 5KG
							</div>
						</div>
					</div>

					<div className={styles.zWrapper}>
						<div className={styles.z}>178,00 zł</div>
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
							src={FavoriteIcon}
							alt="Ulubione" 
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

export default Property1Ulubione;