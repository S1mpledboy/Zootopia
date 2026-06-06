"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./orderDetail.module.css";

const STATUS_MAP = {
  IN_PROGRESS: { label: "W trakcie",  color: "#fde68a" },
  SHIPPED:     { label: "Wysłane",    color: "#93c5fd" },
  CANCELLED:   { label: "Anulowane", color: "#fca5a5" },
  COMPLETED:   { label: "Ukończone", color: "#b0d898" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatPrice(amount) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { router.push("/login"); return; }
        if (res.status === 404) { setError("Nie znaleziono zamówienia."); return; }
        if (!res.ok) throw new Error("Błąd pobierania zamówienia");
        setOrder(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonBody} />
    </div>
  );

  if (error) return (
    <div className={styles.page}>
      <p className={styles.error}>{error}</p>
    </div>
  );

  const status = STATUS_MAP[order.status] ?? { label: order.status, color: "#e0e0e0" };

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.back} onClick={() => router.push("/orders")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Wróć do listy
      </button>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.orderNumber}>Zamówienie nr {order.orderNumber}</h1>
          <span className={styles.date}>{formatDate(order.createdAt)}</span>
        </div>
        <span className={styles.badge} style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>

      <div className={styles.grid}>
        {/* Items */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Produkty</h2>
          <div className={styles.itemsList}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQty}>× {item.quantity}</span>
                <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className={styles.total}>
              <span>Łącznie</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </section>


        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Adres dostawy</h2>
          <div className={styles.addressBlock}>
            <p>{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</p>
            <p>{order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</p>
            <p>{order.deliveryAddress.country}</p>
            <p className={styles.addressMeta}>{order.deliveryAddress.phone}</p>
            <p className={styles.addressMeta}>{order.deliveryAddress.email}</p>
          </div>
        </section>


        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Dostawa i płatność</h2>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Metoda dostawy</span>
            <span className={styles.metaVal}>{order.shippingMethod}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Metoda płatności</span>
            <span className={styles.metaVal}>{order.paymentMethod}</span>
          </div>
        </section>


        {order.invoiceData?.nip && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dane do faktury</h2>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Firma</span>
              <span className={styles.metaVal}>{order.invoiceData.companyName}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>NIP</span>
              <span className={styles.metaVal}>{order.invoiceData.nip}</span>
            </div>
          </section>
        )}


        {order.notes && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Uwagi</h2>
            <p className={styles.notes}>{order.notes}</p>
          </section>
        )}
      </div>
    </div>
  );
}