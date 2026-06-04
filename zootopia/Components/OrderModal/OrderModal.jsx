"use client";

import { useEffect, useRef } from "react";
import styles from "./OrderModal.module.css";

const STATUS_LABELS = {
  IN_PROGRESS: "W REALIZACJI",
  SHIPPED: "WYSŁANE",
  CANCELLED: "ANULOWANE",
};

const STATUS_COLORS = {
  IN_PROGRESS: styles.statusInProgress,
  SHIPPED: styles.statusShipped,
  CANCELLED: styles.statusCancelled,
};

const PAYMENT_LABELS = {
  blik: "BLIK",
  p24: "Przelewy24",
  przelew: "PRZELEW",
  odbior: "Płatność przy odbiorze",
};

const SHIPPING_LABELS = {
  inpost: "InPost Kurier",
  dhl: "DHL",
  paczkomat: "InPost Paczkomat",
};

function formatDate(dateStr) {
  if (!dateStr) return "---";
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export default function OrderDetailModal({ order, onClose }) {
  const overlayRef = useRef(null);

  // Zamknięcie po kliknięciu w tło
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Zamknięcie po ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!order) return null;

  const shippingCost = 9.99;
  const itemsTotal = order.totalAmount - shippingCost;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* NAGŁÓWEK */}
        <div className={styles.modalHeader}>
          <div className={styles.orderTitle}>
            <span className={styles.orderLabel}>ZAMÓWIENIE NR {order.orderNumber}</span>
            <span className={`${styles.statusBadge} ${STATUS_COLORS[order.status] || ""}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.downloadBtn} title="Pobierz zamówienie" aria-label="Pobierz">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Zamknij">✕</button>
          </div>
        </div>

        <div className={styles.divider} />

        {/* SIATKA INFORMACJI */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>DATA ZAMÓWIENIA</span>
            <span className={styles.infoValue}>{formatDate(order.createdAt)}</span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>DATA ZAKOŃCZENIA</span>
            <span className={styles.infoValue}>
              {order.status === "SHIPPED" || order.status === "CANCELLED"
                ? formatDate(order.updatedAt)
                : "---"}
            </span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>SPOSÓB PŁATNOŚCI</span>
            <span className={styles.infoValue}>
              {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod?.toUpperCase() || "---"}
            </span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>NUMER FAKTURY</span>
            <span className={styles.infoValue}>
              {order.invoiceData?.nip ? `FV${order.orderNumber}` : "---"}
            </span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>KOSZT CAŁKOWITY</span>
            <span className={styles.infoValue}>{order.totalAmount?.toFixed(2)} ZŁ</span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>KOSZT DOSTAWY</span>
            <span className={styles.infoValue}>{shippingCost.toFixed(2)} ZŁ</span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>OSOBA PRYWATNA</span>
            <span className={styles.infoValue}>
              {order.deliveryAddress
                ? `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`
                : "---"}
            </span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>ADRES</span>
            <span className={styles.infoValue}>
              {order.deliveryAddress
                ? `${order.deliveryAddress.street}, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
                : "---"}
            </span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>SPOSÓB DOSTAWY</span>
            <span className={styles.infoValue}>
              {SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod?.toUpperCase() || "---"}
            </span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>FIRMA</span>
            <span className={styles.infoValue}>{order.invoiceData?.companyName || "---"}</span>
          </div>
          <div className={styles.infoCell}>
            <span className={styles.infoLabel}>NIP</span>
            <span className={styles.infoValue}>{order.invoiceData?.nip || "---"}</span>
          </div>
          <div className={styles.infoCell} />
        </div>

        <div className={styles.divider} />

        {/* PRODUKTY */}
        <div className={styles.itemsSection}>
          <span className={styles.infoLabel}>ZAMÓWIENIE:</span>
          <div className={styles.itemsList}>
            {order.items?.map((item, idx) => (
              <div key={idx} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemBrand}>
                    {item.name?.split(" ")[0]?.toUpperCase()}
                  </span>
                  <span className={styles.itemName}>{item.name}</span>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemQty}>x {item.quantity}</span>
                  <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} ZŁ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}