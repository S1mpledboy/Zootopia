import type { NextPage } from 'next';
import Image from "next/image";
import styles from './dodaj.module.css';

import aparat from '@/app/Public/Images/aparat.svg';
import add from '@/app/Public/Images/+icon.svg';
import zdj from '@/app/Public/Images/zdjicon.svg';
import arrowD from '@/app/Public/Images/arrowDown.svg';
import close from '@/app/Public/Images/Xicon.svg';

const DodajProdukt: NextPage = () => {
  	return (
    		<div className={styles.dodajProduktNieskoczone}>
      			<div className={styles.dodajProduktParent}>
        				<div className={styles.vectorParent1}>
                            <div className={styles.dodajProdukt}>Dodaj produkt</div>
                            <Image src={close} className={styles.vectorIcon1} width={14} height={14} sizes="100vw" alt="" />
                        </div>
        				<div className={styles.frameParent}>
          					<div className={styles.frameGroup}>
            						<div className={styles.frameContainer}>
              							<div className={styles.frameParent1}>
                								<div className={styles.tagParent2}>
                  									<div className={styles.marka}>Marka</div>
                  									<Image src={arrowD}  width={24} height={6} sizes="100vw" alt="" />
                								</div>
                								<div className={styles.tagParent2}>
                  									<div className={styles.marka}>Kategoria</div>
                  									<Image src={arrowD} width={24} height={6} sizes="100vw" alt="" />
                								</div>
              							</div>
              							<div className={styles.frameParent2}>
                								<div className={styles.tagParent}>
                  									<div className={styles.marka}>TAG</div>
                  									<Image src={add} className={styles.vectorIcon2} width={14} height={14} sizes="100vw" alt="" />
                								</div>
                								<div className={styles.frameChild} />
              							</div>
              							<div className={styles.frameContainer}>
                								<div className={styles.frameParent3}>
                  									<div className={styles.tagParent2}>
                    										<div className={styles.marka}>Cena</div>
                  									</div>
                  									<div className={styles.tagParent2}>
                    										<div className={styles.marka}>Cena promocyjna</div>
                  									</div>
                								</div>
                								<div className={styles.rectangleParent}>
                  									<div className={styles.frameItem} />
                  									<div className={styles.promocja}>Promocja</div>
                								</div>
              							</div>
            						</div>
            						<div className={styles.dodajGrafikeParent}>
              							<div className={styles.marka}>Dodaj grafike</div>
              							<Image src={aparat} className={styles.vectorIcon3} width={19} height={18} sizes="100vw" alt="" />
            						</div>
          					</div>
          					<div className={styles.frameParent5}>
            						<div className={styles.vectorWrapper}>
              							<Image src={zdj} className={styles.vectorIcon4} width={30} height={30} sizes="100vw" alt="" />
            						</div>
            						<div className={styles.vectorWrapper}>
              							<Image src={zdj} className={styles.vectorIcon4} width={30} height={30} sizes="100vw" alt="" />
            						</div>
            						<div className={styles.vectorWrapper}>
              							<Image src={zdj} className={styles.vectorIcon4} width={30} height={30} sizes="100vw" alt="" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.frameParent6}>
          					<div className={styles.nazwaWrapper}>
            						<div className={styles.marka}>Nazwa</div>
          					</div>
          					<div className={styles.nazwaWrapper}>
            						<div className={styles.marka}>Opis</div>
          					</div>
          					<div className={styles.nazwaWrapper}>
            						<div className={styles.marka}>Składniki*</div>
          					</div>
          					<div className={styles.nazwaWrapper}>
            						<div className={styles.marka}>Dodatkowe informacje</div>
          					</div>
        				</div>
        				<div className={styles.doKasyWrapper}>
          					<div className={styles.doKasy}>
            						<div className={styles.vectorParent}>
              							<Image src={add} className={styles.vectorIcon2} width={14} height={14} sizes="100vw" alt="" />
              							<div className={styles.dodajProdukt2}>DODAJ PRODUKT</div>
            						</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

export default DodajProdukt ;
