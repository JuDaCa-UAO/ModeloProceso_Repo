"use client";

/**
 * LazyStageViewer — monta el visor 3D (`StageViewer`, un contexto WebGL) SOLO
 * cuando su contenedor está dentro (o cerca) del viewport, y lo desmonta cuando
 * se aleja. Así, aunque varios frames con espiral estén en el DOM a la vez,
 * solo hay un contexto WebGL activo, evitando el agotamiento de contextos
 * (THREE.WebGLRenderer: Context Lost) y reduciendo el consumo de GPU.
 *
 * Mantiene el layout estable mostrando un fondo oscuro mientras el canvas no
 * está montado (mismo aspecto que el contenedor del modelo).
 */

import { useEffect, useRef, useState } from "react";
import StageViewer from "./StageViewer";

type LazyStageViewerProps = {
  enableRotation?: boolean;
  activeStage?: number;
  /** Margen para montar el canvas un poco antes de entrar en pantalla. */
  rootMargin?: string;
  lowPower?: boolean;
};

export default function LazyStageViewer({
  enableRotation = true,
  activeStage,
  rootMargin = "250px",
  lowPower = false,
}: LazyStageViewerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }} aria-hidden={!inView}>
      {inView ? <StageViewer enableRotation={enableRotation} activeStage={activeStage} lowPower={lowPower} /> : null}
    </div>
  );
}
