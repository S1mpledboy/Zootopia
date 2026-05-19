"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./shoppingcart.module.css";
import eyeoff from "@/app/Public/Images/tabler-icon-eye-off.svg";

interface AuthInputProps {
  label: string;
  type?: "text" | "password" | "email";
  isPassword?: boolean;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string; // 🔥 Nowy, opcjonalny prop sterujący zachowaniem menedżera haseł
}

export const AuthInput = ({
  label,
  type = "text",
  isPassword,
  value,
  onChange,
  autoComplete, // 🔥 Odbieramy atrybut autocomplete
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={isPassword ? styles.frameDiv : styles.eMailWrapper}>
      <div className={styles.frameParent}>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete} // 🔥 Przekazujemy do natywnego inputa HTML
          className={styles.eMail}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Image src={eyeoff} alt="Pokaż/ukryj hasło" />
          </button>
        )}
      </div>
    </div>
  );
};