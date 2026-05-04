import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/heroSection.module.css';

import arrowR from "@/app/Public/Images/arrowR.svg";
import arrowL from "@/app/Public/Images/arrowL.svg";
import vector from "@/app/Public/Images/Vector 1.svg";
import dog from "@/app/Public/Images/dog.png";


const HeroSection: NextPage = () => {
  	return (
    		<div className={styles.heroSection}>
      			<div className={styles.frameParent}>
        				<div className={styles.frameGroup}>
          					<div className={styles.frameContainer}>
            						<div className={styles.czeCzowiekuParent}>
              							<div className={styles.czeCzowieku}>CZEŚĆ, CZŁOWIEKU!</div>
              							<Image src={vector} className={styles.frameChild} width={150} height={6} sizes="100vw" alt="" />
            						</div>
            						<div className={styles.mamNaImi}>Mam na imię Pimpek,<br/>mogę zostać twoim przyjacielem!</div>
            						</div>
            						<div className={styles.zobaczWicejWrapper}>
              							<div className={styles.zobaczWicej}>{`Zobacz więcej `}</div>
            						</div>
          					</div>
          					<div className={styles.frameWrapper}>
            						<Image src={dog} className={styles.frameItem} alt="" />
          					</div>
        				</div>
      			</div>);
      			};
      			
      			export default HeroSection ;
      			