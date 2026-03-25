"use client";

/**
 * Thin client wrapper que carga StageClient sin SSR.
 *
 * ¿Por qué? StageClient lee localStorage para reanudar el progreso guardado.
 * Si se renderizara en el servidor (SSG), el HTML tendría completedFrames=0,
 * y el cliente podría renderizar un estado diferente al recuperar el progreso
 * → hydration mismatch. Con ssr:false, el componente solo existe en el browser.
 */
import dynamic from "next/dynamic";

const StageClient = dynamic(() => import("./StageClient"), {
  ssr: false,
  loading: () => null,
});

export default StageClient;
