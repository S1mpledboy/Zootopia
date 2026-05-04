import type { NextPage } from 'next';
import Image from "next/image";
import styles from "@/app/modulesCSS/categoryItem.module.css";

type KategorieProps = {
    id: number,
    name: string,
    image: any,
    bgColor?: string
};

const Kategorie = ({
    id, name, image, bgColor
}: KategorieProps) => {
  	return (
            <div className={styles.podkategoria}
            style={{backgroundColor: bgColor ?? "white"}}>
                    <div className={styles.podkategoriaInner}>
                        <Image src={image} className={styles.frameChild} width={180} height={170} sizes="100vw" alt="" />
                    </div>
                    <div className={styles.wszystkoDlaPsaWrapper}>
                        <b className={styles.wszystkoDlaPsa}>{name}</b>
                    </div>
            </div>
        );
};

export default Kategorie ;
