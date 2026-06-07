'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  onSave: (product: any, isEdit: boolean) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  productData, 
  allCategories = [],
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: '', // Na backendzie zmapujemy to jako 'company'
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
        brand: productData.company || productData.companyName || '',
        category: productData.category || productData.petCategoryId || '',
        price: productData.price ? String(productData.price) : '',
        promoPrice: productData.promoPrice ? String(productData.promoPrice) : '',
        description: productData.description || '',
        ingredients: productData.ingredients || '',
        additionalInfo: productData.additionalInfo || ''
      });
      setImagePreview(productData.image || (productData.images && productData.images[0]) || '');
    } else {
      setFormData({
        name: '', brand: '', category: '', price: '', promoPrice: '', description: '', ingredients: '', additionalInfo: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
    setFormError('');
  }, [productData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;
    const dataForm = new FormData();
    dataForm.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: dataForm });
    if (!res.ok) throw new Error("Błąd uploadu zdjęcia");
    const data = await res.json();
    return data.url;
  }

  const handleSaveClick = async () => {
    setFormError('');
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      setFormError('Wypełnij wymagane pola (Nazwa, Marka, Kategoria, Cena).');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imagePreview;

      // Jeśli wybrano nowy plik, najpierw wrzucamy go na serwer
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
        image: finalImageUrl,
        images: finalImageUrl ? [finalImageUrl] : []
      };

      await onSave(payload, !!productData);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Wystąpił błąd podczas zapisywania produktu.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className={styles.dodajProduktNieskoczone} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dodajProduktParent}>
          
          <div className={styles.vectorParent1}>
            <div className={styles.dodajProdukt}>
              {productData ? 'Edytuj produkt' : 'Dodaj produkt'}
            </div>
            <ImageNext src={close} className={styles.vectorIcon1} width={14} height={14} alt="Zamknij" onClick={onClose} />
          </div>

          {formError && <div style={{ color: '#ef4444', padding: '0 24px', fontSize: '14px', fontWeight: 'bold' }}>{formError}</div>}

          <div className={styles.frameParent}>
            <div className={styles.frameGroup}>
              <div className={styles.frameContainer}>
                
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

                <div className={styles.frameParent2}>
                  <div className={styles.tagParent}>
                    <div className={styles.marka}>TAG</div>
                    <ImageNext src={add} className={styles.vectorIcon2} width={14} height={14} alt="Dodaj tag" />
                  </div>
                  <div className={styles.frameChild} />
                </div>

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

              {/* Ukryty input i strefa klikalna dla przesyłania grafiki */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              
              <div 
                className={styles.dodajGrafikeParent} 
                onClick={() => fileInputRef.current?.click()} 
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.marka}>Dodaj grafikę</div>
                <ImageNext src={aparat} className={styles.vectorIcon3} width={19} height={18} alt="Aparat" />
              </div>
            </div>

            <div className={styles.frameParent5}>
              {imagePreview ? (
                <div className={styles.vectorWrapper} style={{ overflow: 'hidden', position: 'relative' }}>
                  <img src={imagePreview} alt="Podgląd" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div className={styles.vectorWrapper}><ImageNext src={zdj} className={styles.vectorIcon4} width={30} height={30} alt="Zdj" /></div>
              )}
            </div>
          </div>

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

          <div className={styles.doKasyWrapper}>
            <div 
              className={styles.doKasy} 
              onClick={isSubmitting ? undefined : handleSaveClick} 
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
            >
              <div className={styles.vectorParent}>
                <ImageNext src={add} width={14} height={14} alt="" />
                <div className={styles.dodajProdukt2}>
                  {isSubmitting ? 'TRWA ZAPISYWANIE...' : productData ? 'ZAPISZ ZMIANY' : 'DODAJ PRODUKT'}
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