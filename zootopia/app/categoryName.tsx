

import type { NextPage } from 'next';
import Image from "next/image";
import styles from '@/app/modulesCSS/categoryName.module.css';


type CategoryNameProps = {
    name: string;
}

const Nawigacja = ({
    name
}: CategoryNameProps) => {
  	return (
        <div className={styles.kategorie}>
            <div className={styles.promocje}>
                {name}
            </div>
        </div>);
};

export default Nawigacja ;
