"use client";

/**
 * PRESENTATION - BlockRenderer
 *
 * El unico switch del sistema. Despacha cada SectionContentBlock
 * al componente de presentacion correspondiente.
 *
 * Para agregar un nuevo tipo de bloque:
 *  1. Crear el componente en components/stage/blocks/
 *  2. Agregar el case aqui
 *  3. Agregar el tipo en types/stage.ts -> SectionContentBlock
 */

import type { ReactNode } from "react";
import type { SectionContentBlock, SectionNode } from "@/types/stage";
import type { BlockContext } from "./blocks/BlockContext";
import StageEntryBlock from "./blocks/StageEntryBlock";
import StageHeaderBlock from "./blocks/StageHeaderBlock";
import ParagraphsBlock from "./blocks/ParagraphsBlock";
import BulletsBlock from "./blocks/BulletsBlock";
import StateCardsBlock from "./blocks/StateCardsBlock";
import HorizontalRailBlock from "./blocks/HorizontalRailBlock";
import AnimationBlock from "./blocks/AnimationBlock";
import ConsentFormBlock from "./blocks/ConsentFormBlock";
import AutodiagnosticBlock from "./blocks/AutodiagnosticBlock";
import ScaffoldPanelBlock from "./blocks/ScaffoldPanelBlock";
import TransitionAnimationBlock from "./blocks/TransitionAnimationBlock";

const MODEL_INTRO_VIDEO_URL = "/videos/intro-modelo.mp4";

type BlockRendererProps = {
  blocks: SectionContentBlock[];
  section: SectionNode;
  ctx: BlockContext;
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
          case "stage-entry":
            return (
              <StageEntryBlock
                key={key}
                eyebrow={block.eyebrow}
                copy={block.copy}
                ctaLabel={block.ctaLabel}
                targetId={block.targetId}
                characterSrc={block.characterSrc}
                characterAlt={block.characterAlt}
                ctx={ctx}
              />
            );

          case "stage-header":
            return (
              <StageHeaderBlock
                key={key}
                title={block.title}
                subtitle={block.subtitle}
                stageChip={block.stageChip}
                continuityLabel={block.continuityLabel}
                currentStageLabel={block.currentStageLabel}
              />
            );

          case "paragraphs":
            return <ParagraphsBlock key={key} paragraphs={block.paragraphs} />;

          case "callout":
            return (
              <div
                key={key}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(248,46,53,.14)",
                  background: "rgba(10,6,7,.64)",
                  padding: "14px 16px",
                  display: "grid",
                  gap: 8,
                }}
              >
                {block.title ? (
                  <h3
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontSize: 14,
                      letterSpacing: ".04em",
                    }}
                  >
                    {block.title}
                  </h3>
                ) : null}
                <p
                  style={{
                    margin: 0,
                    color: "#d1d1d1",
                    fontSize: 14,
                    lineHeight: 1.45,
                  }}
                >
                  {block.body}
                </p>
              </div>
            );

          case "bullets":
            return <BulletsBlock key={key} title={block.title} items={block.items} />;

          case "horizontal-rail":
            return <HorizontalRailBlock key={key} panels={block.panels} />;

          case "state-cards":
            return (
              <StateCardsBlock
                key={key}
                items={block.items}
                title={block.title}
                intro={block.intro}
                note={block.note}
                continueHint={block.continueHint}
              />
            );

          case "stage1-animation":
            return (
              <AnimationBlock
                key={key}
                ctx={ctx}
                videoSrc={MODEL_INTRO_VIDEO_URL}
                flagToSet="stage1AnimationViewed"
                blockAdvance
                title="Ubicacion en la espiral"
                description="La presentacion amplia muestra el punto actual del recorrido y desbloquea el acceso global a etapas cuando termina."
                variant="hero"
              />
            );

          case "consent-form":
            return <ConsentFormBlock key={key} ctx={ctx} />;

          case "autodiagnostic-module":
            return <AutodiagnosticBlock key={key} ctx={ctx} />;

          case "transition-animation":
            return <TransitionAnimationBlock key={key} ctx={ctx} />;

          case "scaffold-panel":
            return (
              <ScaffoldPanelBlock
                key={key}
                label={block.label}
                body={block.body}
                items={block.items}
                actions={block.actions}
                tone={block.tone}
              />
            );

          case "custom":
            return renderCustom ? renderCustom(block.renderKey, section) : null;

          default:
            return null;
        }
      })}
    </>
  );
}
