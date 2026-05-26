"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './user-info.module.css';

const FormularzPlatnosci: NextPage = () => {
  const router = useRouter();
  
  // Główny stan formularza adresowego
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
    notes: '',
    shippingCountry: 'Polska',
    shippingStreet: '',
    shippingCity: '',
    shippingPostalCode: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Stany dla checkboxów rozwijających sekcje dodatkowe
  const [createAccount, setCreateAccount] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showOtherAddress, setShowOtherAddress] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Pobieramy token z pamięci przeglądarki
        const token = localStorage.getItem('token');
        
        // Wysyłamy zapytanie do API z nagłówkiem autoryzacji Bearer
        const response = await fetch('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); 
        
        if (response.ok) {
          const resJson = await response.json();
          const user = resJson.data ? resJson.data : resJson;
          
          // Jeśli baza zwróciła poprawnego użytkownika
          if (user && (user.email || user._id)) {
            setIsLoggedIn(true); // Użytkownik jest zalogowany
            
            // Wstrzykujemy dane z MongoDB bezpośrednio do stanów pól tekstowych
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              country: user.country || 'Polska',
              street: user.street || '',
              city: user.city || '',
              postalCode: user.postalCode || '',
              phone: user.phone || '',
              email: user.email || '',
              companyName: user.companyName || '',
              nip: user.nip || ''
            }));
          }
        } else {
          // Status 401 lub inny oznacza brak zalogowania (użytkownik to gość)
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych z MongoDB:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Funkcja aktualizująca stan w czasie rzeczywistym podczas pisania
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Obsługa przekierowania do podstrony logowania
  const handleLoginRedirect = () => {
    router.push('/Auth');
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku}>Pobieranie profilu klienta z bazy...</div>;
  }

  return (
    <div className={styles.produktyWKoszyku}>
      
      {/* NAGŁÓWEK SEKCI */}
      <div className={styles.metodyDostawyParent}>
        <div className={styles.metodyDostawy}>Dane płatności:</div>
        <div className={styles.lineDivider} />
      </div>

      <div className={styles.frameParent}>
        
        {/* LEWA KOLUMNA FORMULARZA */}
        <div className={styles.frameGroup}>
          
          {/* Imię i Nazwisko */}
          <div className={styles.frameContainer}>
            <div className={styles.imiWrapper}>
              <input type="text" name="firstName" placeholder="Imię" value={formData.firstName} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="lastName" placeholder="Nazwisko" value={formData.lastName} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          {/* Kraj */}
          <div className={styles.polskaWrapper}>
            <input type="text" name="country" placeholder="Polska" value={formData.country} onChange={handleChange} className={styles.imi} />
          </div>

          {/* Ulica i numer */}
          <div className={styles.polskaWrapper}>
            <input type="text" name="street" placeholder="Ulica i numer" value={formData.street} onChange={handleChange} className={styles.imi} />
          </div>

          {/* Miasto i Kod pocztowy */}
          <div className={styles.frameDiv}>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="city" placeholder="Miasto" value={formData.city} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.kodPocztowyWrapper}>
              <input type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          {/* Telefon i E-mail */}
          <div className={styles.frameParent2}>
            <div className={styles.telefonWrapper}>
              <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.eMailWrapper}>
              <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          {/* CHECKBOX: Stworzyć konto (Pokazuje się tylko gościom) */}
          {!isLoggedIn && (
            <div className={styles.rectangleParent}>
              <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} className={styles.frameChild} id="createAccount" />
              <label htmlFor="createAccount" className={styles.stworzyKonto}>Stworzyć konto?</label>
            </div>
          )}

          {/* CHECKBOX: Faktura */}
          <div className={styles.rectangleGroup}>
            <input type="checkbox" checked={showInvoice} onChange={(e) => setShowInvoice(e.target.checked)} className={styles.frameChild} id="invoice" />
            <label htmlFor="invoice" className={styles.stworzyKonto}>Faktura</label>
          </div>

          {/* DANE FAKTURY (Pokazywane warunkowo) */}
          {showInvoice && (
            <div className={styles.frameParent3}>
              <div className={styles.nazwaFirmyWrapper}>
                <input type="text" name="companyName" placeholder="Nazwa firmy" value={formData.companyName} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.nipWrapper}>
                <input type="text" name="nip" placeholder="NIP" value={formData.nip} onChange={handleChange} className={styles.imi} />
              </div>
            </div>
          )}

          {/* CHECKBOX: Wysyłka na inny adres */}
          <div className={styles.rectangleGroup}>
            <input type="checkbox" checked={showOtherAddress} onChange={(e) => setShowOtherAddress(e.target.checked)} className={styles.frameChild} id="otherAddress" />
            <label htmlFor="otherAddress" className={styles.stworzyKonto}>Wysyłka na inny adres</label>
          </div>

          {/* POLA INNEGO ADRESU (Pokazywane warunkowo) */}
          {showOtherAddress && (
            <div className={styles.frameGroup} style={{ gap: '14px' }}>
              <div className={styles.polskaWrapper}>
                <input type="text" name="shippingCountry" placeholder="Polska" value={formData.shippingCountry} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.polskaWrapper}>
                <input type="text" name="shippingStreet" placeholder="Ulica i numer" value={formData.shippingStreet} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.nazwiskoWrapper}>
                  <input type="text" name="shippingCity" placeholder="Miasto" value={formData.shippingCity} onChange={handleChange} className={styles.imi} />
                </div>
                <div className={styles.kodPocztowyWrapper}>
                  <input type="text" name="shippingPostalCode" placeholder="Kod pocztowy" value={formData.shippingPostalCode} onChange={handleChange} className={styles.imi} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PRAWA KOLUMNA: BLOK LOGOWANIA I UWAGI */}
        <div className={styles.frameParent6}>
          
          {/* 🔥 WARUNEK: Panel logowania wyświetli się WYŁĄCZNIE gościom (gdy isLoggedIn === false) */}
          {!isLoggedIn && (
            <div className={styles.frameWrapper}>
              <div className={styles.maszJuKontoParent}>
                <div>Masz już konto?</div>
                <div className={styles.zalogujSi} onClick={handleLoginRedirect}>
                  Zaloguj się
                </div>
              </div>
            </div>
          )}

          {/* Pole uwag do zamówienia */}
          <div className={styles.uwagiDoZamwieniaNpInfoWrapper}>
            <textarea 
              name="notes"
              placeholder="Uwagi do zamówienia, np. informacje o dostarczeniu przesyłki."
              value={formData.notes}
              onChange={handleChange}
              className={styles.uwagiDoZamwienia}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FormularzPlatnosci;