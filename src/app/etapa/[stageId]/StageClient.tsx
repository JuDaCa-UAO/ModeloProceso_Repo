/**
 * PRESENTATION — Client Component (Stage Engine)
 *
 * StageClient: motor genérico de renderizado de etapas.
 *
 * ANTES: Etapa1Client.tsx — 562 líneas, acoplado a etapa 1, con:
 *   - 2 funciones de lógica de negocio inline
 *   - 1 URL de N8N hardcodeada
 *   - 1 switch de 10 casos embebido
 *   - Lógica de flags calculada en el componente
 *
 * AHORA: ~100 líneas, genérico por stageId, con:
 *   - Zero lógica de negocio (delegada a Application)
 *   - Zero URLs hardcodeadas (en Infrastructure)
 *   - BlockRenderer externo (un componente por bloque)
 *   - Flags calculados por EvaluateFlagsUseCase
 *
 * Depende de: useStageProgress (hook domain), StageShell, BlockRenderer,
 *             ProgressiveSection, DialogueBlock, GatingRule (dominio).
 */

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

// ─── helpers ──────────────────────────────────────────────────────────────────

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

// ─── Props ────────────────────────────────────────────────────────────────────

type StageClientProps = {
  stageId: string;
  stageName: string;
  initialTree: SectionNode[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StageClient({
  stageId,
  stageName,
  initialTree,
}: StageClientProps) {
  const router = useRouter();
  const { state, flags, update } = useStageProgress(stageId);

  const allIds = useMemo(() => flatIds(initialTree), [initialTree]);
  const { activeId, revealed, registerSectionRef } = useProgressiveReveal({
    ids: allIds,
    threshold: 0.14,
    rootMargin: "0px 0px -18% 0px",
  });

  // Registra el inicio de la etapa en el progreso global de navegación
  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapa/${stageId}` });
  }, [stageId]);

  const onScrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    [stageId, state, flags, update, onScrollTo, onNavigate]
  );

  // ── Viewer sidebar metadata ─────────────────────────────────────────────────
  const viewerStatus = flags.transitionAnimationViewed
    ? { label: "Lista para siguiente etapa", tone: "done" as const }
    : { label: `${stageName} activa`, tone: "active" as const };

  const completedCount = [
    flags.stage1AnimationViewed,
    flags.consentValidated,
    flags.autodiagnosticCompleted,
    flags.intentionSaved,
    flags.transitionAnimationViewed,
  ].filter(Boolean).length;

  const viewerMeta = [
    { label: "Etapa", value: stageName },
    { label: "Avance", value: `${completedCount}/5 hitos` },
  ];

  // ── Visible index map for section labels ────────────────────────────────────
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

  // ── Action renderer ─────────────────────────────────────────────────────────
  const renderActions = (actions: SectionAction[] | undefined) => {
    if (!actions?.length) return null;
    return (
      <div className={stageStyles.buttonRow}>
        {actions.map((action) => {
          const variant = action.variant ?? "secondary";
          const cls =
            variant === "primary" ? stageStyles.buttonPrimary : stageStyles.buttonSecondary;

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

  // ── Node renderer ────────────────────────────────────────────────────────────
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
          indexLabel={`Sección ${index}`}
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
      viewerMeta={viewerMeta}
      viewerEnabled={state.stage1AnimationStarted || flags.stage1AnimationViewed}
    >
      {initialTree.map((node) => renderNode(node))}
    </StageShell>
  );
}
