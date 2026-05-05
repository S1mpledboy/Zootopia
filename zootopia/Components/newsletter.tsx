import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/newsletter.module.css';

import img from '@/app/Public/Images/newsletter.jpg';


const Newsletter: NextPage = () => {
  	return (
    		<div className={styles.newsletter}>
      			<div className={styles.wrapperHappyCutePetDogAni}>
        				<Image src={img} className={styles.happyCutePetDogAnimalsBacIcon} width={1444} height={962.7} sizes="100vw" alt="" />
      			</div>
      			<div className={styles.doczDoStadaZootopiiIOdbParent}>
        				<div className={styles.doczDoStada}>Dołącz do stada Zootopii i odbierz 10% rabatu!</div>
        				<div className={styles.zapiszSiDo}>Zapisz się do naszego newslettera i zaoszczędź 10% podczas kolejnych zakupów dla swojego pupila. Rabat obowiązuje przy zamówieniach o wartości od 100 zł do 500 zł.</div>
        				<div className={styles.wyraamZgodNaWykorzystywanParent}>
          					<div className={styles.wyraamZgodNa}>{`Wyrażam zgodę na wykorzystywanie moich danych osobowych oraz informacji przez Zootopia oraz spółki partnerskie w celu tworzenia profili użytkowników służących do personalizacji ofert i treści, do momentu cofnięcia przeze mnie zgody. `}</div>
          					<div className={styles.wyraamZgodNa}>Szczegółowe informacje dotyczące przetwarzania danych oraz Twoich praw znajdziesz w naszej Polityce prywatności.</div>
          					<div className={styles.wyraamZgodNa}>Ta strona jest zabezpieczona.</div>
        				</div>
        				<div className={styles.politykaPrywatnociParent}>
          					<div className={styles.politykaPrywatnoci}>Polityka prywatności</div>
          					<div className={styles.politykaPrywatnoci}>Warunki korzystania z serwisu</div>
        				</div>
        				<div className={styles.frameParent}>
          					<div className={styles.twjAdresEMailWrapper}>
            						<div className={styles.twjAdresEMail}>{`Twój adres e-mail `}</div>
          					</div>
          					<div className={styles.zapiszSiWrapper}>
            						<div className={styles.zapiszSi}>Zapisz się</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

export default Newsletter ;
