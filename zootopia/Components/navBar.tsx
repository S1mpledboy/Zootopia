"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import Image from "next/image";
import styles from '@/app/modulesCSS/navBar.module.css';
import logo from "@/app/Public/Images/ZOOTOPIA.svg";
import searchicon from "@/app/Public/Images/tabler-icon-search.svg";
import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import bagicon from "@/app/Public/Images/tabler-icon-shopping-bag.svg";
import usericon from "@/app/Public/Images/tabler-icon-user-circle.svg";
import Category from '@/Components/category';

import { useAuth } from "@/app/context/AuthContext";

interface ISearchProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

const Nawigacja: NextPage = () => {
  const { logout, user, refreshUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<ISearchProduct[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Status logowania
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    fetch('/api/auth/status', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.isLoggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Wyszukiwanie
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setProducts([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data);
            setIsOpen(data.length > 0);
          }
        })
        .catch((err) => console.error("Błąd wyszukiwania:", err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Zamknięcie po kliknięciu poza obszar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main>
      <div className={styles.nawigacja} style={{ overflow: 'visible' }}>
        <div className={styles.zootopiaWrapper}>
          <Link href="/">
            <Image src={logo} className={styles.zootopiaIcon} width={253.6} height={40} sizes="100vw" alt="" />
          </Link>
        </div>
        
        {/* Wyszukiwarka - wymuszone overflow visible */}
        <div 
          className={styles.szukajParent} 
          ref={searchContainerRef} 
          style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            overflow: 'visible', // Zapobiega obcinaniu dropdownu przez style rodzica
            zIndex: 999999
          }}
        >
          <input
            type="text"
            placeholder="Szukaj..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && products.length > 0 && setIsOpen(true)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              color: 'inherit',
              cursor: 'text'
            }}
          />
          <Image src={searchicon} className={styles.tablerIconSearch} width={24} height={24} sizes="100vw" alt="" />

          {/* Ostatecznie ostylowany Dropdown przebijający się przez CSS Modules */}
          {isOpen && products.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              left: '0px',
              width: '100%',
              minWidth: '280px', // Gwarantuje minimalną czytelną szerokość
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.25)',
              border: '1px solid #cbd5e1',
              zIndex: 9999999, // Ekstremalnie wysoki, by być nad wszystkim na stronie
              maxHeight: '350px',
              overflowY: 'auto',
              display: 'block'
            }}>
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/product/${product._id}`} 
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    background: '#ffffff'
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt="" 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} 
                    />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '6px', flexShrink: 0 }} />
                  )}
                  
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', textAlign: 'left' }}>
                      {product.name}
                    </span>
                    <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600, marginTop: '2px' }}>
                      {product.price} zł
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.frameParent}>
          <Link href={isLoggedIn ? "/Liked" : "/Auth"}>
            <div className={styles.tablerIconHeartParent}>
              <Image src={hearticon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Ulubione</div>
            </div>
          </Link>

          <Link href={isLoggedIn ? (user?.role === "admin" ? "/Admin" : "/MojeKonto") : "/Auth"}>
			<div className={styles.tablerIconHeartParent}>
				<Image src={usericon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
				<div className={styles.ulubione}>
				{isLoggedIn ? (user?.role === "admin" ? "Panel Admina" : "Moje konto") : "Zaloguj się"}
				</div>
			</div>
		</Link>

          <Link href="/Cart">
            <div className={styles.tablerIconHeartParent}>
              <Image src={bagicon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Koszyk</div>
            </div>
          </Link>
        </div>
      </div>
      <Category />
    </main>
  );
};

export default Nawigacja;