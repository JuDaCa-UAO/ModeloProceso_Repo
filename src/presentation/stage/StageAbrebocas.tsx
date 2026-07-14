/**
 * PRESENTATION — Server Component
 *
 * Abrebocas de apertura de una etapa: un video corto que se muestra tras la
 * portada y antes de LaIA. Deliberadamente sobrio —sin encabezado, badge ni
 * pie— para que el usuario lo reproduzca, lo observe y siga bajando sin
 * fricción. Reutiliza `AccessibleVideoPlayer` (reproducción manual con
 * sonido), el mismo reproductor del video-resumen de cierre.
 */
import AccessibleVideoPlayer from "@/presentation/video/AccessibleVideoPlayer";
import styles from "./StageAbrebocas.module.css";

export default function StageAbrebocas({ url, accent }: { url: string; accent: string }) {
  return (
    <div className={styles.wrap}>
      <AccessibleVideoPlayer url={url} accent={accent} caption={null} captionsAvailable={false} />
    </div>
  );
}
