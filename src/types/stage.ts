import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";
import type { VideoRegistryKey } from "@/content/shared/video-registry";
export type { StageFlagKey };

export type DialogueStepConfig = {
  text: string;
  imgSrc: string;
  imgAlt?: string;
};

export type RailPanel = {
  id: string;
  title: string;
  lines: [string, string];
  kind?: "intro" | "stage";
  label?: string;
  videoKey?: VideoRegistryKey;
};

export type StateCardItem = {
  hierarchy: "Inicial" | "Intermedio" | "Avanzado";
  title: string;
  description: string;
  supportHint: string;
};

export type SectionAction =
  | {
      type: "scroll-to";
      label: string;
      targetId: string;
      variant?: "primary" | "secondary";
      disabledWhen?: StageFlagKey;
    }
  | {
      type: "navigate";
      label: string;
      href: string;
      variant?: "primary" | "secondary";
      requires?: StageFlagKey[];
    };

export type SectionGate = {
  requires?: StageFlagKey[];
  completionFlag?: StageFlagKey;
};

/** Control opcional del flujo de scroll entre secciones (botón Continuar + bloqueo). */
export type SectionScrollFlow = {
  /** No mostrar botón ni bloquear scroll hacia la siguiente sección. */
  skipContinue?: boolean;
  /** Flags extra para habilitar Continuar (se unen con `gate.completionFlag` si existe). */
  continueRequires?: StageFlagKey[];
};

export type SectionContentBlock =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "callout"; title?: string; body: string }
  | { type: "bullets"; title?: string; items: string[] }
  | { type: "horizontal-rail"; panels: RailPanel[] }
  | { type: "state-cards"; items: StateCardItem[] }
  | { type: "stage1-animation" }
  | { type: "consent-form" }
  | { type: "autodiagnostic-module" }
  | { type: "result-summary" }
  | { type: "intention-form" }
  | { type: "transition-animation" }
  | { type: "custom"; renderKey: string };

export type SectionNode = {
  id: string;
  title: string;
  subtitle?: string;
  dialogue?: DialogueStepConfig[];
  content: SectionContentBlock[];
  actions?: SectionAction[];
  gate?: SectionGate;
  /** Flujo de scroll: indicador + Continuar antes de pasar a la siguiente sección. */
  scrollFlow?: SectionScrollFlow;
  children?: SectionNode[];
  surface?: "card" | "plain";
  dialogueOptional?: boolean;
};


