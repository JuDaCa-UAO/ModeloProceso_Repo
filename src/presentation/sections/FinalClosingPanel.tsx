import type { FinalClosing } from "@domain/content/Cartilla";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "./FinalClosingPanel.module.css";

export default function FinalClosingPanel({ closing, resolver }: { closing: FinalClosing; resolver: IMediaResolver }) {
  const avatar = resolver.resolve(closing.laiaAvatar);

  return (
    <section data-reveal data-screen-label="Cierre" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.textCol}>
          <h2 className={styles.title}>{closing.title}</h2>
          <p className={styles.message}>{closing.message}</p>
          <p className={styles.note}>{closing.note}</p>
        </div>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarFrame}>
            {avatar.available && avatar.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- sin ratio fijo conocido
              <img src={avatar.url} alt="LaIA" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
