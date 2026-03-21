import type { IStageContentRepository } from "@domain/stage/repositories/IStageContentRepository";
import type { SectionNode } from "@/types/stage";
import { STAGE1_TREE } from "@/content/stages/stage-1.content";
import { STAGE2_TREE } from "@/content/stages/stage-2.content";

const STAGE_REGISTRY: Record<string, SectionNode[]> = {
  "etapa-1": STAGE1_TREE,
  "etapa-2": STAGE2_TREE,
};

export class StaticStageContentRepository implements IStageContentRepository {
  getTree(stageId: string): SectionNode[] | null {
    return STAGE_REGISTRY[stageId] ?? null;
  }

  listStageIds(): string[] {
    return Object.keys(STAGE_REGISTRY);
  }
}
