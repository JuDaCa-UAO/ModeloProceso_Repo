import type { Stage } from "@domain/content/Stage";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "./StageCover.module.css";

export default function StageCover({ stage, resolver }: { stage: Stage; resolver: IMediaResolver }) {
  const avatar = resolver.resolve(stage.cover.laiaAvatar);
  const watermark = String(stage.order).padStart(2, "0");

  return (
    <section
      id={stage.id}
      className={styles.cover}
      style={{ "--stage-accent": stage.accent.main, "--stage-chip": stage.accent.chip } as React.CSSProperties}
    >
      <div className={styles.watermark} aria-hidden>
        {watermark}
      </div>
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <div className={styles.eyebrow}>
            <span className={styles.badge}>{stage.cover.badgeLabel}</span>
            <span className={styles.chapterLabel}>{stage.cover.chapterLabel}</span>
          </div>
          <h1 className={styles.title}>{stage.cover.title}</h1>
          <p className={styles.description}>{stage.cover.description}</p>
          <div className={styles.tags}>
            {stage.cover.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarCircle}>
            {avatar.available && avatar.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- círculo con object-fit:contain, sin ratio fijo conocido
              <img
                src={avatar.url}
                alt="LaIA"
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6%" }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
