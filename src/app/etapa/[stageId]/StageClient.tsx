"use client";

import { Fragment, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import StageShell from "@/components/stage/StageShell";
import ProgressiveSection from "@/components/stage/ProgressiveSection";
import DialogueBlock from "@/components/stage/DialogueBlock";
import BlockRenderer from "@/components/stage/BlockRenderer";
import stageStyles from "@/components/stage/stage.module.css";
import { useStageProgress } from "@/hooks/domain/useStageProgress";
import { useProgressiveReveal } from "@/hooks/ui/useProgressiveReveal";
import { hasRequiredFlags } from "@domain/stage/rules/GatingRule";
import { writeProgress } from "@/lib/progress";
import type { SectionAction, SectionNode } from "@/types/stage";
import type { BlockContext } from "@/components/stage/blocks/BlockContext";

function flatIds(nodes: SectionNode[]): string[] {
  const ids: string[] = [];

  const walk = (items: SectionNode[]) => {
    for (const item of items) {
      ids.push(item.id);
      if (item.children?.length) walk(item.children);
    }
  };

  walk(nodes);
  return ids;
}

type StageClientProps = {
  stageId: string;
  stageName: string;
  initialTree: SectionNode[];
};

export default function StageClient({
  stageId,
  stageName,
  initialTree,
}: StageClientProps) {
  const router = useRouter();
  const { flags, state, update } = useStageProgress(stageId);

  const allIds = useMemo(() => flatIds(initialTree), [initialTree]);
  const { activeId, revealed, registerSectionRef } = useProgressiveReveal({
    ids: allIds,
    threshold: 0.14,
    rootMargin: "0px 0px -18% 0px",
  });

  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapa/${stageId}` });
  }, [stageId]);

  const onScrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const onNavigate = useCallback(
    (href: string) => {
      writeProgress({ lastRoute: href });
      router.push(href);
    },
    [router]
  );

  const ctx: BlockContext = useMemo(
    () => ({ stageId, state, flags, onUpdate: update, onScrollTo, onNavigate }),
    [flags, onNavigate, onScrollTo, stageId, state, update]
  );

  const viewerStatus = {
    label: flags.transitionAnimationViewed
      ? "Lista para siguiente etapa"
      : "Etapa actual resaltada",
    tone: flags.transitionAnimationViewed ? ("done" as const) : ("active" as const),
  };

  const visibleIndexById = useMemo(() => {
    const ordered: string[] = [];

    const walk = (nodes: SectionNode[]) => {
      for (const node of nodes) {
        if (!hasRequiredFlags(flags, node.gate?.requires)) continue;
        ordered.push(node.id);
        if (node.children?.length) walk(node.children);
      }
    };

    walk(initialTree);
    return new Map(ordered.map((id, i) => [id, i + 1]));
  }, [flags, initialTree]);

  const renderActions = (actions: SectionAction[] | undefined) => {
    if (!actions?.length) return null;

    return (
      <div className={stageStyles.buttonRow}>
        {actions.map((action) => {
          const variant = action.variant ?? "secondary";
          const cls =
            variant === "primary"
              ? stageStyles.buttonPrimary
              : stageStyles.buttonSecondary;

          if (action.type === "scroll-to") {
            return (
              <button
                key={`scroll:${action.targetId}`}
                type="button"
                className={cls}
                onClick={() => onScrollTo(action.targetId)}
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
              onClick={() => onNavigate(action.href)}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };

  const renderNode = (node: SectionNode): React.ReactNode => {
    if (!hasRequiredFlags(flags, node.gate?.requires)) return null;

    const index = visibleIndexById.get(node.id) ?? 0;

    return (
      <Fragment key={node.id}>
        <ProgressiveSection
          id={node.id}
          title={node.title}
          subtitle={node.subtitle}
          active={activeId === node.id}
          revealed={revealed.has(node.id)}
          registerRef={registerSectionRef}
          indexLabel={`Seccion ${index}`}
          surface={node.surface ?? "plain"}
        >
          {node.dialogue?.length ? <DialogueBlock steps={node.dialogue} /> : null}
          <BlockRenderer blocks={node.content} section={node} ctx={ctx} />
          {renderActions(node.actions)}
        </ProgressiveSection>

        {node.children?.map((child) => renderNode(child))}
      </Fragment>
    );
  };

  return (
    <StageShell
      viewerTitle={stageName}
      viewerStatusLabel={viewerStatus.label}
      viewerStatusTone={viewerStatus.tone}
      viewerMeta={[{ label: "Etapa", value: stageName }]}
      viewerEnabled={flags.stage1AnimationViewed}
    >
      {initialTree.map((node) => renderNode(node))}
    </StageShell>
  );
}
