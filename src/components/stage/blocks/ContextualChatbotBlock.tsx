"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import { BuildLaiaContextUseCase } from "@application/chatbot/usecases/BuildLaiaContextUseCase";
import { LAIA_ASSETS, type LaiaAssetKey } from "@/content/shared/character-assets";
import type { ChatbotPromptItem } from "@/types/stage";
import type { BlockContext } from "./BlockContext";

type ContextualChatbotBlockProps = {
  title: string;
  intro: string;
  prompts: ChatbotPromptItem[];
  continueLabel?: string;
  ctx: BlockContext;
};

const FALLBACK_PROMPT = "Puedes continuar con normalidad aunque no uses esta ayuda.";

const MOOD_TO_ASSET: Record<string, LaiaAssetKey> = {
  neutral: "neutral",
  explain: "explain",
  holo: "holo",
  triumphant: "triumphant",
  confused: "confused",
};

export default function ContextualChatbotBlock({
  title,
  intro,
  prompts,
  continueLabel = "Continuar sin usar esta ayuda",
  ctx,
}: ContextualChatbotBlockProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(prompts[0]?.id ?? null);

  const chatbotContext = useMemo(
    () => new BuildLaiaContextUseCase().execute(ctx.stageId, ctx.state),
    [ctx.stageId, ctx.state]
  );

  const selectedPrompt =
    prompts.find((prompt) => prompt.id === selectedPromptId) ?? prompts[0] ?? null;

  const assetKey = MOOD_TO_ASSET[chatbotContext.mood] ?? "neutral";
  const laiaSrc = LAIA_ASSETS[assetKey];

  return (
    <section className={styles.chatbotCard}>
      <div className={styles.chatbotIntro}>
        <div className={styles.chatbotCharacter}>
          <div className={styles.chatbotCharacterFrame}>
            <Image
              src={laiaSrc}
              alt="Laia como apoyo contextual"
              fill
              className={styles.chatbotCharacterImage}
              unoptimized
            />
          </div>
          <span className={styles.chatbotMoodTag}>Ayuda opcional</span>
        </div>

        <div className={styles.chatbotCopy}>
          <span className={styles.chatbotLabel}>Laia te acompana aqui</span>
          <h3 className={styles.chatbotTitle}>{title}</h3>
          <p className={styles.chatbotBody}>{intro}</p>
          <p className={styles.chatbotHint}>
            Puede ayudarte si quieres aclarar dudas antes del embebido, pero puedes seguir
            avanzando aunque no uses este apoyo.
          </p>
        </div>
      </div>

      <div className={styles.chatbotPromptGrid}>
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            className={`${styles.chatbotPromptButton} ${
              prompt.id === selectedPrompt?.id ? styles.chatbotPromptButtonActive : ""
            }`}
            onClick={() => setSelectedPromptId(prompt.id)}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <div className={styles.chatbotResponseCard}>
        <span className={styles.chatbotResponseLabel}>Respuesta provisional</span>
        <p className={styles.chatbotResponseText}>
          {selectedPrompt?.response ?? FALLBACK_PROMPT}
        </p>
      </div>

      <div className={styles.chatbotFooter}>
        <p className={styles.chatbotFooterText}>
          Esta version funciona como apoyo contextual hardcodeado mientras se completa el
          chatbot real.
        </p>
        <button
          type="button"
          className={stageStyles.buttonSecondary}
          onClick={() => ctx.onScrollTo("autodiagnostico-embebido")}
        >
          {continueLabel}
        </button>
      </div>
    </section>
  );
}
