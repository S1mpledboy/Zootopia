"use client";
import Link from 'next/link';
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/app/context/AuthContext";

import styles from "./mojeKonto.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

const ProduktyWKoszyku: NextPage = () => {
  const { logout, user, refreshUser } = useAuth();
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

  const handleSave = async () => {
    const updatedFields: any = {};

    if (formData.imie.trim() !== "") {
      updatedFields.firstName = formData.imie.trim();
    }

    if (formData.nazwisko.trim() !== "") {
      updatedFields.lastName = formData.nazwisko.trim();
    }

    if (formData.kraj.trim() !== "") {
      updatedFields.country = formData.kraj.trim();
    }

    if (formData.ulica.trim() !== "") {
      updatedFields.street = formData.ulica.trim();
    }

    if (formData.miasto.trim() !== "") {
      updatedFields.city = formData.miasto.trim();
    }

    if (formData.kodPocztowy.trim() !== "") {
      if (!validatePostalCode(formData.kodPocztowy.trim())) {
        alert("Kod pocztowy musi być w formacie XX-XXX");
        return;
      }

      updatedFields.postalCode = formData.kodPocztowy.trim();
    }

    if (formData.telefon.trim() !== "") {
      if (!validatePhone(formData.telefon.trim())) {
        alert("Telefon musi zawierać dokładnie 9 cyfr");
        return;
      }

      updatedFields.phone = formData.telefon.trim();
    }

    if (formData.email.trim() !== "") {
      updatedFields.email = formData.email.trim();
    }

    if (formData.stareHaslo.trim() !== "" || formData.noweHaslo.trim() !== "") {
      if (formData.stareHaslo.trim() === "") {
        alert("Podaj stare hasło");
        return;
      }

      if (formData.noweHaslo.trim() === "") {
        alert("Podaj nowe hasło");
        return;
      }

      if (formData.noweHaslo.length < 6) {
        alert("Nowe hasło musi mieć co najmniej 6 znaków");
        return;
      }

      if (formData.stareHaslo === formData.noweHaslo) {
        alert("Nowe hasło nie może być takie samo jak stare");
        return;
      }

      updatedFields.oldPassword = formData.stareHaslo;
      updatedFields.newPassword = formData.noweHaslo;
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("Brak nowych danych do zapisania.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz się zalogować.");
      window.location.href = "/Auth";
      return;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFields),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Błąd zapisu danych");
      return;
    }

    await refreshUser();

    alert(data.message || "Dane zostały zapisane");

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
              
              {/* POPRAWIONA SEKCJA: Lista ulubionych jako link do /Liked */}
              <Link href="/Liked" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
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
              </Link>

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
            <div className={styles.sortowanie}>
              <div className={styles.mojeDane}>Moje konto</div>
              <div className={styles.mojeDane}>{`>`}</div>
              <div className={styles.mojeDane}>Moje dane</div>
            </div>

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

            <div className={styles.frameParent2}>
              <div className={styles.frameParent3}>
                <div className={styles.imiWrapper}>
                  <input
                    type="text"
                    name="imie"
                    placeholder={`Imię: ${user?.firstName || ""}`}
                    value={formData.imie}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="nazwisko"
                    placeholder={`Nazwisko: ${user?.lastName || ""}`}
                    value={formData.nazwisko}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.polskaWrapper}>
                <input
                  type="text"
                  name="kraj"
                  placeholder={`Kraj: ${user?.country || ""}`}
                  value={formData.kraj}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.polskaWrapper}>
                <input
                  type="text"
                  name="ulica"
                  placeholder={`Ulica i numer: ${user?.street || ""}`}
                  value={formData.ulica}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.frameParent4}>
                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="miasto"
                    placeholder={`Miasto: ${user?.city || ""}`}
                    value={formData.miasto}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.kodPocztowyWrapper}>
                  <input
                    type="text"
                    name="kodPocztowy"
                    placeholder={`Kod pocztowy: ${user?.postalCode || ""}`}
                    value={formData.kodPocztowy}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.frameParent3}>
                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="text"
                    name="telefon"
                    placeholder={`Telefon: ${user?.phone || ""}`}
                    value={formData.telefon}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.nazwiskoWrapper}>
                  <input
                    type="email"
                    name="email"
                    placeholder={`E-mail: ${user?.email || ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {user?.pendingEmail && (
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                  Nowy e-mail oczekuje na potwierdzenie: {user.pendingEmail}
                </p>
              )}

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