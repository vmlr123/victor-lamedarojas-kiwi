import { useEffect, useRef } from "react";
import styles from "./Toast.module.css";

export default function Toast({
  message,
  type = "info",
  duration = 1000,
  onClose,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!message) return;
    // focus the toast so screen readers announce it
    if (ref.current) ref.current.focus();
    const t = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const role = type === "error" ? "alert" : "status";

  return (
    <div
      ref={ref}
      className={`${styles.toast} ${styles[type] || ""}`}
      role={role}
      tabIndex={-1}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div className={styles.content}>{message}</div>
      <button
        className={styles.close}
        aria-label="Dismiss notification"
        onClick={() => onClose && onClose()}
      >
        ×
      </button>
    </div>
  );
}
