/**
 * STAGE ENGINE — Tipos
 *
 * Modelo de datos del motor de etapas dirigido por datos. Una etapa se define
 * como un árbol de `StageNode` (recursivo vía `children`). El renderer recorre
 * el árbol, renderiza cada nodo de nivel superior como un "frame" progresivo y
 * despacha cada bloque por el registro de bloques (`blockRegistry`).
 *
 * Una etapa nueva que use bloques existentes NO requiere modificar el renderer
 * central: basta con declarar su árbol de datos.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import type { MediaKey } from "@/content/shared/media-registry";

/** Paso de la guía animada con la mano de Laia. */
export interface GuideStep {
  id: string;
  /** Texto operativo breve (microcopy de interfaz, no parlamento narrativo). */
  text: string;
  /** `data-guide-id` del control objetivo. */
  targetGuideId: string;
  placement?: "top" | "bottom" | "left" | "right";
}

/** Unión discriminada de bloques de contenido reutilizables. */
export type StageBlock =
  | {
      type: "spiral-viewer";
      activeStage: number;
      instructions?: string;
      /** "compact" reduce la altura del visor (para frames con diálogo debajo). */
      variant?: "default" | "compact";
    }
  | {
      type: "dialogue";
      steps: CharacterDialogStep[];
      size?: "default" | "compact";
      density?: "standard" | "tight";
      /** Si true (default), al completar el diálogo se completa el frame. */
      completesFrame?: boolean;
    }
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "narrative-video"; mediaKey: MediaKey; caption?: string }
  | { type: "criteria-infographic"; openLabel: string }
  | { type: "comparison-example"; openLabel: string }
  | { type: "download-resource"; mediaKey: MediaKey; label: string }
  | {
      type: "transition";
      mediaKey: MediaKey;
      steps: CharacterDialogStep[];
      nextHref: string;
      nextLabel: string;
      /** Si false, el botón muestra estado "próximamente" y no navega. */
      nextAvailable: boolean;
    };

/** Nodo del árbol de la etapa. Cada nodo de nivel superior es un frame. */
export interface StageNode {
  id: string;
  sectionTitle?: string;
  /** Título de etapa (normalmente solo en el primer frame). */
  stageTitle?: string;
  backgroundImage?: string;
  overlay?: string;
  blocks: StageBlock[];
  /** Microcopy del indicador de avance hacia el siguiente frame. */
  scrollHintLabel?: string;
  /** Pasos de guía con la mano de Laia, activos cuando el frame está visible. */
  guide?: GuideStep[];
  /** Nodos hijos, renderizados recursivamente dentro del frame. */
  children?: StageNode[];
}

/** Contexto que el renderer pasa a cada bloque. */
export interface BlockContext {
  stageId: string;
  /** Número de frame (1-based) al que pertenece el bloque. */
  frameNumber: number;
  /** true cuando el frame ya fue completado por el usuario. */
  frameDone: boolean;
  /** Marca el frame como completado (persiste progreso + toast una sola vez). */
  completeFrame: () => void;
  pushToast: (text: string) => void;
}

export interface StageDefinition {
  stageId: string;
  tree: StageNode[];
}
