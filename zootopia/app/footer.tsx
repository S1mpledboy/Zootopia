import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/footer.module.css';

import linkedin from "@/app/Public/Images/LinkedIn.svg";
import instagram from "@/app/Public/Images/Instagram.svg";
import facebook from "@/app/Public/Images/Facebook.svg";
import mail from "@/app/Public/Images/Mail.svg";
import phone from "@/app/Public/Images/Phone.svg";
import map from "@/app/Public/Images/Map.svg";
import logo from "@/app/Public/Images/ZOOTOPIAwhite.svg";



const Stopka: NextPage = () => {
  	return (
    		<div className={styles.stopka}>
      			<div className={styles.logoParent}>
        				<div className={styles.logo}>
          					<div className={styles.zootopiaWrapper}>
            						<Image src={logo} className={styles.zootopiaIcon} width={169.1} height={26.7} sizes="100vw" alt="" />
          					</div>
        				</div>
        				<div className={styles.frameParent}>
          					<div className={styles.kontaktParent}>
            						<div className={styles.kontakt}>Kontakt</div>
            						<div className={styles.frameGroup}>
              							<div className={styles.frameContainer}>
                								<Image src={map} className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
                								<div className={styles.ulRadosnejMerdy}>ul. Radosnej Merdy 15, 02-677 Warszawa</div>
              							</div>
              							<div className={styles.frameContainer}>
                								<Image src={phone} className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
                								<div className={styles.ulRadosnejMerdy}>+48 123 456 789</div>
              							</div>
              							<div className={styles.frameContainer}>
                								<Image src={mail} className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
                								<div className={styles.ulRadosnejMerdy}>czesc@zootopia.pl</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.section3}>
            						<div className={styles.obsugaKlienta}>Obsługa klienta</div>
            						<div className={styles.statusZamwieniaParent}>
              							<div className={styles.statusZamwienia}>Status zamówienia</div>
              							<div className={styles.kosztyICzas}>Koszty i czas dostawy</div>
              							<div className={styles.kosztyICzas}>Metody płatności</div>
              							<div className={styles.kosztyICzas}>Zwroty i reklamacje</div>
              							<div className={styles.kosztyICzas}>Centrum pomocy</div>
            						</div>
          					</div>
          					<div className={styles.section3}>
            						<div className={styles.obsugaKlienta}>Informacje</div>
            						<div className={styles.statusZamwieniaParent}>
              							<div className={styles.statusZamwienia}>Regulamin sklepu</div>
              							<div className={styles.kosztyICzas}>Polityka prywatności</div>
              							<div className={styles.kosztyICzas}>Polityka Cookies</div>
              							<div className={styles.kosztyICzas}>Zasady publikowania opinii</div>
            						</div>
          					</div>
          					<div className={styles.section3}>
            						<div className={styles.obsugaKlienta}>Zootopia</div>
            						<div className={styles.statusZamwieniaParent}>
              							<div className={styles.statusZamwienia}>O nas</div>
              							<div className={styles.schroniskaPartnerskie}>Schroniska partnerskie</div>
              							<div className={styles.schroniskaPartnerskie}>Adoptuj Przyjaciela</div>
              							<div className={styles.schroniskaPartnerskie}>Historie adopcyjne</div>
            						</div>
          					</div>
          					<div className={styles.sekcjaSocialMedia}>
            						<div className={styles.obsugaKlienta}>Social Media</div>
            						<div className={styles.frameContainer}>
              							<Image src={facebook} className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
              							<Image src={instagram}className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
              							<Image src={linkedin} className={styles.frameIcon} width={24} height={24} sizes="100vw" alt="" />
            						</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

export default Stopka ;
