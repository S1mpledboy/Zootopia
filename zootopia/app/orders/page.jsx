"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./orders.module.css";
import OrderCard from "@/Components/OrderCard/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Nie udało się pobrać zamówień");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Historia zamówień</h1>
        {!loading && !error && (
          <span className={styles.count}>{orders.length} zamówień</span>
        )}
      </div>

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
            <span className={styles.emptyIcon}>○</span>
            <p className={styles.emptyTitle}>Brak zamówień</p>
            <p className={styles.emptyDesc}>Twoja historia zamówień jest pusta.</p>
          </div>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}