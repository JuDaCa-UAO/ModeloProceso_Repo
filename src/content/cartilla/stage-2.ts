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
      "Explora y compara tecnologías basadas en IA partiendo de una pregunta pedagógica: ¿qué herramienta puede ayudarte realmente a mejorar una actividad de aprendizaje?",
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
      text: "No se trata de usarlas todas ni por moda, sino desde una pregunta pedagógica: ¿sirven para tu contexto, tus estudiantes, tus objetivos de aprendizaje y tus criterios éticos?",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e2-laia-3",
      text: "Apóyate en la Matriz de Pugh y las guías de exploración para comparar opciones y elegir la más pertinente. ¡Sigue bajando!",
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
            "Esta etapa consiste en conocer herramientas de IA, pero no desde la curiosidad suelta de «probemos lo que está de moda», sino desde una pregunta pedagógica: ¿qué herramienta puede ayudarme realmente a mejorar una actividad de aprendizaje?",
            "Aquí el docente explora herramientas, plataformas o aplicaciones de IA y analiza si sirven para su contexto, sus estudiantes, sus objetivos de aprendizaje y sus criterios éticos.",
          ],
        },
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Identifica la actividad",
              description: "Selecciona una actividad de tu clase real que quieres mejorar o transformar con apoyo de IA.",
            },
            {
              icon: "2",
              title: "Explora herramientas",
              description: "Busca y explora herramientas de IA que tengan el potencial de apoyar o enriquecer esa actividad.",
            },
            {
              icon: "3",
              title: "Compara con criterio",
              description: "Utiliza la Matriz de Pugh para comparar las opciones según su idoneidad pedagógica y viabilidad ética.",
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
            "Apropiación docente — qué tan familiarizado estás con la herramienta y si puedes usarla con confianza.",
            "Idoneidad pedagógica — qué tanto aporta la IA al aprendizaje de los estudiantes y a la utilidad de la actividad.",
            "Ética y protección de datos — si la herramienta respeta la privacidad y promueve un uso responsable.",
            "Razonamiento crítico — si fomenta la verificación de información, el análisis crítico y la argumentación.",
            "Accesibilidad — si los estudiantes pueden usarla considerando posibles barreras económicas, técnicas o de capacidades.",
            "Integración y costo — si es viable financieramente y se integra bien con el contexto institucional de la institución.",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage2.comparisonExample"),
          caption: "Ejemplo demostrativo de comparación: tres posibilidades de IA para el mismo propósito en clase",
        },
        {
          type: "bullets",
          title: "Recursos que contiene esta etapa",
          variant: "list",
          items: [
            "Presentación: Exploración de herramientas de GenAI — Introduce los diversos tipos de herramientas de IA generativa (generación de texto, imagen, ideas, simulaciones) y hace hincapié en una regla de oro: la herramienta no se elige primero; primero debes definir tu propósito pedagógico preguntándote qué dificultad o resultado de aprendizaje quieres fortalecer.",
            "Asistente de IA para explorar herramientas — Un tutor virtual interactivo que recomienda posibles herramientas de IA según la necesidad planteada por el docente (ej. retroalimentar rápido, promover debate, guiar análisis de datos) y advierte sobre sus limitaciones para evitar perderse entre tantas opciones.",
            "Matriz de Pugh — El recurso central comparativo. Permite evaluar estructuradamente herramientas asignando ponderaciones (con mayor peso en apropiación docente e idoneidad pedagógica) para responder si la herramienta sirve, es ética, promueve el razonamiento crítico y es viable en tu universidad.",
            "Banco o catálogo de herramientas — Compendio de herramientas recomendadas clasificadas por propósito de uso (redacción, ideación, evaluación, simulación), estructuradas en fichas breves que detallan su nombre, función, nivel recomendado y riesgos pedagógicos.",
            "Registro de selección de herramientas — Formato para documentar formalmente la IA elegida, para qué actividad se utilizará, su justificación pedagógica, los riesgos identificados, las reglas éticas de uso para tus estudiantes y la alternativa en caso de falla.",
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "Una herramienta de IA seleccionada y pedagógicamente justificada: terminarás la etapa sabiendo con precisión qué herramienta usarás en tu diseño, por qué la elegiste para tus estudiantes y qué cuidados específicos y alternativos debes contemplar.",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage2.pughMatrix"),
          title: "Matriz de Pugh",
          description: "Descarga la plantilla para comparar y ponderar las herramientas de GenAI con criterio pedagógico y ético.",
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
