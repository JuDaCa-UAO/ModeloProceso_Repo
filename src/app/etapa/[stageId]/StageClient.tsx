"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import StageShell from "@/components/stage/StageShell";
import ProgressiveSection from "@/components/stage/ProgressiveSection";
import DialogueBlock from "@/components/stage/DialogueBlock";
import BlockRenderer from "@/components/stage/BlockRenderer";
import stageStyles from "@/components/stage/stage.module.css";
import { STAGE_META } from "@/content/stages";
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
  const restoredHashRef = useRef("");

  const allIds = useMemo(() => flatIds(initialTree), [initialTree]);
  const { activeId, revealed, registerSectionRef } = useProgressiveReveal({
    ids: allIds,
    threshold: 0.14,
    rootMargin: "0px 0px -18% 0px",
  });

  useEffect(() => {
    const targetSectionId = activeId || allIds[0] || "entrada-etapa-1";
    writeProgress({
      hasStarted: true,
      lastRoute: `/etapa/${stageId}#${targetSectionId}`,
      lastStageId: stageId,
      lastSectionId: targetSectionId,
    });
  }, [activeId, allIds, stageId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || restoredHashRef.current === hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    restoredHashRef.current = hash;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [flags, initialTree]);

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

  const currentStageMeta = STAGE_META.find((item) => item.id === stageId);
  const nextStageMeta = currentStageMeta
    ? STAGE_META.find((item) => item.order === currentStageMeta.order + 1)
    : undefined;
  const stageLabel = currentStageMeta
    ? `Etapa ${currentStageMeta.order}: ${currentStageMeta.name}`
    : stageName;
  const stageCompleted = flags.autodiagnosticCompleted;
  const transitionReady = flags.transitionAnimationViewed;
  const viewerStageMarkers =
    stageId === "etapa-2"
      ? [
          { label: "Etapa 1", tone: "done" as const },
          { label: "Etapa 2", tone: "current" as const },
        ]
      : currentStageMeta
        ? [
            {
              label: `Etapa ${currentStageMeta.order}`,
              tone: (stageCompleted ? "done" : "current") as
                | "current"
                | "done"
                | "next"
                | "upcoming",
            },
            ...(nextStageMeta
              ? [
                  {
                    label: `Etapa ${nextStageMeta.order}`,
                    tone: (stageCompleted ? "next" : "upcoming") as
                      | "current"
                      | "done"
                      | "next"
                      | "upcoming",
                  },
                ]
              : []),
          ]
        : [];
  const shellTone =
    stageId === "etapa-2" || transitionReady ? "transition" : ("default" as const);
  const shellBackgroundImage =
    stageId === "etapa-2" || transitionReady ? "/ui/bg-home.png" : undefined;
  const shellBackgroundOpacity = stageId === "etapa-2" || transitionReady ? 0.68 : undefined;

  const viewerStatus = {
    label: transitionReady
      ? "Cambio de estacion listo"
      : stageId === "etapa-2"
        ? "Nueva estacion activa"
      : stageCompleted
        ? "Etapa 1 completada"
        : "Activa",
    tone:
      transitionReady || stageCompleted ? ("done" as const) : ("active" as const),
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

  const visibleNodes = useMemo(() => {
    const ordered: Array<{ id: string; title: string }> = [];

    const walk = (nodes: SectionNode[]) => {
      for (const node of nodes) {
        if (!hasRequiredFlags(flags, node.gate?.requires)) continue;
        ordered.push({ id: node.id, title: node.title });
        if (node.children?.length) walk(node.children);
      }
    };

    walk(initialTree);
    return ordered;
  }, [flags, initialTree]);

  const nextVisibleNodeById = useMemo(() => {
    const pairs = new Map<string, { id: string; title: string } | undefined>();
    for (let index = 0; index < visibleNodes.length; index += 1) {
      pairs.set(visibleNodes[index]?.id ?? "", visibleNodes[index + 1]);
    }
    return pairs;
  }, [visibleNodes]);

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
          flowCue={
            activeId === node.id
              ? (() => {
                  const nextNode = nextVisibleNodeById.get(node.id);

                  if (
                    node.id === "presentacion-inicial-modelo" &&
                    !flags.stage1AnimationViewed
                  ) {
                    return {
                      tone: "blocked" as const,
                      text: "El scroll del recorrido se desbloquea cuando completes la animacion inicial.",
                    };
                  }

                  if (node.id === "video-final" && !flags.transitionAnimationViewed) {
                    return {
                      tone: "blocked" as const,
                      text: "Completa el video final para habilitar la salida a la siguiente estacion.",
                    };
                  }

                  if (
                    node.id === "presentacion-inicial-modelo" &&
                    flags.stage1AnimationViewed &&
                    nextNode
                  ) {
                    return {
                      tone: "complete" as const,
                      text: `Presentacion completada. Ya puedes seguir hacia ${nextNode.title}.`,
                    };
                  }

                  if (
                    node.id === "video-final" &&
                    flags.transitionAnimationViewed &&
                    nextNode
                  ) {
                    return {
                      tone: "complete" as const,
                      text: `Cierre completado. Ya puedes seguir hacia ${nextNode.title}.`,
                    };
                  }

                  if (nextNode) {
                    return {
                      tone: "continue" as const,
                      text: `Puedes seguir bajando hacia ${nextNode.title}.`,
                    };
                  }

                  return undefined;
                })()
              : undefined
          }
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
      viewerTitle={stageLabel}
      viewerStatusLabel={viewerStatus.label}
      viewerStatusTone={viewerStatus.tone}
      viewerMeta={[
        {
          label: "Estado",
          value: stageId === "etapa-2"
            ? "Etapa 2 activa"
            : stageCompleted
            ? `${stageName} completada`
            : currentStageMeta
              ? `Etapa ${currentStageMeta.order} activa`
              : `${stageName} activa`,
        },
        {
          label: "Siguiente",
          value: nextStageMeta
            ? `Etapa ${nextStageMeta.order}: ${nextStageMeta.name}`
            : "Sin etapa siguiente publicada",
        },
      ]}
      viewerStageMarkers={viewerStageMarkers}
      viewerEnabled={stageId === "etapa-1" ? flags.stage1AnimationViewed : true}
      shellTone={shellTone}
      backgroundImageSrc={shellBackgroundImage}
      backgroundImageOpacity={shellBackgroundOpacity}
      globalStageButtonVisible={stageId === "etapa-1" ? flags.stage1AnimationViewed : true}
      globalStageItems={STAGE_META.map((item) => ({
        id: item.id,
        name: item.name,
        href: item.href,
        available: item.available,
      }))}
      currentStageId={stageId}
      onGlobalStageNavigate={onNavigate}
    >
      {initialTree.map((node) => renderNode(node))}
    </StageShell>
  );
}
