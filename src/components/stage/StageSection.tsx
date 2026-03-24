"use client";

import { type ReactNode } from "react";
import DialogueBlock from "@/components/stage/DialogueBlock";
import BlockRenderer from "@/components/stage/BlockRenderer";
import { useSectionScroll } from "@/contexts/SectionScrollContext";
import { hasRequiredFlags } from "@domain/stage/rules/GatingRule";
import { getContinueRequires, sectionNeedsContinueButton } from "@/lib/sectionScrollFlow";
import type { SectionAction, SectionNode } from "@/types/stage";
import type { BlockContext } from "@/components/stage/blocks/BlockContext";
import styles from "./stage.module.css";

export type StageSectionProps = {
  node: SectionNode;
  index: number;
  active: boolean;
  revealed: boolean;
  activeIndex: number;
  registerRef: (id: string, node: HTMLElement | null) => void;
  ctx: BlockContext;
  flags: Record<string, boolean>;
};

/**
 * Sección autocontenida del recorrido.
 * Usa SectionScrollContext para continuar/bloquear.
 */
export default function StageSection({
  node,
  index,
  active,
  revealed,
  activeIndex,
  registerRef,
  ctx,
  flags,
}: StageSectionProps) {
  const { continuedIds, isBlocking } = useSectionScroll();

  const needsContinue = sectionNeedsContinueButton(node);
  const continued = continuedIds.has(node.id);
  const blocking = isBlocking(node.id);
  const nodeIndex0 = Math.max(0, index - 1);

  const shouldRenderBody =
    nodeIndex0 < activeIndex ||
    !needsContinue ||
    continued ||
    blocking ||
    active;

  const renderActions = (actions: SectionAction[] | undefined): ReactNode => {
    if (!actions?.length) return null;
    return (
      <div className={styles.buttonRow}>
        {actions.map((action) => {
          const variant = action.variant ?? "secondary";
          const cls =
            variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary;

          if (action.type === "scroll-to") {
            return (
              <button
                key={`scroll:${action.targetId}`}
                type="button"
                className={cls}
                onClick={() => ctx.onScrollTo(action.targetId)}
              >
                {action.label}
              </button>
            );
          }

          const enabled = hasRequiredFlags(flags, action.requires);
          return (
            <button
              key={`nav:${action.href}`}
              type="button"
              className={cls}
              disabled={!enabled}
              onClick={() => ctx.onNavigate(action.href)}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section
      id={node.id}
      ref={(el) => registerRef(node.id, el)}
      className={`${styles.section} ${active ? styles.sectionActive : ""} ${
        revealed ? styles.sectionRevealed : styles.sectionMuted
      }`}
      aria-labelledby={`${node.id}-title`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionLabelRow}>
          <span className={styles.sectionLabel}>Sección {index}</span>
          <span className={styles.sectionState}>
            {active ? "En foco" : revealed ? "Recorrido" : "Disponible en el recorrido"}
          </span>
        </div>

        <div
          className={
            (node.surface ?? "plain") === "card" ? styles.surfaceCard : styles.surfacePlain
          }
        >
          <header className={styles.header}>
            <h2 id={`${node.id}-title`} className={styles.title}>
              {node.title}
            </h2>
            {node.subtitle ? (
              <p className={styles.subtitle}>{node.subtitle}</p>
            ) : null}
          </header>

          <div className={styles.body}>
            {shouldRenderBody ? (
              <>
                {node.dialogue?.length ? (
                  <DialogueBlock
                    steps={node.dialogue}
                    onComplete={
                      node.gate?.completionFlag === "stage1IntroDialogueCompleted"
                        ? () => ctx.onUpdate({ stage1IntroDialogueCompleted: true })
                        : undefined
                    }
                  />
                ) : null}
                <BlockRenderer blocks={node.content} section={node} ctx={ctx} />
                {renderActions(node.actions)}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
