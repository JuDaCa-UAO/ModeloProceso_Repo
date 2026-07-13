/**
 * CONTENT — Datos (manifiesto multimedia)
 *
 * Fuente TS local del manifiesto (`satisfies MediaManifest`, chequeo en
 * compilación, cero costo en runtime). Porta las 29 claves reales de
 * `src/content/shared/media-registry.ts` (contadas a mano contra el archivo,
 * no asumidas) más los 6 videos-resumen del diseño, entregados por el usuario
 * en `public/media/resumenes/` (`availability: "available"`, provider
 * "local" temporal — ver `contexto/context.md`).
 *
 * `content/shared/media-registry.ts` y `content/shared/video-registry.ts`
 * NO se tocan aquí: siguen sirviendo intactos a la app vieja (Etapas 2–6 vía
 * `StageRenderer`) hasta el corte de la Fase 14. Este manifiesto es aditivo.
 *
 * Todas las rutas locales apuntan a archivos verificados presentes en
 * `public/` (inventario de la fase de planificación); las entradas
 * `"pending"` no tienen archivo en ningún lado todavía.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaManifest } from "@domain/media/MediaAsset";
import { TRANSITION_PLAYBACK, SUMMARY_VIDEO_PLAYBACK } from "@domain/media/MediaAsset";

export const MEDIA_MANIFEST = {
  // ── Personaje / guía ───────────────────────────────────────────────────────
  [mediaKey("laia.leftPointingHand")]: {
    key: mediaKey("laia.leftPointingHand"),
    kind: "svg",
    provider: "local",
    ref: "/mano/Mano izq apunta.svg",
    availability: "available",
    description: "Mano de LaIA señalando un control",
    fallback: "👉",
  },

  // ── Poses de LaIA (Fase 7) — casing REAL del archivo en disco, corrigiendo
  // el bug documentado en la entrada 24/27 (el código viejo referencia
  // "LaIA_..." con mayúsculas que no existen en `public/ui/`) ────────────────
  [mediaKey("laia.pose.neutral")]: {
    key: mediaKey("laia.pose.neutral"),
    kind: "image",
    provider: "local",
    ref: "/ui/laia.png",
    availability: "available",
    alt: "LaIA",
    fallback: "LaIA",
  },
  [mediaKey("laia.pose.explaining")]: {
    key: mediaKey("laia.pose.explaining"),
    kind: "image",
    provider: "local",
    ref: "/ui/laia_explaining.png",
    availability: "available",
    alt: "LaIA explicando",
    fallback: "LaIA",
  },
  [mediaKey("laia.pose.holo")]: {
    key: mediaKey("laia.pose.holo"),
    kind: "image",
    provider: "local",
    ref: "/ui/Laia_explaining_holo.png",
    availability: "available",
    alt: "LaIA en proyección holográfica",
    fallback: "LaIA",
  },
  [mediaKey("laia.pose.triumphant")]: {
    key: mediaKey("laia.pose.triumphant"),
    kind: "image",
    provider: "local",
    ref: "/ui/Laia_triumphant.png",
    availability: "available",
    alt: "LaIA celebrando",
    fallback: "LaIA",
  },

  // ── Marca / portada (Fase 7) ───────────────────────────────────────────────
  [mediaKey("brand.logoRed")]: {
    key: mediaKey("brand.logoRed"),
    kind: "image",
    provider: "local",
    ref: "/ui/uao-logo-red.webp",
    availability: "available",
    alt: "Universidad Autónoma de Occidente",
    fallback: "UAO",
  },
  [mediaKey("ui.introHeroBackground")]: {
    key: mediaKey("ui.introHeroBackground"),
    kind: "image",
    provider: "local",
    ref: "/ui/uao-hero-img_2.webp",
    availability: "available",
    fallback: "",
  },

  // ── Etapa 2 ────────────────────────────────────────────────────────────────
  [mediaKey("stage2.section2Video")]: {
    key: mediaKey("stage2.section2Video"),
    kind: "video",
    provider: "http",
    ref: "/etapa-2/seccion-2-propositos.mp4",
    availability: "pending",
    description: "Animación de íconos de herramientas dispersas que se organizan alrededor de propósitos educativos.",
    fallback: "Animación de propósitos educativos — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("stage2.criteriaInfographic")]: {
    key: mediaKey("stage2.criteriaInfographic"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-2/Etapa_2_1.webp",
    availability: "available",
    width: 2560,
    height: 1440,
    description: "Infografía: cómo se miran las posibilidades (seis criterios).",
    fallback: "La infografía de criterios estará disponible próximamente.",
  },
  [mediaKey("stage2.comparisonExample")]: {
    key: mediaKey("stage2.comparisonExample"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-2/Etapa_2_2.webp",
    availability: "available",
    width: 2560,
    height: 2228,
    description: "Infografía del ejemplo comparativo: tres posibilidades de IA para fortalecer un debate.",
    fallback: "El ejemplo comparativo estará disponible próximamente.",
  },
  [mediaKey("stage2.pughMatrix")]: {
    key: mediaKey("stage2.pughMatrix"),
    kind: "download",
    provider: "local",
    ref: "/media/etapa-2/Matriz-de-Pugh.pdf",
    availability: "available",
    downloadName: "Matriz-de-Pugh.pdf",
    description: "Matriz de Pugh para el análisis de herramientas de GenAI (PDF).",
    fallback: "La Matriz de Pugh estará disponible para descarga próximamente.",
  },

  // ── Etapa 3 ────────────────────────────────────────────────────────────────
  [mediaKey("stage3.section2Video")]: {
    key: mediaKey("stage3.section2Video"),
    kind: "video",
    provider: "http",
    ref: "/etapa-3/seccion-2-propositos.mp4",
    availability: "pending",
    description: "Animación de componentes pedagógicos conectados con soluciones de IA.",
    fallback: "Animación de componentes pedagógicos — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("stage3.caseExample")]: {
    key: mediaKey("stage3.caseExample"),
    kind: "image",
    provider: "http",
    ref: "/etapa-3/Ejemplo-diseno.webp",
    availability: "pending",
    description: "Caso práctico de diseño didáctico mediado por IA.",
    fallback: "El ejemplo de diseño práctico estará disponible próximamente.",
  },
  [mediaKey("stage3.designCanvas")]: {
    key: mediaKey("stage3.designCanvas"),
    kind: "download",
    provider: "local",
    ref: "/media/etapa-3/Canvas-de-diseno.pdf",
    availability: "available",
    downloadName: "Canvas-de-diseno.pdf",
    description: "Canvas de diseño de experiencia mediada por GenAI (PDF).",
    fallback: "El Canvas de diseño estará disponible para descarga próximamente.",
  },
  // "Canvas_etapa3.png" — el media-registry.ts viejo no lo registraba (era
  // huérfano: la app vieja solo usaba el PDF). El diseño nuevo SÍ lo muestra
  // como figura inline antes de la tarjeta de descarga.
  [mediaKey("stage3.designCanvasPreview")]: {
    key: mediaKey("stage3.designCanvasPreview"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-3/Canvas_etapa3.png",
    availability: "available",
    width: 840,
    height: 701,
    description: "Canvas de diseño de experiencia mediada por GenAI",
    fallback: "La vista previa del canvas estará disponible próximamente.",
  },

  // ── Etapa 4 ────────────────────────────────────────────────────────────────
  // "controlRoom" (Etapa_4_1.webp) no estaba en el media-registry.ts viejo
  // (el diseño la usa, la app vieja no) — extraída del zip del proyecto
  // Design a public/media/etapa-4/imagenes/ en esta misma fase (Fase 8).
  [mediaKey("stage4.controlRoom")]: {
    key: mediaKey("stage4.controlRoom"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-4/imagenes/Etapa_4_1.webp",
    availability: "available",
    width: 2560,
    height: 1142,
    description:
      "Infografía: sala de control del alistamiento — verificación técnica, pedagógica y ético-emocional para llegar a una experiencia lista para el aula.",
    fallback: "La infografía de la sala de control estará disponible próximamente.",
  },
  [mediaKey("stage4.section2Media")]: {
    key: mediaKey("stage4.section2Media"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-4/imagenes/Etapa_4_2.webp",
    availability: "available",
    width: 2560,
    height: 1085,
    description:
      "Infografía: checklist de preparación — herramienta funcionando, instrucciones claras, reglas de aula, plan de actividad y acompañamiento previsto.",
    fallback: "El recurso de la sección 2 estará disponible próximamente.",
  },
  [mediaKey("stage4.readinessCanvas")]: {
    key: mediaKey("stage4.readinessCanvas"),
    kind: "download",
    provider: "local",
    ref: "/media/etapa-4/descargas/Canvas-de-alistamiento-GenAI.pdf",
    availability: "available",
    downloadName: "Canvas-de-alistamiento-GenAI.pdf",
    description: "Canvas de alistamiento de la experiencia (PDF).",
    fallback: "El Canvas de alistamiento estará disponible para descarga próximamente.",
  },

  // ── Etapa 5 ────────────────────────────────────────────────────────────────
  [mediaKey("stage5.classroomSimulation")]: {
    key: mediaKey("stage5.classroomSimulation"),
    kind: "video",
    provider: "http",
    ref: "/etapa-5/simulacion.mp4",
    availability: "pending",
    description: "Simulación de aula interactiva.",
    fallback: "video: simulación de aula (.mp4) — pendiente de subir",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("stage5.teacherAsMediator")]: {
    key: mediaKey("stage5.teacherAsMediator"),
    kind: "video",
    provider: "http",
    ref: "/etapa-5/mediador.mp4",
    availability: "pending",
    description: "Animación de acciones docentes durante el despliegue.",
    fallback: "video: el docente como mediador (.mp4) — pendiente de subir",
    playback: TRANSITION_PLAYBACK,
  },
  // "Etapa 5.webp" (sin guion bajo, registrada como stage5.criticalMoments en
  // el media-registry.ts viejo) NO es la que usa el diseño nuevo — el diseño
  // referencia Etapa_5_1.webp/Etapa_5_2.webp (con guion bajo), extraídas del
  // zip del proyecto Design en esta misma fase (Fase 8).
  [mediaKey("stage5.teacherAsMediatorInfographic")]: {
    key: mediaKey("stage5.teacherAsMediatorInfographic"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Etapa_5_1.webp",
    availability: "available",
    width: 2560,
    height: 1769,
    description:
      "Infografía: el docente como mediador — guía, observa, aclara, interviene y protege el propósito de la experiencia.",
    fallback: "La infografía del docente mediador estará disponible próximamente.",
  },
  [mediaKey("stage5.criticalMomentsInfographic")]: {
    key: mediaKey("stage5.criticalMomentsInfographic"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Etapa_5_2.webp",
    // El archivo NO existe en disco todavía (nunca se extrajo del export de
    // Design) — marcado "pending" para mostrar el fallback en vez de una
    // imagen rota (404). Al conseguir el archivo: colocarlo en esa ruta,
    // volver a "available" y añadir width/height.
    availability: "pending",
    description:
      "Infografía: momentos críticos durante la experiencia — dificultades cognitivas, dilemas éticos, uso acrítico, fallas técnicas e instrucciones poco claras.",
    fallback: "La infografía de momentos críticos estará disponible próximamente.",
  },
  [mediaKey("stage5.rail.1")]: {
    key: mediaKey("stage5.rail.1"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Slider Etapa 5_1.webp",
    availability: "available",
    description: "Evidencia 1: dudas de estudiantes.",
    fallback: "Evidencia 1 — próximamente.",
  },
  [mediaKey("stage5.rail.2")]: {
    key: mediaKey("stage5.rail.2"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Slider Etapa 5_2.webp",
    availability: "available",
    description: "Evidencia 2: prompts usados.",
    fallback: "Evidencia 2 — próximamente.",
  },
  [mediaKey("stage5.rail.3")]: {
    key: mediaKey("stage5.rail.3"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Slider Etapa 5_3.webp",
    availability: "available",
    description: "Evidencia 3: productos generados.",
    fallback: "Evidencia 3 — próximamente.",
  },
  [mediaKey("stage5.rail.4")]: {
    key: mediaKey("stage5.rail.4"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Slider Etapa 5_4.webp",
    availability: "available",
    description: "Evidencia 4: comentarios y errores.",
    fallback: "Evidencia 4 — próximamente.",
  },
  [mediaKey("stage5.rail.5")]: {
    key: mediaKey("stage5.rail.5"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-5/Slider Etapa 5_5.webp",
    availability: "available",
    description: "Evidencia 5: ajustes y decisiones.",
    fallback: "Evidencia 5 — próximamente.",
  },

  // ── Etapa 6 ────────────────────────────────────────────────────────────────
  [mediaKey("stage6.evaluationDimensions")]: {
    key: mediaKey("stage6.evaluationDimensions"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-6/imagenes/dimensiones-evaluacion.webp",
    availability: "available",
    width: 2560,
    height: 1761,
    description: "Infografía: evaluar no es solo calificar (dimensiones pedagógica, técnica, ética, emocional y cognitiva).",
    fallback: "Infografía de dimensiones de evaluación — próximamente.",
  },
  [mediaKey("stage6.twoPerspectives")]: {
    key: mediaKey("stage6.twoPerspectives"),
    kind: "image",
    provider: "local",
    ref: "/media/etapa-6/imagenes/dos-miradas.webp",
    availability: "available",
    width: 2560,
    height: 1760,
    description: "Infografía: dos miradas sobre la experiencia (mirada docente y mirada estudiante).",
    fallback: "Infografía de dos miradas — próximamente.",
  },
  [mediaKey("stage6.evaluationCanvas")]: {
    key: mediaKey("stage6.evaluationCanvas"),
    kind: "download",
    provider: "local",
    ref: "/media/etapa-6/descargas/Canvas-de-evaluacion-GenAI.pdf",
    availability: "available",
    downloadName: "Canvas-de-evaluacion-GenAI.pdf",
    description: "Canvas de evaluación docente-estudiante de la experiencia mediada por IA (PDF).",
    fallback: "El Canvas de evaluación estará disponible para descarga próximamente.",
  },
  [mediaKey("stage6.improvementSequence")]: {
    key: mediaKey("stage6.improvementSequence"),
    kind: "video",
    provider: "http",
    ref: "/etapa-6/hallazgo-aprendizaje-ajuste.mp4",
    availability: "pending",
    description: "Animación: de hallazgo a mejora (hallazgo → aprendizaje → ajuste).",
    fallback: "Animación de hallazgo a mejora — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("stage6.newLoopVideo")]: {
    key: mediaKey("stage6.newLoopVideo"),
    kind: "video",
    provider: "http",
    ref: "/etapa-6/nueva-vuelta-espiral.mp4",
    availability: "pending",
    description: "Animación de cierre: la espiral continúa hacia una nueva vuelta.",
    fallback: "video de cierre: la espiral da una nueva vuelta (.mp4) — pendiente de subir",
    playback: TRANSITION_PLAYBACK,
  },

  // ── Transiciones entre capítulos (locales, ambientales) ───────────────────
  [mediaKey("transitions.introToStage1")]: {
    key: mediaKey("transitions.introToStage1"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E1.webm",
    availability: "available",
    description: "Animación de introducción al modelo.",
    fallback: "Animación de introducción al modelo — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("transitions.stage1ToStage2")]: {
    key: mediaKey("transitions.stage1ToStage2"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E1-a-E2.webm",
    availability: "available",
    description: "Animación de transición de la Etapa 1 a la Etapa 2.",
    fallback: "Animación de transición de Etapa 1 a 2 — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("transitions.stage2ToStage3")]: {
    key: mediaKey("transitions.stage2ToStage3"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E2-a-E3.webm",
    availability: "available",
    description: "Animación de transición de la Etapa 2 a la Etapa 3.",
    fallback: "Animación de transición de Etapa 2 a 3 — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("transitions.stage3ToStage4")]: {
    key: mediaKey("transitions.stage3ToStage4"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E3-a-E4.webm",
    availability: "available",
    description: "Animación de transición de la Etapa 3 a la Etapa 4.",
    fallback: "Animación de transición de Etapa 3 a 4 — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("transitions.stage4ToStage5")]: {
    key: mediaKey("transitions.stage4ToStage5"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E4-a-E5.webm",
    availability: "available",
    description: "Animación de transición de la Etapa 4 a la Etapa 5.",
    fallback: "Animación de transición de Etapa 4 a 5 — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },
  [mediaKey("transitions.stage5ToStage6")]: {
    key: mediaKey("transitions.stage5ToStage6"),
    kind: "video",
    provider: "local",
    ref: "/media/transiciones/E5-a-E6.webm",
    availability: "available",
    description: "Animación de transición de la Etapa 5 a la Etapa 6.",
    fallback: "Animación de transición de Etapa 5 a 6 — próximamente.",
    playback: TRANSITION_PLAYBACK,
  },

  // ── Videos-resumen (CierreEtapa) — reales, entregados por el usuario en la
  // carpeta local "Animaciones por etapa/" (fuera de git, igual que el zip de
  // Design) y copiados a `public/media/resumenes/etapa-N.webm` en esta fase.
  // `provider: "local"` temporal: migrar a Cloudflare Stream cuando exista
  // cuenta/CDN (Fase 11 original), sin tocar `StageClosing`/`AccessibleVideoPlayer`.
  [mediaKey("stage1.summaryVideo")]: {
    key: mediaKey("stage1.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-1.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 1.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage2.summaryVideo")]: {
    key: mediaKey("stage2.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-2.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 2.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage3.summaryVideo")]: {
    key: mediaKey("stage3.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-3.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 3.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage4.summaryVideo")]: {
    key: mediaKey("stage4.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-4.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 4.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage5.summaryVideo")]: {
    key: mediaKey("stage5.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-5.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 5.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage6.summaryVideo")]: {
    key: mediaKey("stage6.summaryVideo"),
    kind: "video",
    provider: "local",
    ref: "/media/resumenes/etapa-6.webm",
    availability: "available",
    description: "Video-resumen de cierre de la Etapa 6.",
    fallback: "Video-resumen — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },

  // ── Abrebocas (apertura de etapa) — videos cortos entregados por el usuario
  // en `public/media/abrebocas/etapa-N.mp4`. Se muestran tras la portada, antes
  // de LaIA, con reproducción MANUAL (mismo reproductor que el video-resumen).
  // `provider: "local"` temporal, igual que los resúmenes/transiciones.
  [mediaKey("stage1.abrebocas")]: {
    key: mediaKey("stage1.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-1.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 1.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage2.abrebocas")]: {
    key: mediaKey("stage2.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-2.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 2.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage3.abrebocas")]: {
    key: mediaKey("stage3.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-3.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 3.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage4.abrebocas")]: {
    key: mediaKey("stage4.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-4.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 4.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage5.abrebocas")]: {
    key: mediaKey("stage5.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-5.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 5.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },
  [mediaKey("stage6.abrebocas")]: {
    key: mediaKey("stage6.abrebocas"),
    kind: "video",
    provider: "local",
    ref: "/media/abrebocas/etapa-6.mp4",
    availability: "available",
    description: "Abrebocas de apertura de la Etapa 6.",
    fallback: "Video de apertura — próximamente.",
    playback: SUMMARY_VIDEO_PLAYBACK,
  },

  // ── Audios de LaIA (Fase 9 — espacio reservado, PENDIENTE de archivos) ────
  // Convención para cuando el usuario entregue los audios reales: un archivo
  // por mensaje de LaIA, en `public/media/audio/laia/<stageId>/<messageId>.mp3`
  // (ver carpeta reservada `public/media/audio/laia/` con `.gitkeep`).
  // Alta al manifiesto: clave `laia.audio.<stageId>.<messageId>`,
  // `kind:"audio"`, `provider:"local"`, `availability:"available"`. Luego
  // enlazar esa clave en el campo `audioKey` del `LaiaMessage` correspondiente
  // en `content/cartilla/*.ts` (hoy `audioKey` se omite a propósito en los 19
  // mensajes existentes — intro×4, etapa-1×3, etapa-2×3, etapa-3×2, etapa-4×2,
  // etapa-5×2, etapa-6×3). `LaiaStepper`/`ResolvedLaiaStep` todavía no
  // reproducen audio: cablear el `<audio>`/botón de reproducción es trabajo
  // real de Fase 9, no solo de contenido.
} satisfies MediaManifest;
