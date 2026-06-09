"use client";

import type { NextPage } from "next";
import { useCallback, useState } from "react";
import styles from "./shoppingcart.module.css";
import { AuthInput } from "./AuthInput";
import Category from "@/Components/category";

const ProduktyWKoszyku: NextPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const onLoginSubmit = useCallback(async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Błąd logowania");
      return;
    }

    // Zapisujemy token JWT do localStorage
    localStorage.setItem("token", data.token);

    alert("Zalogowano pomyślnie");

    // SPRAWDZENIE ROLI UŻYTKOWNIKA
    // Zakładamy, że API zwraca obiekt np. { token: "...", role: "admin" } lub w strukturze data.user.role
    if (data.role === "admin" || data.user?.role === "admin") {
      window.location.href = "/Admin";
    } else {
      window.location.href = "/MojeKonto";
    }
  }, [loginEmail, loginPassword]);

 const onRegisterSubmit = useCallback(async () => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: registerEmail,
      password: registerPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Błąd rejestracji");
    return;
  }

  window.location.href = "/check-email";
}, [registerEmail, registerPassword]);

  return (
      <div className={styles.produktyWKoszyku}>
        <div className={styles.frameParent}>
          {/* LOGOWANIE */}
          <div className={styles.frameWrapper}>
            <div className={styles.zalogujSiParent}>
              <div className={styles.zalogujSi}>Zaloguj się</div>

              <div className={styles.frameGroup}>
                <div className={styles.frameContainer}>
                  <AuthInput
                    label="E-mail"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                  />

                  <AuthInput
                    label="Hasło"
                    type="password"
                    isPassword
                    value={loginPassword}
                    onChange={setLoginPassword}
                  />
                </div>

                <div className={styles.frameParent2}>
                  <div className={styles.rectangleParent}>
                    <input type="checkbox" className={styles.frameChild} />
                    <div className={styles.zapamitajMnie}>Zapamiętaj mnie</div>
                  </div>

                  <div
                    className={styles.zapamitajMnie}
                    style={{ cursor: "pointer" }}
                  >
                    Nie pamiętam hasła
                  </div>
                </div>
              </div>

              <button className={styles.doKasy} onClick={onLoginSubmit}>
                <div className={styles.zalogujSi2}>ZALOGUJ SIĘ</div>
              </button>
            </div>
          </div>

          {/* SEPARATOR */}
          <div className={styles.lineParent}>
            <div className={styles.frameItem} />
            <b className={styles.lub}>lub</b>
            <div className={styles.frameItem} />
          </div>

          {/* REJESTRACJA */}
          <div className={styles.frameWrapper2}>
            <div className={styles.zalogujSiParent}>
              <div className={styles.zalogujSi}>Zarejestruj się</div>

              <div className={styles.frameWrapper3}>
                <div className={styles.frameContainer}>
                  <AuthInput
                    label="E-mail"
                    type="email"
                    value={registerEmail}
                    onChange={setRegisterEmail}
                  />

                  <AuthInput
                    label="Hasło"
                    type="password"
                    isPassword
                    value={registerPassword}
                    onChange={setRegisterPassword}
                  />
                </div>
              </div>

              <button className={styles.doKasy2} onClick={onRegisterSubmit}>
                <div className={styles.zalogujSi2}>ZAREJESTRUJ SIĘ</div>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProduktyWKoszyku;