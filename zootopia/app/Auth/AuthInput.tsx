import Image from "next/image";
import styles from "./shoppingcart.module.css";
import eyeoff from "@/app/Public/Images/tabler-icon-eye-off.svg";

interface AuthInputProps {
  label: string;
  type?: "text" | "password" | "email";
  isPassword?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const AuthInput = ({
  label,
  type = "text",
  isPassword,
  value,
  onChange,
}: AuthInputProps) => (
  <div className={isPassword ? styles.frameDiv : styles.eMailWrapper}>
    <div className={styles.frameParent}>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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