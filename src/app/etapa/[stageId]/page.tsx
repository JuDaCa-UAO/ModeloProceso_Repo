/**
 * PRESENTATION — Server Component (App Router)
 *
 * /etapa/[stageId]/page.tsx
 *
 * Ruta dinámica que maneja TODAS las etapas del modelo (etapa-1, etapa-2, etc.)
 * Reemplaza la estructura anterior de rutas estáticas aisladas:
 *   /app/etapa-1/  (kebab inconsistente)
 *   /app/etapa2/   (sin guión)
 *
 * Ahora todas siguen el mismo patrón: /etapa/etapa-1, /etapa/etapa-2, etc.
 *
 * Server Component: obtiene el contenido de la etapa antes de enviar HTML.
 * Si la etapa no existe retorna 404 con Next.js notFound().
 */

import { notFound } from "next/navigation";
import { StaticStageContentRepository } from "@infra/persistence/StaticStageContentRepository";
import { getStageMeta } from "@/content/stages";
import StageClient from "./StageClientLoader";
import type { Metadata } from "next";

type Props = { params: Promise<{ stageId: string }> };

// ─── Metadata dinámica por etapa ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);
  if (!meta) return { title: "AI TECH-ED" };
  return {
    title: `${meta.name} | AI TECH-ED`,
    description: `Etapa ${meta.order} del modelo de proceso GenAI educativo.`,
  };
}

// ─── Server Component ────────────────────────────────────────────────────────────
export default async function StagePage({ params }: Props) {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);

  if (!meta) notFound();

  return (
    <StageClient
      stageId={stageId}
      stageName={meta.name}
    />
  );
}

// ─── Pre-renderizado estático de etapas disponibles ──────────────────────────────
// Derivado del registro canónico: al agregar una etapa en StaticStageContentRepository
// y en STAGE_META, automáticamente se incluye en el build estático sin tocar este archivo.
export function generateStaticParams() {
  const repo = new StaticStageContentRepository();
  return repo.listStageIds().map((stageId) => ({ stageId }));
}
