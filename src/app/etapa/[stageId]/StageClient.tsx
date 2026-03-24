/**
 * PRESENTATION — Client Component (Stage Engine)
 *
 * StageClient: motor genérico de renderizado de etapas.
 * Usa StageSection como componentes separados y persiste el progreso
 * de secciones continuadas en el store.
 */

"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import StageShell from "@/components/stage/StageShell";
import StageSection from "@/components/stage/StageSection";
import {
  SectionContinueDock,
  SectionScrollProgress,
} from "@/components/stage/SectionScrollChrome";
import { SectionScrollProvider } from "@/contexts/SectionScrollContext";
import { useStageProgress } from "@/hooks/domain/useStageProgress";
import { useProgressiveReveal } from "@/hooks/ui/useProgressiveReveal";
import { useSectionScrollGate } from "@/hooks/ui/useSectionScrollGate";
import { hasRequiredFlags } from "@domain/stage/rules/GatingRule";
import { getContinueRequires, sectionNeedsContinueButton } from "@/lib/sectionScrollFlow";
import { writeProgress } from "@/lib/progress";
import type { SectionNode } from "@/types/stage";
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

function buildNodeById(nodes: SectionNode[]): Map<string, SectionNode> {
  const m = new Map<string, SectionNode>();
  const walk = (items: SectionNode[]) => {
    for (const item of items) {
      m.set(item.id, item);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(nodes);
  return m;
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
  const nodeById = useMemo(() => buildNodeById(initialTree), [initialTree]);

  const { orderedVisibleIds, visibleIndexById } = useMemo(() => {
    const ordered: string[] = [];
    const walk = (nodes: SectionNode[]) => {
      for (const node of nodes) {
        if (!hasRequiredFlags(flags, node.gate?.requires)) continue;
        ordered.push(node.id);
        if (node.children?.length) walk(node.children);
      }
    };
    walk(initialTree);
    return {
      orderedVisibleIds: ordered,
      visibleIndexById: new Map(ordered.map((id, i) => [id, i + 1])),
    };
  }, [flags, initialTree]);

  /** Progreso persistido: secciones ya continuadas. */
  const continuedSectionIds = useMemo(
    () => new Set(state.continuedSectionIds ?? []),
    [state.continuedSectionIds]
  );

  const sectionScrollRefs = useRef(new Map<string, HTMLElement>());

  const { activeId, revealed, registerSectionRef: revealRegister } = useProgressiveReveal({
    ids: allIds,
    threshold: 0.14,
    rootMargin: "0px 0px -18% 0px",
  });

  const registerSectionRef = useCallback(
    (id: string, node: HTMLElement | null) => {
      if (node) sectionScrollRefs.current.set(id, node);
      else sectionScrollRefs.current.delete(id);
      revealRegister(id, node);
    },
    [revealRegister]
  );

  const blockingSectionId = useMemo(() => {
    for (const id of orderedVisibleIds) {
      if (continuedSectionIds.has(id)) continue;
      const n = nodeById.get(id);
      if (n && sectionNeedsContinueButton(n)) return id;
    }
    return null;
  }, [orderedVisibleIds, continuedSectionIds, nodeById]);

  const getCanContinue = useCallback(
    (id: string) => {
      const n = nodeById.get(id);
      if (!n) return false;
      const reqs = getContinueRequires(n);
      return reqs.length === 0 || hasRequiredFlags(flags, reqs);
    },
    [nodeById, flags]
  );

  const blockingNode = blockingSectionId ? nodeById.get(blockingSectionId) ?? null : null;
  const continueDisabled =
    blockingNode !== null &&
    getContinueRequires(blockingNode).length > 0 &&
    !hasRequiredFlags(flags, getContinueRequires(blockingNode));

  const nextSectionId = blockingSectionId
    ? orderedVisibleIds[orderedVisibleIds.indexOf(blockingSectionId) + 1] ?? null
    : null;

  useSectionScrollGate({
    blockingSectionId,
    nextSectionId,
    sectionRefs: sectionScrollRefs,
    shouldBlock: Boolean(blockingSectionId) && !continueDisabled,
  });

  const onContinueSection = useCallback(
    (id?: string) => {
      const targetId = id ?? blockingSectionId;
      if (!targetId) return;
      const node = nodeById.get(targetId);
      if (node) {
        const reqs = getContinueRequires(node);
        if (reqs.length > 0 && !hasRequiredFlags(flags, reqs)) return;
      }
      const nextIds = [...(state.continuedSectionIds ?? []), targetId];
      update({ continuedSectionIds: nextIds });
      const idx = orderedVisibleIds.indexOf(targetId);
      const next = orderedVisibleIds[idx + 1];
      if (next) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.getElementById(next)?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        });
      }
    },
    [
      blockingSectionId,
      nodeById,
      flags,
      orderedVisibleIds,
      state.continuedSectionIds,
      update,
    ]
  );

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

  const viewerStatus = flags.transitionAnimationViewed
    ? { label: "Lista para siguiente etapa", tone: "done" as const }
    : { label: `${stageName} activa`, tone: "active" as const };

  const renderNode = (node: SectionNode): React.ReactNode => {
    if (!hasRequiredFlags(flags, node.gate?.requires)) return null;

    const index = visibleIndexById.get(node.id) ?? 0;
    const activeIndex = Math.max(0, orderedVisibleIds.indexOf(activeId));

    return (
      <Fragment key={node.id}>
        <StageSection
          node={node}
          index={index}
          active={activeId === node.id}
          revealed={revealed.has(node.id)}
          activeIndex={activeIndex}
          registerRef={registerSectionRef}
          ctx={ctx}
          flags={flags}
        />
        {node.children?.map((child) => renderNode(child))}
      </Fragment>
    );
  };

  const scrollProgressEl =
    orderedVisibleIds.length > 0 ? (
      <SectionScrollProgress
        orderedIds={orderedVisibleIds}
        activeId={activeId}
        continuedIds={continuedSectionIds}
      />
    ) : null;

  return (
    <SectionScrollProvider
      continuedIds={continuedSectionIds}
      onContinue={onContinueSection}
      blockingSectionId={blockingSectionId}
      getCanContinue={getCanContinue}
      onScrollTo={onScrollTo}
    >
      <StageShell
        viewerTitle={stageName}
        viewerStatusLabel={viewerStatus.label}
        viewerStatusTone={viewerStatus.tone}
        scrollProgress={scrollProgressEl}
        viewerEnabled={state.stage1AnimationStarted || flags.stage1AnimationViewed}
      >
        {initialTree.map((node) => renderNode(node))}
        <SectionContinueDock
          visible={Boolean(blockingSectionId)}
          sectionTitle={blockingNode?.title ?? ""}
          continueDisabled={continueDisabled}
          onContinue={() => onContinueSection()}
        />
      </StageShell>
    </SectionScrollProvider>
  );
}
