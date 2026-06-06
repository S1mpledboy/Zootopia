import type { NextPage } from 'next';
import Image from "next/image";
import styles from './konta.module.css';

import line from '@/app/Public/Images/line.svg';
import kosz from '@/app/Public/Images/kosz.svg';
import kalendarz from '@/app/Public/Images/kalendarz.svg';
import lupa from '@/app/Public/Images/lupa.svg';



const Konta: NextPage = () => {
  	return (
    		<div className={styles.prawa}>
      			<div className={styles.content}>
        				<div className={styles.sortowanie}>
          					<div className={styles.administrator}>Administrator</div>
          					<div className={styles.administrator}>{`>`}</div>
          					<div className={styles.administrator}>Zarządzanie użytkownikami</div>
        				</div>
        				<div className={styles.tytul}>
          					<div className={styles.kontaUytkownikwParent}>
            						<div className={styles.kontaUytkownikw}>Konta użytkowników</div>
            						<div className={styles.szukajUytkownikaParent}>
              							<div className={styles.administrator}>Szukaj użytkownika...</div>
              							<Image src={lupa} className={styles.tablerIconSearch} width={20} height={20} sizes="100vw" alt="" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.divider}>
          					<Image src={line} width={760} height={1} sizes="100vw" alt="" />
        				</div>
        				<div className={styles.sortowanieZamwie}>
          					<div className={styles.kontaUytkownikwParent}>
            						<div className={styles.wszystkieParent}>
              							<b className={styles.wszystkie}>Wszystkie</b>
              							<b className={styles.wszystkie}>(20)</b>
            						</div>
            						<div className={styles.aktywneParent}>
              							<b className={styles.wszystkie}>Aktywne</b>
              							<b className={styles.wszystkie}>(19)</b>
            						</div>
            						<div className={styles.aktywneParent}>
              							<b className={styles.wszystkie}>Nieaktywne</b>
              							<b className={styles.wszystkie}>(1)</b>
            						</div>
          					</div>
        				</div>
        				<div className={styles.divider}>
          					<Image src={line} width={760} height={1} sizes="100vw" alt="" />
        				</div>
        				<div className={styles.kontaUytkownikwParent}>
          					<div className={styles.janKowalskiParent}>
            						<div className={styles.janKowalski}>Jan Kowalski</div>
            						<b className={styles.jankowalskigmailcom}>jankowalski@gmail.com</b>
          					</div>
          					<div className={styles.frameWrapper}>
            						<div className={styles.frameContainer}>
              							<div className={styles.vectorParent}>
                								<Image src={kalendarz} className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="" />
                								<div className={styles.div2}>10.05.2026</div>
              							</div>
              							<b className={styles.aktywny}>AKTYWNY</b>
              							<Image src={kosz}className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.produktyWKoszyku}>
          					<Image src={line}  width={760} height={1} sizes="100vw" alt="" />
        				</div>
        				<div className={styles.kontaUytkownikwParent}>
          					<div className={styles.janKowalskiParent}>
            						<div className={styles.janKowalski}>Jan Kowalski</div>
            						<b className={styles.jankowalskigmailcom}>jankowalski@gmail.com</b>
          					</div>
          					<div className={styles.frameWrapper}>
            						<div className={styles.frameParent6}>
              							<div className={styles.vectorParent}>
                								<Image src={kalendarz} className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="" />
                								<div className={styles.div2}>10.05.2026</div>
              							</div>
              							<b className={styles.nieaktywny}>NIEAKTYWNY</b>
              							<Image src={kosz} className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.produktyWKoszyku4}>
          					<Image src={line} width={760} height={1} sizes="100vw" alt="" />
        				</div>
      			</div>
    		</div>);
};

export default Konta;
