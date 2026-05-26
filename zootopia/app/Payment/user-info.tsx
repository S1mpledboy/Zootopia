"use client"; 

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from './user-info.module.css'; 

const FormularzPlatnosci: NextPage = () => {
  // 1. Stan formularza
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'Polska',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    companyName: '',
    nip: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👇 TUTAJ WSKOCZYŁ TEN NOWY POPRAWIONY BLOK 👇
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me'); 
        
        if (response.ok) {
          const resJson = await response.json();
          
          // 🔥 Wyciągamy obiekt użytkownika niezależnie od formatu API
          const user = resJson.data ? resJson.data : resJson;
          
          // Sprawdzamy, czy obiekt ma chociaż jedno pole z bazy (np. email lub _id)
          if (user && (user.email || user._id)) {
            setIsLoggedIn(true);
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              country: user.country || 'Polska',
              street: user.street || '',
              city: user.city || '',
              postalCode: user.postalCode || '',
              phone: user.phone || '',
              email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  // 👆 KONIEC NOWEGO BLOKU 👆

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku}>Ładowanie danych...</div>;
  }

  return (
    <div className={styles.produktyWKoszyku}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.imiWrapper}>
              <input type="text" name="firstName" placeholder="Imię" value={formData.firstName} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="lastName" placeholder="Nazwisko" value={formData.lastName} onChange={handleChange} className={styles.imi} />
            </div>
          </div>
          <div className={styles.polskaWrapper}>
            <input type="text" name="country" placeholder="Kraj" value={formData.country} onChange={handleChange} className={styles.imi} />
          </div>
          <div className={styles.polskaWrapper}>
            <input type="text" name="street" placeholder="Ulica i numer" value={formData.street} onChange={handleChange} className={styles.imi} />
          </div>
          <div className={styles.frameDiv}>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="city" placeholder="Miasto" value={formData.city} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.kodPocztowyWrapper}>
              <input type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} onChange={handleChange} className={styles.imi} />
            </div>
          </div>
          <div className={styles.frameParent2}>
            <div className={styles.telefonWrapper}>
              <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.eMailWrapper}>
              <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className={styles.imi} />
            </div>
          </div>
        </div>
        
        <div className={styles.rectangleGroup}>
          <input type="checkbox" className={styles.frameChild} id="invoice" />
          <label htmlFor="invoice" className={styles.stworzyKonto}>Faktura</label>
        </div>
      </div>
    </div>
  );
};

export default FormularzPlatnosci;