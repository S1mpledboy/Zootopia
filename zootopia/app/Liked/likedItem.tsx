"use client";

import type { NextPage } from 'next';
import Image from 'next/image';

import styles from './liked.module.css';
import ProductImage from '@/Public/Images/kotMokra.png';  // ← Bez `/app`
import FavoriteIcon from '@/Public/Images/Vector.svg';
import CartIcon from '@/Public/Images/tabler-icon-shopping-bag-plus.svg';

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
				{/* ... reszta kodu ... */}

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
	);
};

export default Property1Ulubione;