"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/app/context/AuthContext";

import styles from "./mojeKonto.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import { userData, updateUserData } from "./userData";

const ProduktyWKoszyku: NextPage = () => {
  const { logout } = useAuth();
  // 1. Inicjalizujemy stan pustymi wartościami, aby placeholdery mogły działać
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    kraj: "",
    ulica: "",
    miasto: "",
    kodPocztowy: "",
    telefon: "",
    email: "",
    stareHaslo: "",
    noweHaslo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePostalCode = (code: string) => {
    return /^\d{2}-\d{3}$/.test(code);
  };

  const validatePhone = (phone: string) => {
    return /^\d{9}$/.test(phone);
  };

  const handleSave = () => {
    const updatedFields: any = {};

    // 2. Aktualizujemy pole TYLKO, jeśli użytkownik wpisał w nie jakąś wartość. 
    // Jeśli zostało puste, zmiana nie zachodzi.

    if (formData.imie.trim() !== "") {
      updatedFields.imie = formData.imie.trim();
    }

    if (formData.nazwisko.trim() !== "") {
      updatedFields.nazwisko = formData.nazwisko.trim();
    }

    if (formData.kraj.trim() !== "") {
      updatedFields.kraj = formData.kraj.trim();
    }

    if (formData.ulica.trim() !== "") {
      updatedFields.ulica = formData.ulica.trim();
    }

    if (formData.miasto.trim() !== "") {
      updatedFields.miasto = formData.miasto.trim();
    }

    if (formData.kodPocztowy.trim() !== "") {
      if (!validatePostalCode(formData.kodPocztowy.trim())) {
        alert("Kod pocztowy musi być w formacie XX-XXX");
        return;
      }
      updatedFields.kodPocztowy = formData.kodPocztowy.trim();
    }

    if (formData.telefon.trim() !== "") {
      if (!validatePhone(formData.telefon.trim())) {
        alert("Telefon musi zawierać dokładnie 9 cyfr");
        return;
      }
      updatedFields.telefon = formData.telefon.trim();
    }

    if (formData.email.trim() !== "") {
      updatedFields.email = formData.email.trim();
    }

    // Hasło
    if (formData.noweHaslo.trim() !== "") {
      if (formData.stareHaslo !== userData.haslo) {
        alert("Stare hasło jest niepoprawne");
        return;
      }

      if (formData.noweHaslo === formData.stareHaslo) {
        alert("Nowe hasło nie może być takie samo jak stare");
        return;
      }

      updatedFields.haslo = formData.noweHaslo;
    }

    // Zabezpieczenie: jeśli nie wprowadzono żadnych zmian, nie wywołujemy aktualizacji
    if (Object.keys(updatedFields).length === 0) {
      alert("Brak nowych danych do zapisania.");
      return;
    }

    updateUserData(updatedFields);

    console.log("Zapisane dane:", updatedFields);
    console.log("Aktualne dane użytkownika:", { ...userData, ...updatedFields });

    alert("Dane zostały zapisane");

    // Opcjonalnie: Wyczyszczenie formularza po zapisie, aby zaktualizowane dane znów pojawiły się jako placeholdery
    setFormData({
      imie: "",
      nazwisko: "",
      kraj: "",
      ulica: "",
      miasto: "",
      kodPocztowy: "",
      telefon: "",
      email: "",
      stareHaslo: "",
      noweHaslo: "",
    });
  };

  return (
    <div className={styles.produktyWKoszyku}>
      <div className={styles.frameParent}>
        {/* LEWE MENU */}
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.mojeKontoParent}>
              <div className={styles.mojeKonto}>Moje konto</div>
              <div className={styles.frameChild} />
            </div>

            <div className={styles.frameContainer}>
              <div className={styles.mojeDaneParent}>
                <div className={styles.mojeDane}>Moje dane</div>
                <Image
                  src={arrow}
                  className={styles.tablerIconChevronCompactRi}
                  width={24}
                  height={24}
                  sizes="100vw"
                  alt=""
                />
              </div>

              <div className={styles.frameItem} />

              <div className={styles.listaUlubionychParent}>
                <div className={styles.mojeDane}>Lista ulubionych</div>
                <Image
                  src={arrow}
                  className={styles.tablerIconChevronCompactRi}
                  width={24}
                  height={24}
                  sizes="100vw"
                  alt=""
                />
              </div>

              <div className={styles.frameItem} />

              <div className={styles.listaUlubionychParent}>
                <div className={styles.mojeDane}>Moje zgody</div>
                <Image
                  src={arrow}
                  className={styles.tablerIconChevronCompactRi}
                  width={24}
                  height={24}
                  sizes="100vw"
                  alt=""
                />
              </div>

              <div className={styles.frameItem} />

              <div
                className={styles.listaUlubionychParent}
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Wyloguj się</div>
                <Image
                  src={arrow}
                  className={styles.tablerIconChevronCompactRi}
                  width={24}
                  height={24}
                  sizes="100vw"
                  alt=""
                />
              </div>

              <div className={styles.frameItem} />

              <div className={styles.listaUlubionychParent}>
                <div className={styles.mojeDane}>Historia zamówień</div>
                <Image
                  src={arrow}
                  className={styles.tablerIconChevronCompactRi}
                  width={24}
                  height={24}
                  sizes="100vw"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA */}
        <div className={styles.frameDiv}>
          <div className={styles.sortowanieParent}>
            {/* Breadcrumbs */}
            <div className={styles.sortowanie}>
              <div className={styles.mojeDane}>Moje konto</div>
              <div className={styles.mojeDane}>{`>`}</div>
              <div className={styles.mojeDane}>Moje dane</div>
            </div>

            {/* Nagłówek */}
            <div className={styles.produktyWKoszyku2}>
              <div className={styles.mojeKonto}>Moje dane</div>
              <Image
                src={arrow}
                className={styles.produktyWKoszykuChild}
                width={760}
                height={1}
                sizes="100vw"
                alt=""
              />
            </div>

            {/* FORMULARZ */}
            <div className={styles.frameParent2}>
              {/* Imię + nazwisko */}
              <div className={styles.frameParent3}>
                <div className={styles.imiWrapper}>
                  {/* 3. Używamy placeholderów do pokazywania domyślnych danych */}
                  <input
                    type="text"
                    name="imie"
                    placeholder={`Imię: ${userData.imie}`}
                    value={formData.imie}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="nazwisko"
                    placeholder={`Nazwisko: ${userData.nazwisko}`}
                    value={formData.nazwisko}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Kraj */}
              <div className={styles.polskaWrapper}>
                <input
                  type="text"
                  name="kraj"
                  placeholder={`Kraj: ${userData.kraj}`}
                  value={formData.kraj}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Ulica */}
              <div className={styles.polskaWrapper}>
                <input
                  type="text"
                  name="ulica"
                  placeholder={`Ulica i numer: ${userData.ulica}`}
                  value={formData.ulica}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Miasto + kod */}
              <div className={styles.frameParent4}>
                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="miasto"
                    placeholder={`Miasto: ${userData.miasto}`}
                    value={formData.miasto}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.kodPocztowyWrapper}>
                  <input
                    type="text"
                    name="kodPocztowy"
                    placeholder={`Kod pocztowy: ${userData.kodPocztowy}`}
                    value={formData.kodPocztowy}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Telefon + email */}
              <div className={styles.frameParent3}>
                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="telefon"
                    placeholder={`Telefon: ${userData.telefon}`}
                    value={formData.telefon}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="email"
                    name="email"
                    placeholder={`E-mail: ${userData.email}`}
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Hasła */}
              <div className={styles.frameParent3}>
                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="password"
                    name="stareHaslo"
                    placeholder="Stare hasło"
                    value={formData.stareHaslo}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="password"
                    name="noweHaslo"
                    placeholder="Nowe hasło"
                    value={formData.noweHaslo}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className={styles.produktyWKoszyku3}>
              <Image
                src={arrow}
                className={styles.produktyWKoszykuItem}
                width={760}
                height={1}
                sizes="100vw"
                alt=""
              />
            </div>

            {/* Button */}
            <div className={styles.produktyWKoszyku4}>
              <button className={styles.doKasy} onClick={handleSave}>
                <div className={styles.zapiszZmiany}>ZAPISZ ZMIANY</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduktyWKoszyku;