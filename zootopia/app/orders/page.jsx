"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./orders.module.css";
import OrderDetailModal from "@/Components/OrderModal/OrderModal";
import { useAuth } from "@/app/context/AuthContext";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

const STATUS_LABELS = {
  IN_PROGRESS: "W REALIZACJI",
  SHIPPED:     "WYSŁANE",
  CANCELLED:   "ANULOWANE",
};

const STATUS_COLORS = {
  IN_PROGRESS: styles.statusInProgress,
  SHIPPED:     styles.statusShipped,
  CANCELLED:   styles.statusCancelled,
};

function formatDate(dateStr) {
  if (!dateStr) return "---";
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const { logout } = useAuth();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading]   = useState(false);
  const router = useRouter();

  /* ── POBIERANIE LISTY ZAMÓWIEŃ ─────────────────────── */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/Auth"); return; }

      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { router.push("/Auth"); return; }
        if (!res.ok) throw new Error("Nie udało się pobrać zamówień");
        setOrders(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  /* ── OTWIERANIE MODALA ─────────────────────────────── */
  const openOrder = useCallback(async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/Auth"); return; }

    setModalLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Nie udało się pobrać szczegółów zamówienia");
      setSelectedOrder(await res.json());
    } catch (err) {
      alert(err.message);
    } finally {
      setModalLoading(false);
    }
  }, [router]);

  const closeModal = useCallback(() => setSelectedOrder(null), []);

  /* ── RENDER ────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ── LEWE MENU (identyczne z mojeKonto) ───────── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitle}>Moje konto</div>
              <div className={styles.sidebarDivider} />
            </div>

            <div className={styles.menuList}>
              <Link href="/MojeKonto" className={styles.menuItem}>
                <span>Moje dane</span>
                <Image src={arrow} width={24} height={24} alt="" />
              </Link>
              <div className={styles.menuDivider} />

              <Link href="/Liked" className={styles.menuItem}>
                <span>Lista ulubionych</span>
                <Image src={arrow} width={24} height={24} alt="" />
              </Link>
              <div className={styles.menuDivider} />

              <div className={styles.menuItem}>
                <span>Moje zgody</span>
                <Image src={arrow} width={24} height={24} alt="" />
              </div>
              <div className={styles.menuDivider} />

              <div
                className={styles.menuItem}
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                <span>Wyloguj się</span>
                <Image src={arrow} width={24} height={24} alt="" />
              </div>
              <div className={styles.menuDivider} />

              {/* Historia zamówień — aktywna */}
              <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
                <span>Historia zamówień</span>
                <Image src={arrow} width={24} height={24} alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* ── PRAWA STRONA ─────────────────────────────── */}
        <div className={styles.content}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/MojeKonto" className={styles.breadcrumbLink}>Moje konto</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span>Historia zamówień</span>
          </div>

          <h1 className={styles.pageTitle}>Historia zamówień</h1>
          <div className={styles.titleDivider} />

          {/* STANY */}
          {loading && (
            <div className={styles.stateContainer}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          )}

          {error && (
            <div className={styles.stateContainer}>
              <div className={styles.errorBox}>
                <span className={styles.errorIcon}>!</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className={styles.stateContainer}>
              <div className={styles.emptyBox}>
                <p className={styles.emptyTitle}>Brak zamówień</p>
                <p className={styles.emptyDesc}>Twoja historia zamówień jest pusta.</p>
              </div>
            </div>
          )}

          {/* LISTA ZAMÓWIEŃ */}
          {!loading && !error && orders.length > 0 && (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderRow}>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderNumber}>
                      Zamówienie nr <strong>{order.orderNumber}</strong>
                    </div>
                    <div className={styles.orderMeta}>
                      {formatDate(order.createdAt)} · {order.items?.length} produkt(y) · {order.totalAmount?.toFixed(2)} zł
                    </div>
                  </div>

                  <div className={styles.orderRight}>
                    <span className={`${styles.statusBadge} ${STATUS_COLORS[order.status] || ""}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => openOrder(order._id)}
                      disabled={modalLoading}
                    >
                      SZCZEGÓŁY ›
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
}