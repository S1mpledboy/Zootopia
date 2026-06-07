"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./PetCard.module.css";

interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  ageLabel: string;
  gender: string;
  size: string;
  description: string;
  image: string;
  status: string;
  tags: string[];
}

const genderIcon: Record<string, string> = {
  male: "♂",
  female: "♀",
};

const sizeLabel: Record<string, string> = {
  small: "Mały",
  medium: "Średni",
  large: "Duży",
};

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={"/adoptuj/" + pet._id} className={styles.card}>
      <div className={styles.inner}>

        <div className={styles.photo}>
          <Image
            src={pet.image}
            alt={pet.name}
            fill
            className="object-cover"
          />
          <span className={styles.badgeGender}>
            {genderIcon[pet.gender] ?? ""}
          </span>
          {pet.status === "available" && (
            <span className={styles.badgeStatus + " " + styles.badgeAvailable}>
              Dostępny
            </span>
          )}
          {pet.status === "reserved" && (
            <span className={styles.badgeStatus + " " + styles.badgeReserved}>
              Zarezerwowany
            </span>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.row}>
            <h3 className={styles.name}>{pet.name}</h3>
            <span className={styles.age}>{pet.ageLabel}</span>
          </div>

          <p className={styles.breed}>
            {pet.breed} · {sizeLabel[pet.size] ?? pet.size}
          </p>

          <p className={styles.desc}>{pet.description}</p>

          <div className={styles.tags}>
            {pet.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          {pet.status === "available" && (
            <button className={styles.btnAdopt}>
              Poznaj {pet.name}
            </button>
          )}
          {pet.status === "reserved" && (
            <button disabled className={styles.btnReserved}>
              Zarezerwowany
            </button>
          )}
        </div>

      </div>
    </Link>
  );
}