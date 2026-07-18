import type { Stage } from "@domain/content/Stage";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import EtapasSpiralNavPanel from "./EtapasSpiralNavPanel";
import styles from "./EtapasSpiralNavSection.module.css";

/**
 * Navegación por las 6 etapas mediante la espiral 3D interactiva (reemplaza el
 * antiguo teaser de tarjetas `TeaserEtapasSection`). La espiral es la
 * navegación primaria: girar el modelo y hacer clic en una etapa hace scroll a
 * `#etapa-N` en la misma página (vía `useHashNavigation`).
 *
 * Debajo se conserva una lista de enlaces accesibles (misma ancla `#etapa-N`)
 * como respaldo para teclado, lectores de pantalla y `prefers-reduced-motion`,
 * ya que un canvas WebGL no es navegable por esos medios.
 */
export default function EtapasSpiralNavSection({ stages, resolver }: { stages: Stage[]; resolver: IMediaResolver }) {
  const avatar1 = resolver.resolve(mediaKey("laia.pose.explaining"));
  const avatar2 = resolver.resolve(mediaKey("laia.pose.triumphant"));

  const navigationSteps = [
    {
      id: "nav-laia-1",
      text: "¡Hola! Con este modelo en espiral interactivo puedes explorar y dirigirte a cualquiera de las 6 etapas de inmediato. Solo arrastra la espiral para girarla y haz clic en la etapa que desees explorar.",
      avatarUrl: avatar1.available ? avatar1.url : null,
      avatarFallback: avatar1.fallback,
    },
    {
      id: "nav-laia-2",
      text: "Además, si estás leyendo una etapa y deseas volver a este menú rápidamente, puedes presionar el botón 'Seleccionar una etapa distinta' que siempre verás abajo a la derecha de tu pantalla.",
      avatarUrl: avatar2.available ? avatar2.url : null,
      avatarFallback: avatar2.fallback,
    },
  ];

  return (
    <section
      id="navegacion-etapas"
      data-reveal
      data-screen-label="Navegación por etapas"
      className={styles.section}
    >
      <EtapasSpiralNavPanel stages={stages} navigationSteps={navigationSteps} />
    </section>
  );
}
