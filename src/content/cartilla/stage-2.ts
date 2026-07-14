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
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "La forma en la que exploras y comparas tecnologías varía según tu nivel de partida:",
          items: [
            {
              hierarchy: "Inicial",
              title: "M1 Inicial",
              description: "Exploras pocas herramientas, sencillas y de bajo riesgo (ej. IAs de texto básicas para generar ideas o borradores). Realizas tareas puntuales como identificar una actividad de clase, probar una sola herramienta y registrar dudas iniciales usando fichas informativas y una matriz de Pugh simplificada.",
            },
            {
              hierarchy: "Intermedio",
              title: "M2 Intermedio",
              description: "Comparas dos o tres herramientas con criterio e intención pedagógica empleando la Matriz de Pugh completa. Evalúas de forma argumentada la idoneidad didáctica, los riesgos de privacidad, la accesibilidad de tus estudiantes y el fomento de su razonamiento crítico.",
            },
            {
              hierarchy: "Avanzado",
              title: "M3 Avanzado",
              description: "Exploras herramientas con una visión estratégica y de integración institucional. Consideras la privacidad avanzada, la escalabilidad, la personalización de asistentes mediante prompts de sistema y documentas tus propios criterios y guías de uso para apoyar a otros colegas.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Exploración",
              description: "Panorama de herramientas de GenAI (texto, imagen, simulación, ideas). Enfatiza definir el propósito pedagógico (la actividad a transformar) antes de elegir el software.",
            },
            {
              title: "Asistente de IA para explorar",
              description: "Tutor virtual interactivo que sugiere alternativas tecnológicas según tu área y tus objetivos pedagógicos, indicando ventajas y limitaciones específicas.",
            },
            {
              title: "Matriz de Pugh",
              description: "Recurso central para ponderar y comparar herramientas en base a 6 criterios de idoneidad, apropiación docente, ética, crítica, accesibilidad e integración.",
            },
            {
              title: "Banco de herramientas",
              description: "Catálogo estructurado por propósitos educativos (escribir, simular, retroalimentar) con fichas cortas de nombre, función, nivel y recomendaciones.",
            },
            {
              title: "Registro de selección",
              description: "Bitácora donde documentas formalmente tu elección: para qué actividad es, por qué sirve, qué riesgos tiene, pautas de aula y alternativas (Plan B).",
            },
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "Una herramienta de IA seleccionada y pedagógicamente justificada: sabrás con total claridad técnica y ética qué tecnología usarás, por qué se adapta a tus estudiantes y qué cuidados específicos debes contemplar.",
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
