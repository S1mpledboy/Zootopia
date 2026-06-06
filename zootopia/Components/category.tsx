import type { NextPage } from 'next';
import styles from '@/app/modulesCSS/category.module.css';


const Kategorie: NextPage = () => {
  	return (
    		<div className={styles.kategorie}>
      			<div className={styles.frameParent}>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Pies</b>
        				</div>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Kot</b>
        				</div>
        				<div className={styles.piesWrapper}>
          					<b className={styles.pies}>Małe zwierzęta</b>
        				</div>
        				<div className={styles.promocjeWrapper}>
          					<b className={styles.pies}>Promocje</b>
        				</div>
      			</div>
    		</div>);
};

export default Kategorie ;
