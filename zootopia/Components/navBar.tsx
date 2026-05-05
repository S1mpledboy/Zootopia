import type { NextPage } from 'next';
import Link from 'next/link';

import Image from "next/image";
import styles from '@/app/modulesCSS/navBar.module.css';
import logo from "@/app/Public/Images/ZOOTOPIA.svg";
import searchicon from "@/app/Public/Images/tabler-icon-search.svg";
import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import bagicon from "@/app/Public/Images/tabler-icon-shopping-bag.svg";
import usericon from "@/app/Public/Images/tabler-icon-user-circle.svg";


const Nawigacja: NextPage = () => {
  	return (
    		<div className={styles.nawigacja}>
      			<div className={styles.zootopiaWrapper}>
        				<Link href="/">
						<Image src={logo} className={styles.zootopiaIcon} width={253.6} height={40} sizes="100vw" alt="" />
						</Link>
				</div>
      			<div className={styles.szukajParent}>
        				<div className={styles.szukaj}>Szukaj...</div>
        				<Image src={searchicon} className={styles.tablerIconSearch} width={24} height={24} sizes="100vw" alt="" />
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.tablerIconHeartParent}>
          					<Image src={hearticon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
          					<div className={styles.ulubione}>Ulubione</div>
        				</div>
        				<div className={styles.tablerIconHeartParent}>
							<Link href="/Auth">
          					<Image src={bagicon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
          					</Link>
							<div className={styles.ulubione}>Moje konto</div>
        				</div>
        				<div className={styles.tablerIconHeartParent}>
          					<Image src={usericon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
          					<div className={styles.ulubione}>Koszyk</div>
        				</div>
      			</div>
    		</div>);
};

export default Nawigacja ;
