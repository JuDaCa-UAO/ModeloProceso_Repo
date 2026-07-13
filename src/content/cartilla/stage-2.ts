/**
 * CONTENT — Datos (Etapa 2 · Descubre nuevas posibilidades)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e2`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_2: Stage = {
  id: "etapa-2",
  order: 2,
  officialName: OFFICIAL_STAGE_NAMES["etapa-2"],
  accent: { main: "var(--uao-stage-2-accent)", chip: "var(--uao-stage-2-chip)" },
  abrebocas: mediaKey("stage2.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 2",
    chapterLabel: "CAPÍTULO 2 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-2"],
    description:
      "Acércate a herramientas, plataformas y aplicaciones de IA con potencial educativo: cómo funcionan, qué ofrecen, sus límites y sus implicaciones éticas.",
    tags: ["Explorar", "Comparar", "Elegir con criterio"],
    laiaAvatar: mediaKey("laia.pose.holo"),
  },
  laia: [
    {
      id: "e2-laia-1",
      text: "¡Bienvenido/a a la Etapa 2! Aquí ampliarás tu visión: conocerás herramientas, plataformas y aplicaciones de IA con potencial educativo.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e2-laia-2",
      text: "No se trata de usarlas todas: mira cómo funcionan, qué beneficios ofrecen, cuáles son sus límites y qué implicaciones éticas conllevan.",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e2-laia-3",
      text: "Apóyate en la Matriz de Pugh para comparar opciones y elegir la más pertinente para tu contexto. ¡Sigue bajando!",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa2-contenido",
      title: "Amplía tu visión",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "¿Qué herramienta puede ayudarte realmente a mejorar una actividad de aprendizaje? Aquí te acercas a herramientas, plataformas y aplicaciones de IA con potencial educativo: exploras cómo funcionan, qué beneficios ofrecen, cuáles son sus limitaciones y qué implicaciones éticas conllevan. El propósito no es dominarlas todas, sino reconocer cuáles son útiles y pertinentes para tu contexto y tus objetivos pedagógicos.",
          ],
        },
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Identifica una actividad",
              description: "La actividad de tu clase que quieres mejorar o transformar con apoyo de IA.",
            },
            {
              icon: "2",
              title: "Explora herramientas",
              description: "Qué herramientas de IA podrían apoyar esa actividad específica.",
            },
            {
              icon: "3",
              title: "Compara con criterio",
              description: "Cuál se ajusta mejor a tu contexto, tus estudiantes y tus objetivos de aprendizaje.",
            },
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage2.criteriaInfographic"),
          caption: "Mirar una herramienta con criterio: seis aspectos para evaluar cada posibilidad de IA",
        },
        {
          type: "bullets",
          title: "Los seis criterios de la Matriz de Pugh",
          variant: "list",
          items: [
            "Apropiación docente — si puedes usarla con confianza.",
            "Idoneidad pedagógica — si aporta a la actividad y al aprendizaje.",
            "Ética y datos — si cuida la privacidad y el uso responsable.",
            "Razonamiento crítico — si favorece el análisis, el contraste y la reflexión.",
            "Accesibilidad — si distintos estudiantes pueden comprenderla y usarla.",
            "Integración y costo — si es viable en tu contexto real de uso.",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage2.comparisonExample"),
          caption: "Ejemplo demostrativo de comparación: tres posibilidades de IA para el mismo propósito en clase",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage2.pughMatrix"),
          title: "Matriz de Pugh",
          description: "Una plantilla para comparar herramientas de GenAI de forma estructurada y elegir con criterio.",
          label: "Descargar PDF ↓",
        },
      ],
    },
  ],
  closing: {
    title: "Tu elección con criterio",
    message: "Tómate un momento para este resumen. Reúne lo esencial para elegir una herramienta de IA con criterio, no por moda.",
    question: "¿Qué posibilidad de uso de la IA resulta más pertinente para tu contexto y tus objetivos?",
    summaryVideo: mediaKey("stage2.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.holo"),
    continueLabel: "Continuar a la Etapa 3 →",
    continueHref: "#etapa-3",
    accent: { main: "var(--uao-stage-2-closing-accent)", soft: "var(--uao-stage-2-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage2ToStage3"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-3"],
  },
};
