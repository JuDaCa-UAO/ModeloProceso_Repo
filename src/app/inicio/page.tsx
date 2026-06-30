import Image from "next/image";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import { BRAND } from "@/config/brand";
import styles from "./inicio.module.css";
import ActionButtons from "./ActionButtons";

export default function InicioPage() {
  return (
    <div className={styles.stage}>
      <TechTrailBackground
        className={styles.techBackground}
        backgroundImageSrc="/ui/uao-hero-img_2.webp"
        backgroundImageOpacity={1}
      />

      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.cardRing} />

          <header className={styles.headerPlate}>
            <div className={styles.logoContainer}>
              <Image
                src="/ui/uao-logo-red.webp"
                alt={`Logo ${BRAND.institution}`}
                width={140}
                height={70}
                className={styles.logoImg}
                priority
              />
            </div>
            <h1 className={styles.title}>{BRAND.shortName}</h1>
            <p className={styles.subtitle}>{BRAND.fullName}</p>
          </header>

          <div className={styles.content}>
            <div className={styles.avatarCol}>
              <div className={styles.avatarFrame}>
                <Image
                  src="/ui/laia.png"
                  alt="Personaje (LaIA)"
                  fill
                  unoptimized
                  className={styles.avatarImg}
                />
              </div>
            </div>

            {/* ✅ TODOS los botones en el mismo bloque/estilo */}
            <ActionButtons />
          </div>

          <footer className={styles.footer}>
            <span className={styles.tipBadge}>LaIA</span>
            <span>
              Yo seré la asistente especializada que se encargará de guiarte a través de esta aventura tecnológica de aprendizaje sobre IA.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}
