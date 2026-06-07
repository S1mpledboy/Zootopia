'use client';

import React, { useState, useEffect } from 'react';
import ImageNext from 'next/image';
import styles from './dodaj.module.css';

import aparat from '@/app/Public/Images/aparat.svg';
import add from '@/app/Public/Images/+icon.svg';
import zdj from '@/app/Public/Images/zdjicon.svg';
import close from '@/app/Public/Images/Xicon.svg';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData?: any; 
  allCategories?: any[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productData, allCategories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    promoPrice: '',
    description: '',
    ingredients: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        brand: productData.companyName || '',
        category: productData.petCategoryId || '',
        price: productData.price || '',
        promoPrice: productData.promoPrice || '',
        description: productData.description || '',
        ingredients: productData.ingredients || '',
        additionalInfo: productData.additionalInfo || ''
      });
    } else {
      setFormData({
        name: '', brand: '', category: '', price: '', promoPrice: '', description: '', ingredients: '', additionalInfo: ''
      });
    }
  }, [productData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Zapisywanie danych: ", formData);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}
      onClick={onClose}
    >
      <div 
        className={styles.dodajProduktNieskoczone} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dodajProduktParent}>
          
          {/* Nagłówek okna */}
          <div className={styles.vectorParent1}>
            <div className={styles.dodajProdukt}>
              {productData ? 'Edytuj produkt' : 'Dodaj produkt'}
            </div>
            <ImageNext src={close} className={styles.vectorIcon1} width={14} height={14} alt="Zamknij" onClick={onClose} />
          </div>

          <div className={styles.frameParent}>
            <div className={styles.frameGroup}>
              <div className={styles.frameContainer}>
                
                {/* Pierwsza linia: Marka i Kategoria */}
                <div className={styles.frameParent1}>
                  <div className={styles.tagParent2}>
                    <div className={styles.marka}>Marka</div>
                    <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Wpisz markę" />
                  </div>
                  <div className={styles.tagParent2}>
                    <div className={styles.marka}>Kategoria</div>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Wybierz...</option>
                      {allCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Druga linia: Tagi */}
                <div className={styles.frameParent2}>
                  <div className={styles.tagParent}>
                    <div className={styles.marka}>TAG</div>
                    <ImageNext src={add} className={styles.vectorIcon2} width={14} height={14} alt="Dodaj tag" />
                  </div>
                  <div className={styles.frameChild} />
                </div>

                {/* Trzecia linia: Ceny */}
                <div className={styles.frameParent3}>
                  <div className={styles.tagParent2}>
                    <div className={styles.marka}>Cena (PLN)</div>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className={styles.tagParent2}>
                    <div className={styles.marka}>Cena promocyjna</div>
                    <input type="number" name="promoPrice" value={formData.promoPrice} onChange={handleChange} placeholder="0.00" />
                  </div>
                </div>

              </div>

              {/* Sekcja grafiki */}
              <div className={styles.dodajGrafikeParent}>
                <div className={styles.marka}>Dodaj grafikę</div>
                <ImageNext src={aparat} className={styles.vectorIcon3} width={19} height={18} alt="Aparat" />
              </div>
            </div>

            <div className={styles.frameParent5}>
              <div className={styles.vectorWrapper}><ImageNext src={zdj} className={styles.vectorIcon4} width={30} height={30} alt="Zdj" /></div>
              <div className={styles.vectorWrapper}><ImageNext src={zdj} className={styles.vectorIcon4} width={30} height={30} alt="Zdj" /></div>
              <div className={styles.vectorWrapper}><ImageNext src={zdj} className={styles.vectorIcon4} width={30} height={30} alt="Zdj" /></div>
            </div>
          </div>

          {/* Pola tekstowe */}
          <div className={styles.frameParent6}>
            <div className={styles.nazwaWrapper}>
              <div className={styles.marka}>Nazwa</div>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa produktu" />
            </div>
            <div className={styles.nazwaWrapper}>
              <div className={styles.marka}>Opis</div>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className={styles.nazwaWrapper}>
              <div className={styles.marka}>Składniki*</div>
              <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} />
            </div>
            <div className={styles.nazwaWrapper}>
              <div className={styles.marka}>Dodatkowe informacje</div>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
            </div>
          </div>

          {/* Przycisk akcji */}
          <div className={styles.doKasyWrapper}>
            <div className={styles.doKasy} onClick={handleSave} style={{ cursor: 'pointer' }}>
              <div className={styles.vectorParent}>
                <ImageNext src={add} width={14} height={14} alt="" />
                <div className={styles.dodajProdukt2}>
                  {productData ? 'ZAPISZ ZMIANY' : 'DODAJ PRODUKT'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;