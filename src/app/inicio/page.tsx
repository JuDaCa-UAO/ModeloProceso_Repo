import Image from "next/image";
import styles from "./inicio.module.css";
import ActionButtons from "./ActionButtons";
import { BRAND } from "@/config/brand";

export default function InicioPage() {
  return (
    <div className={styles.stage}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.headerPlate}>
            <Image
              src="/uao-logo-red.webp"
              alt={BRAND.institution}
              width={180}
              height={56}
              className={styles.logo}
              priority
            />
            <h1 className={styles.title}>{BRAND.fullName}</h1>
          </header>

          <div className={styles.content}>
            <div className={styles.avatarCol}>
              <div className={styles.avatarFrame}>
                <Image
                  src="/ui/laia.png"
                  alt="Personaje (Laia)"
                  fill
                  unoptimized
                  className={styles.avatarImg}
                />
              </div>
            </div>

            <ActionButtons />
          </div>

          <footer className={styles.footer}>
            <span className={styles.tipBadge}>Laia</span>
            <span>
              Yo seré la asistente especializada que se encargará de guiarte a través de esta experiencia de aprendizaje sobre IA.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}
