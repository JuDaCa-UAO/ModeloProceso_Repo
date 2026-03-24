"use client";

/**
 * PRESENTATION — BlockRenderer
 *
 * El ÚNICO switch del sistema. Despacha cada SectionContentBlock
 * al componente de presentación correspondiente.
 *
 * ANTES: este switch estaba inline en Etapa1Client.tsx (God Component, 562 líneas).
 * AHORA: cada tipo de bloque es un componente independiente, testeable y reutilizable.
 *
 * Para agregar un nuevo tipo de bloque:
 *  1. Crear el componente en components/stage/blocks/
 *  2. Agregar el case aquí
 *  3. Agregar el tipo en types/stage.ts → SectionContentBlock
 *
 * Depende de: BlockContext (presentación), SectionContentBlock (types/stage.ts).
 */

import type { ReactNode } from "react";
import type { SectionContentBlock, SectionNode } from "@/types/stage";
import type { BlockContext } from "./blocks/BlockContext";
import ParagraphsBlock from "./blocks/ParagraphsBlock";
import BulletsBlock from "./blocks/BulletsBlock";
import StateCardsBlock from "./blocks/StateCardsBlock";
import HorizontalRailBlock from "./blocks/HorizontalRailBlock";
import AnimationBlock from "./blocks/AnimationBlock";
import ConsentFormBlock from "./blocks/ConsentFormBlock";
import AutodiagnosticBlock from "./blocks/AutodiagnosticBlock";
import ResultSummaryBlock from "./blocks/ResultSummaryBlock";
import IntentionFormBlock from "./blocks/IntentionFormBlock";
import TransitionAnimationBlock from "./blocks/TransitionAnimationBlock";

const MODEL_INTRO_VIDEO_URL = "/videos/intro-modelo.mp4";

type BlockRendererProps = {
  blocks: SectionContentBlock[];
  section: SectionNode;
  ctx: BlockContext;
  /** Inyección de renders personalizados para bloques de tipo "custom". */
  renderCustom?: (key: string, section: SectionNode) => ReactNode;
};

export default function BlockRenderer({
  blocks,
  section,
  ctx,
  renderCustom,
}: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `${section.id}-${block.type}-${i}`;

        switch (block.type) {
          case "paragraphs":
            return <ParagraphsBlock key={key} paragraphs={block.paragraphs} />;

          case "callout":
            return (
              <div key={key} style={{ borderRadius: 14, border: "1px solid rgba(248,46,53,.14)", background: "rgba(10,6,7,.64)", padding: "14px 16px", display: "grid", gap: 8 }}>
                {block.title ? <h3 style={{ margin: 0, color: "#fff", fontSize: 14, letterSpacing: ".04em" }}>{block.title}</h3> : null}
                <p style={{ margin: 0, color: "#d1d1d1", fontSize: 14, lineHeight: 1.45 }}>{block.body}</p>
              </div>
            );

          case "bullets":
            return <BulletsBlock key={key} title={block.title} items={block.items} />;

          case "horizontal-rail":
            return <HorizontalRailBlock key={key} panels={block.panels} />;

          case "state-cards":
            return <StateCardsBlock key={key} items={block.items} />;

          case "stage1-animation":
            return (
              <AnimationBlock
                key={key}
                ctx={ctx}
                videoSrc={MODEL_INTRO_VIDEO_URL}
                flagToSet="stage1AnimationViewed"
                blockAdvance
                viewerMode="mini-spiral"
              />
            );

          case "consent-form":
            return <ConsentFormBlock key={key} ctx={ctx} />;

          case "autodiagnostic-module":
            return <AutodiagnosticBlock key={key} ctx={ctx} />;

          case "result-summary":
            return <ResultSummaryBlock key={key} ctx={ctx} />;

          case "intention-form":
            return <IntentionFormBlock key={key} ctx={ctx} />;

          case "transition-animation":
            return <TransitionAnimationBlock key={key} ctx={ctx} />;

          case "custom":
            return renderCustom ? renderCustom(block.renderKey, section) : null;

          default:
            return null;
        }
      })}
    </>
  );
}
