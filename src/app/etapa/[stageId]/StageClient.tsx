/**
 * PRESENTATION — Client Component (Stage Engine)
 *
 * StageClient: motor genérico de renderizado de etapas.
 * Renderiza las secciones como una página normal sin sistemas de scroll custom.
 */

"use client";

import { Fragment, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import StageShell from "@/components/stage/StageShell";
import StageSection from "@/components/stage/StageSection";
import { useStageProgress } from "@/hooks/domain/useStageProgress";
import { hasRequiredFlags } from "@domain/stage/rules/GatingRule";
import { writeProgress } from "@/lib/progress";
import type { SectionNode } from "@/types/stage";
import type { BlockContext } from "@/components/stage/blocks/BlockContext";

// ─── helpers ──────────────────────────────────────────────────────────────────

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

    return (
      <Fragment key={node.id}>
        <StageSection
          node={node}
          index={index}
          ctx={ctx}
          flags={flags}
        />
        {node.children?.map((child) => renderNode(child))}
      </Fragment>
    );
  };

  return (
    <StageShell
      viewerTitle={stageName}
      viewerStatusLabel={viewerStatus.label}
      viewerStatusTone={viewerStatus.tone}
      viewerEnabled={state.stage1AnimationStarted || flags.stage1AnimationViewed}
    >
      {initialTree.map((node) => renderNode(node))}
    </StageShell>
  );
}
