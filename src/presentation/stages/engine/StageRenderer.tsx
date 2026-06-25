"use client";

/**
 * STAGE ENGINE — Renderer recursivo dirigido por datos.
 *
 * Recibe el árbol de una etapa (`StageNode[]`) y:
 *   - Renderiza cada nodo de nivel superior como un FRAME progresivo:
 *     el frame N (1-based) se muestra cuando `completedFrames >= N-1`.
 *   - Despacha cada bloque por `BLOCK_REGISTRY[type]` (registro reutilizable).
 *   - Procesa `children` de forma RECURSIVA dentro del frame.
 *   - Inyecta la guía animada de Laia (mano) declarada por el nodo.
 *
 * Una etapa nueva que use bloques existentes no requiere modificar este archivo.
 */

import type { MutableRefObject } from "react";
import Frame from "@/components/stage/Frame";
import ScrollHint from "../shared/ScrollHint";
import GuideHand from "@/components/guide-hand/GuideHand";
import { BLOCK_REGISTRY } from "./blocks";
import type { BlockContext, StageNode } from "./types";

type RendererProps = {
  stageId: string;
  tree: StageNode[];
  completedFrames: number;
  completeFrame: (frameIndex: number) => void;
  pushToast: (text: string) => void;
  notifiedFrames: MutableRefObject<Set<number>>;
};

/** Renderiza los bloques de un nodo y, recursivamente, sus hijos. */
function NodeContent({ node, ctx }: { node: StageNode; ctx: BlockContext }) {
  return (
    <>
      {node.blocks.map((block, i) => {
        const BlockComponent = BLOCK_REGISTRY[block.type];
        if (!BlockComponent) return null;
        return <BlockComponent key={`${node.id}-${block.type}-${i}`} block={block} ctx={ctx} />;
      })}
      {node.children?.map((child) => (
        <NodeContent key={child.id} node={child} ctx={ctx} />
      ))}
    </>
  );
}

function FrameNode({
  node,
  frameNumber,
  done,
  stageId,
  completeFrame,
  pushToast,
  notifiedFrames,
}: {
  node: StageNode;
  frameNumber: number;
  done: boolean;
  stageId: string;
  completeFrame: (frameIndex: number) => void;
  pushToast: (text: string) => void;
  notifiedFrames: MutableRefObject<Set<number>>;
}) {
  const handleComplete = () => {
    completeFrame(frameNumber);
    if (!notifiedFrames.current.has(frameNumber)) {
      notifiedFrames.current.add(frameNumber);
      pushToast("¡Progreso guardado!");
    }
  };

  const ctx: BlockContext = {
    stageId,
    frameNumber,
    frameDone: done,
    completeFrame: handleComplete,
    pushToast,
  };

  const guideStep = node.guide?.[0];

  return (
    <Frame
      id={node.id}
      sectionTitle={node.sectionTitle}
      stageTitle={node.stageTitle}
      backgroundImage={node.backgroundImage}
      overlay={node.overlay}
      hint={node.scrollHintLabel && done ? <ScrollHint label={node.scrollHintLabel} /> : null}
    >
      <NodeContent node={node} ctx={ctx} />

      {guideStep ? (
        <GuideHand
          stageId={stageId}
          guideKey={guideStep.id}
          targetGuideId={guideStep.targetGuideId}
          text={guideStep.text}
          placement={guideStep.placement}
        />
      ) : null}
    </Frame>
  );
}

export default function StageRenderer({
  stageId,
  tree,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: RendererProps) {
  return (
    <>
      {tree.map((node, i) => {
        // Frame i (0-based) visible cuando completedFrames >= i.
        if (completedFrames < i) return null;
        return (
          <FrameNode
            key={node.id}
            node={node}
            frameNumber={i + 1}
            done={completedFrames >= i + 1}
            stageId={stageId}
            completeFrame={completeFrame}
            pushToast={pushToast}
            notifiedFrames={notifiedFrames}
          />
        );
      })}
    </>
  );
}
