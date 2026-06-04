"use client";

import { useRouter } from "next/navigation";
import styles from "./OrderCard.module.css";

const STATUS_MAP = {
  IN_PROGRESS: { label: "W trakcie", className: "statusInProgress" },
  SHIPPED: { label: "Wysłane", className: "statusShipped" },
  CANCELLED: { label: "Anulowane", className: "statusCancelled" },
  COMPLETED: { label: "Ukończone", className: "statusCompleted" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(amount) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

export default function OrderCard({ order }) {
  const router = useRouter();
  const status = STATUS_MAP[order.status] ?? { label: order.status, className: "statusInProgress" };

  return (
    <div className={styles.card}>
      <div className={styles.main}>
        {/* Left: order info */}
        <div className={styles.info}>
          <div className={styles.topRow}>
            <b className={styles.orderNumber}>
              Zamówienie nr {order.orderNumber}
            </b>
            <span className={`${styles.statusBadge} ${styles[status.className]}`}>
              {status.label}
            </span>
          </div>

          <div className={styles.metaGrid}>
            <span className={styles.metaLabel}>Data zamówienia</span>
            <span className={styles.metaLabel}>Koszt całkowity</span>
            <b className={styles.metaValue}>{formatDate(order.createdAt)}</b>
            <b className={styles.metaValue}>{formatPrice(order.totalAmount)}</b>
          </div>
        </div>

        {/* Right: details link */}
        <button
          className={styles.detailsBtn}
          onClick={() => router.push(`/orders/${order._id}`)}
        >
          <span>SZCZEGÓŁY</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}