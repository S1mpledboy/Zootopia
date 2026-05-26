import type { NextPage } from 'next';
import styles from '@/app/modulesCSS/category.module.css';
import Link from 'next/link';


const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
      			<div className={styles.frameParent}>
					<Link href={"/ShopPage"}>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Pies</b>
        				</div>
					</Link>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Kot</b>
        				</div>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Małe zwierzęta</b>
        				</div>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>VET</b>
        				</div>
        				<div className={styles.promocjeWrapper}>
          					<b className={styles.pies}>Promocje</b>
        				</div>
      			</div>
      			<div className={styles.kategorieInner}>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Adoptuj Przyjaciela</b>
        				</div>
      			</div>
    		</div>);
};

export default Kategorie ;
