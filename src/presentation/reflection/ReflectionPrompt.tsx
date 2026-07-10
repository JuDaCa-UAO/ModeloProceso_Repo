/**
 * PRESENTATION — Server Component
 *
 * "Pausa para reflexionar": pregunta + textarea opcional (sin envío ni
 * persistencia — es un espacio de anotación personal, igual que en el
 * diseño). Sin estado propio: no necesita ser Client Component.
 */
import styles from "./ReflectionPrompt.module.css";

export default function ReflectionPrompt({ question, accent }: { question: string; accent: string }) {
  return (
    <div className={styles.box} style={{ "--accent": accent } as React.CSSProperties}>
      <span className={styles.label}>PAUSA PARA REFLEXIONAR</span>
      <p className={styles.question}>{question}</p>
      <textarea className={styles.textarea} placeholder="Si quieres, anota aquí tu reflexión (opcional)" />
    </div>
  );
}
