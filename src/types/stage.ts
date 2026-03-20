/**
 * Domain + shared types for the Stage system.
 *
 * RULE: This file must NOT import React or any framework.
 * It describes the data shapes used across all layers.
 * React-specific types (ReactNode, etc.) belong in components/stage/types.ts.
 */

export type StageFlagKey =
  | "stage1AnimationViewed"
  | "consentValidated"
  | "autodiagnosticStarted"
  | "autodiagnosticCompleted"
  | "transitionAnimationViewed";

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
};

export type StateCardItem = {
  hierarchy: "Inicial" | "Intermedio" | "Avanzado";
  title: string;
  description: string;
  supportHint: string;
};

export type ScaffoldActionItem = {
  label: string;
  detail?: string;
  state?: "ready" | "locked" | "future";
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

export type SectionContentBlock =
  | {
      type: "stage-entry";
      eyebrow?: string;
      copy: string[];
      ctaLabel: string;
      targetId: string;
      characterSrc: string;
      characterAlt?: string;
    }
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "callout"; title?: string; body: string }
  | { type: "bullets"; title?: string; items: string[] }
  | { type: "horizontal-rail"; panels: RailPanel[] }
  | { type: "state-cards"; items: StateCardItem[] }
  | { type: "stage1-animation" }
  | { type: "consent-form" }
  | { type: "autodiagnostic-module" }
  | { type: "transition-animation" }
  | {
      type: "scaffold-panel";
      label?: string;
      body: string;
      items?: string[];
      actions?: ScaffoldActionItem[];
      tone?: "neutral" | "accent";
    }
  | { type: "custom"; renderKey: string };

export type SectionNode = {
  id: string;
  title: string;
  subtitle?: string;
  dialogue?: DialogueStepConfig[];
  content: SectionContentBlock[];
  actions?: SectionAction[];
  gate?: SectionGate;
  children?: SectionNode[];
  surface?: "card" | "plain";
  dialogueOptional?: boolean;
};

/**
 * RenderContext has been moved to components/stage/types.ts
 * because it depends on ReactNode (a presentation concern).
 * @deprecated Import from @/components/stage/types instead.
 */
export type RenderContext = Record<string, never>;
