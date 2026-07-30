import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import type { AxeResults, ImpactValue, Result } from "axe-core";

/** Directorio de artefactos JSON que alimenta el reporte en Markdown. */
export const AXE_OUTPUT_DIR = resolve(process.cwd(), "test-results", "axe");

/**
 * Etiquetas WCAG evaluadas: A y AA de WCAG 2.0/2.1/2.2 más las buenas
 * prácticas de axe. Las buenas prácticas se registran pero no bloquean:
 * el criterio de aceptación solo cubre `critical` y `serious`.
 */
export const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export const BLOCKING_IMPACTS: ImpactValue[] = ["critical", "serious"];

export type AxeStateReport = {
  slug: string;
  state: string;
  url: string;
  scope: string;
  notes?: string;
  timestamp: string;
  totals: {
    violations: number;
    blocking: number;
    passes: number;
    incomplete: number;
    inapplicable: number;
  };
  byImpact: Record<string, number>;
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: Array<{ target: string; html: string; failureSummary: string }>;
  }>;
  incomplete: Array<{ id: string; impact: string; help: string; nodes: number }>;
};

/** Serializa un resultado de axe en el formato del reporte y lo guarda en disco. */
export function saveAxeReport(
  input: { slug: string; state: string; url: string; scope: string; notes?: string },
  results: AxeResults
): AxeStateReport {
  const byImpact = results.violations.reduce<Record<string, number>>((acc, violation) => {
    const impact = violation.impact ?? "sin-impacto";
    acc[impact] = (acc[impact] ?? 0) + violation.nodes.length;
    return acc;
  }, {});

  const report: AxeStateReport = {
    ...input,
    timestamp: new Date().toISOString(),
    totals: {
      violations: results.violations.length,
      blocking: blockingViolations(results).length,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
    },
    byImpact,
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? "sin-impacto",
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map((node) => ({
        target: node.target.map(String).join(" >> "),
        html: node.html,
        failureSummary: node.failureSummary ?? "",
      })),
    })),
    incomplete: results.incomplete.map((item) => ({
      id: item.id,
      impact: item.impact ?? "sin-impacto",
      help: item.help,
      nodes: item.nodes.length,
    })),
  };

  mkdirSync(AXE_OUTPUT_DIR, { recursive: true });
  writeFileSync(resolve(AXE_OUTPUT_DIR, `${input.slug}.json`), JSON.stringify(report, null, 2), "utf8");
  return report;
}

/** Violaciones que incumplen el criterio de aceptación (críticas o serias). */
export function blockingViolations(results: AxeResults): Result[] {
  return results.violations.filter((violation) =>
    BLOCKING_IMPACTS.includes((violation.impact ?? "minor") as ImpactValue)
  );
}

/** Mensaje legible usado en el `expect` para que el fallo explique el hallazgo. */
export function describeBlocking(violations: Result[]): string[] {
  return violations.map(
    (violation) =>
      `[${violation.impact}] ${violation.id}: ${violation.help} → ${violation.nodes
        .map((node) => node.target.map(String).join(" "))
        .join(" | ")}`
  );
}

/**
 * `StageChapter` renderiza un fragmento: portada, LaIA, secciones y cierre son
 * hermanos directos del contenedor de scroll, sin envoltorio propio. Para poder
 * pasar "una etapa completa" a `AxeBuilder.include()` se marcan en el DOM todos
 * los hermanos desde `#etapa-N` hasta justo antes de `#etapa-N+1`.
 */
export async function markStageScope(page: Page, stageId: string, nextStageId: string | null, marker: string) {
  const marked = await page.evaluate(
    ({ stageId, nextStageId, marker }) => {
      document
        .querySelectorAll(`[data-axe-scope="${marker}"]`)
        .forEach((element) => element.removeAttribute("data-axe-scope"));

      const start = document.getElementById(stageId);
      if (!start) return 0;
      const stop = nextStageId ? document.getElementById(nextStageId) : null;

      let node: Element | null = start;
      let count = 0;
      while (node && node !== stop) {
        node.setAttribute("data-axe-scope", marker);
        count += 1;
        node = node.nextElementSibling;
      }
      return count;
    },
    { stageId, nextStageId, marker }
  );

  return marked;
}

/** Espera a que GSAP haya revelado el contenido (con reduced-motion es inmediato). */
export async function settle(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(600);
}
