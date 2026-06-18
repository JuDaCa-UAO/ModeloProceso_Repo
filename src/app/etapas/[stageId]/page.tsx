/**
 * PRESENTATION — Server Component (App Router)
 *
 * /etapas/[stageId]/page.tsx
 *
 * Ruta dinámica que maneja TODAS las etapas del modelo.
 * Todas siguen el mismo patrón: /etapas/introduccion, /etapas/etapa-1, etc.
 *
 * La ruta antigua /etapa/[stageId] redirige aquí por compatibilidad con
 * progreso guardado en localStorage (ver src/app/etapa/[stageId]/page.tsx).
 *
 * Server Component: valida que la etapa exista antes de enviar HTML.
 * Si la etapa no existe retorna 404 con Next.js notFound().
 */

import { notFound } from "next/navigation";
import { StaticStageContentRepository } from "@infra/persistence/StaticStageContentRepository";
import { GetStageContentUseCase } from "@application/stage/usecases/GetStageContentUseCase";
import { getStageMeta } from "@/content/stages";
import StageClient from "./StageClientLoader";
import { BRAND } from "@/config/brand";
import type { Metadata } from "next";

type Props = { params: Promise<{ stageId: string }> };

// ─── Metadata dinámica por etapa ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);
  if (!meta) return { title: BRAND.shortName };
  return {
    title: `${meta.name} | ${BRAND.shortName}`,
    description: `Etapa ${meta.order} del modelo de proceso para la alfabetización digital de docentes.`,
  };
}

// ─── Server Component ────────────────────────────────────────────────────────────
export default async function StagePage({ params }: Props) {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);

  if (!meta) notFound();

  try {
    const repo = new StaticStageContentRepository();
    const useCase = new GetStageContentUseCase(repo);
    useCase.execute(stageId);
  } catch {
    notFound();
  }

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
