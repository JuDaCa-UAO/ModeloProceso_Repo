import type { SectionNode, StageFlagKey } from "@/types/stage";

/** Flags que deben cumplirse para habilitar «Continuar» en una sección. */
export function getContinueRequires(node: SectionNode): StageFlagKey[] {
  if (node.scrollFlow?.skipContinue) return [];
  const keys = new Set<StageFlagKey>();
  if (node.gate?.completionFlag) keys.add(node.gate.completionFlag);
  for (const k of node.scrollFlow?.continueRequires ?? []) keys.add(k);
  return [...keys];
}

export function sectionNeedsContinueButton(node: SectionNode): boolean {
  return !node.scrollFlow?.skipContinue;
}
