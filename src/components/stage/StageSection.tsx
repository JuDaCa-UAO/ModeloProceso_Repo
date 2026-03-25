/**
 * PRESENTATION — StageSection
 *
 * Sección autocontenida del recorrido.
 * Renderiza el contenido de la sección sin depender de sistemas de scroll.
 */

"use client";

import { type ReactNode } from "react";
import DialogueBlock from "@/components/stage/DialogueBlock";
import BlockRenderer from "@/components/stage/BlockRenderer";
import { hasRequiredFlags } from "@domain/stage/rules/GatingRule";
import type { SectionAction, SectionNode } from "@/types/stage";
import type { BlockContext } from "@/components/stage/blocks/BlockContext";
import styles from "./stage.module.css";

export type StageSectionProps = {
  node: SectionNode;
  index: number;
  ctx: BlockContext;
  flags: Record<string, boolean>;
};

export default function StageSection({
  node,
  index,
  ctx,
  flags,
}: StageSectionProps) {
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
      className={styles.section}
      aria-labelledby={`${node.id}-title`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionLabelRow}>
          <span className={styles.sectionLabel}>Sección {index}</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
