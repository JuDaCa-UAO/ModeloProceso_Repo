import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StaticStageContentRepository } from "@infra/persistence/StaticStageContentRepository";
import { GetStageContentUseCase } from "@application/stage/usecases/GetStageContentUseCase";
import { getStageMeta } from "@/content/stages";
import StageClient from "./StageClient";

type Props = { params: Promise<{ stageId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);
  if (!meta) return { title: "AI TECH-ED" };

  return {
    title: `${meta.name} | AI TECH-ED`,
    description: `Etapa ${meta.order} del modelo de proceso GenAI educativo.`,
  };
}

export default async function StagePage({ params }: Props) {
  const { stageId } = await params;
  const meta = getStageMeta(stageId);

  if (!meta) notFound();

  let tree;
  try {
    const repo = new StaticStageContentRepository();
    const useCase = new GetStageContentUseCase(repo);
    tree = useCase.execute(stageId);
  } catch {
    notFound();
  }

  return <StageClient stageId={stageId} stageName={meta.name} initialTree={tree} />;
}

export function generateStaticParams() {
  return [{ stageId: "etapa-1" }, { stageId: "etapa-2" }];
}
