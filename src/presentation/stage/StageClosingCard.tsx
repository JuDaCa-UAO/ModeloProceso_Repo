/**
 * PRESENTATION — Server Component
 *
 * Tarjeta de cierre de etapa ("CierreEtapa" del diseño): badge + LaIA con
 * mensaje + video-resumen (controles manuales) + pausa de reflexión + (solo
 * en el cierre cíclico) nota final + botón continuar.
 */
import type { StageClosing } from "@domain/content/StageClosing";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import AccessibleVideoPlayer from "@/presentation/video/AccessibleVideoPlayer";
import ReflectionAndContinue from "@/presentation/reflection/ReflectionAndContinue";
import styles from "./StageClosingCard.module.css";

export default function StageClosingCard({
  closing,
  stageNumber,
  resolver,
}: {
  closing: StageClosing;
  stageNumber: string;
  resolver: IMediaResolver;
}) {
  const video = resolver.resolve(closing.summaryVideo);
  const avatar = resolver.resolve(closing.laiaAvatar);

  return (
    <section
      data-reveal
      className={styles.panel}
      style={{ "--accent": closing.accent.main, "--soft": closing.accent.soft } as React.CSSProperties}
    >
      <div className={styles.header}>
        <span className={styles.badge}>CIERRE · ETAPA {stageNumber}</span>
        <h2 className={styles.title}>{closing.title}</h2>
      </div>
      <div className={styles.body}>
        <div className={styles.laiaCol}>
          <div className={styles.avatarFrame}>
            {avatar.available && avatar.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- círculo con object-fit:contain
              <img src={avatar.url} alt="LaIA" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "0%" }} />
            ) : null}
          </div>
          <span className={styles.laiaBadge}>LaIA</span>
        </div>
        <div className={styles.mainCol}>
          <p className={styles.message}>{closing.message}</p>
          {video.available && video.url ? (
            <AccessibleVideoPlayer url={video.url} accent={closing.accent.main} captionsAvailable={Boolean(video.captions?.length)} />
          ) : (
            <p>{video.fallback}</p>
          )}
        </div>
      </div>

      <ReflectionAndContinue question={closing.question} accent={closing.accent.main} stageNumber={stageNumber}>
        {closing.final ? (
          <div className={styles.finalPanel}>
            <h3 className={styles.finalTitle}>La espiral da una nueva vuelta</h3>
            <p className={styles.finalNote}>{closing.finalNote}</p>
          </div>
        ) : null}
      </ReflectionAndContinue>
    </section>
  );
}
