/**
 * PRESENTATION — ToastStack
 *
 * Lista de notificaciones tipo toast en posición fija top-right,
 * ubicadas debajo del StageViewer widget cuando está presente.
 *
 * Uso desde StageClient:
 *   const { toasts, pushToast } = useToasts();
 *   <ToastStack toasts={toasts} />
 *
 * Cada toast se auto-descarta a los 3.5s. El usuario también puede
 * cerrarlo manualmente.
 */

"use client";

import styles from "./ToastStack.module.css";

export interface Toast {
  id: number;
  text: string;
}

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (!toasts.length) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <span className={styles.toastText}>{t.text}</span>
          <button
            className={styles.closeBtn}
            onClick={() => onDismiss(t.id)}
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
