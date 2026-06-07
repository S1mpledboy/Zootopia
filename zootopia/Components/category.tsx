'use client';

import type { NextPage } from 'next';
import styles from '@/app/modulesCSS/category.module.css';
import Link from 'next/link';

const Kategorie: NextPage = () => {
    return (
        <div className={styles.kategorie}>
            {/* Lewa strona: Kategorie sklepowe */}
            <div className={styles.frameParent}>
                <Link href={{ pathname: '/ShopPage', query: { type: 'pies' } }}>
                    <div className={styles.piesWrapper}>
                        <b className={styles.pies}>Pies</b>
                    </div>
                </Link>
                <Link href={{ pathname: '/ShopPage', query: { type: 'kot' } }}>
                    <div className={styles.piesWrapper}>
                        <b className={styles.pies}>Kot</b>
                    </div>
                </Link>
                <Link href={{ pathname: '/ShopPage', query: { type: 'male-zwierzeta' } }}>
                    <div className={styles.piesWrapper}>
                        <b className={styles.pies}>Małe zwierzęta</b>
                    </div>
                </Link>
                <Link href={{ pathname: '/ShopPage', query: { type: 'promocje' } }}>
                    <div className={styles.promocjeWrapper}>
                        <b className={styles.pies}>Promocje</b>
                    </div>
                </Link>
            </div>

            {/* Prawa strona: Nowy przycisk Adopcji */}
            <Link href="/adoptuj" className={styles.promocjeWrapper}>
                Adoptuj Przyjaciela
            </Link>
        </div>
    );
};

export default Kategorie;