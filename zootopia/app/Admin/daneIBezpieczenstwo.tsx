import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import styles from "./admin.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import { adminData, updateAdminData } from "./adminData";

const DaneIBezpieczenstwo: NextPage = () => {
    const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
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

    // Aktualizujemy pole, jeśli użytkownik wpisał w nie jakąś wartość. 
    // Jeśli zostało puste, zmiana nie zachodzi.

    if (formData.imie.trim() !== "") {
      updatedFields.imie = formData.imie.trim();
    }

    if (formData.nazwisko.trim() !== "") {
      updatedFields.nazwisko = formData.nazwisko.trim();
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
      if (formData.stareHaslo !== adminData.haslo) {
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

    updateAdminData(updatedFields);

    console.log("Zapisane dane:", updatedFields);
    console.log("Aktualne dane użytkownika:", { ...adminData, ...updatedFields });

    alert("Dane zostały zapisane");

    // Wyczyszczenie formularza po zapisie, aby zaktualizowane dane znów pojawiły się jako placeholdery
    setFormData({
      imie: "",
      nazwisko: "",
      telefon: "",
      email: "",
      stareHaslo: "",
      noweHaslo: "",
    });
  };


  	return (
        <main>
            <div className={styles.sortowanie}>
                <div className={styles.mojeDane}>Administrator</div>
                <div className={styles.mojeDane}>{`>`}</div>
                <div className={styles.mojeDane}>Dane i bezpieczeństwo</div>
            </div>
    		{/* Nagłówek */}
            <div className={styles.produktyWKoszyku2}>
              <div className={styles.mojeKonto}>Dane i bezpieczeństwo</div>
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
                  {/* Placeholdery do pokazywania domyślnych danych */}
                  <input
                    type="text"
                    name="imie"
                    placeholder={`Imię: ${adminData.imie}`}
                    value={formData.imie}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="nazwisko"
                    placeholder={`Nazwisko: ${adminData.nazwisko}`}
                    value={formData.nazwisko}
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
                    placeholder={`Telefon: ${adminData.telefon}`}
                    value={formData.telefon}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="email"
                    name="email"
                    placeholder={`E-mail: ${adminData.email}`}
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
        </main>
    );
};

export default DaneIBezpieczenstwo;