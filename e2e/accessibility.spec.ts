/**
 * Auditoría axe-core sobre los siete estados críticos de la Cartilla.
 *
 * Criterio de aceptación: cero violaciones de impacto `critical` o `serious`
 * en los flujos evaluados. Las violaciones `moderate` y `minor` se registran
 * en `test-results/axe/*.json` para el reporte, pero no bloquean.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  AXE_TAGS,
  blockingViolations,
  describeBlocking,
  markStageScope,
  saveAxeReport,
  settle,
} from "./axe-helpers";

const STAGE_IDS = ["etapa-1", "etapa-2", "etapa-3", "etapa-4", "etapa-5", "etapa-6"] as const;

function axe(page: Parameters<typeof settle>[0]) {
  return new AxeBuilder({ page }).withTags(AXE_TAGS);
}

test.describe("Accesibilidad · axe-core", () => {
  test.beforeEach(async ({ page }) => {
    // La cartilla revela contenido con GSAP/ScrollTrigger; en modo reducido el
    // estado final se aplica de inmediato y axe evalúa el DOM ya visible.
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("estado 1 · página inicial", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    const results = await axe(page).analyze();
    const report = saveAxeReport(
      {
        slug: "01-pagina-inicial",
        state: "Página inicial",
        url: "/",
        scope: "Documento completo",
        notes: "Única corrida sin acotar: cubre las reglas de nivel documento (lang, title, landmarks, bypass).",
      },
      results
    );

    expect(describeBlocking(blockingViolations(results)), `Hallazgos bloqueantes: ${report.totals.blocking}`).toEqual([]);
  });

  test("estado 2 · selector de etapas", async ({ page }) => {
    await page.goto("/#navegacion-etapas", { waitUntil: "domcontentloaded" });
    await settle(page);

    const selector = page.locator("#navegacion-etapas");
    await selector.scrollIntoViewIfNeeded();
    await expect(selector.getByRole("heading", { name: "Explora las seis etapas" })).toBeVisible();
    await expect(selector.getByRole("navigation", { name: "Ir directamente a una etapa" })).toBeVisible();
    await expect(selector.getByRole("link")).toHaveCount(STAGE_IDS.length);

    const results = await axe(page).include("#navegacion-etapas").analyze();
    const report = saveAxeReport(
      {
        slug: "02-selector-etapas",
        state: "Selector de etapas",
        url: "/#navegacion-etapas",
        scope: "#navegacion-etapas (espiral WebGL, guía LaIA y lista textual de las 6 etapas)",
      },
      results
    );

    expect(describeBlocking(blockingViolations(results)), `Hallazgos bloqueantes: ${report.totals.blocking}`).toEqual([]);
  });

  test("estado 3 · etapa completa", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });
    await settle(page);

    const blocking: string[] = [];

    for (const [index, stageId] of STAGE_IDS.entries()) {
      const nextStageId = STAGE_IDS[index + 1] ?? null;
      const marker = `stage-${index + 1}`;
      const marked = await markStageScope(page, stageId, nextStageId, marker);
      expect(marked, `No se pudo acotar #${stageId}`).toBeGreaterThan(0);

      await page.locator(`#${stageId}`).scrollIntoViewIfNeeded();
      await settle(page);

      const results = await axe(page).include(`[data-axe-scope="${marker}"]`).analyze();
      const report = saveAxeReport(
        {
          slug: `03-etapa-completa-${index + 1}`,
          state: `Etapa completa · Etapa ${index + 1}`,
          url: `/#${stageId}`,
          scope: `Portada + LaIA + secciones de contenido + cierre de #${stageId} (${marked} secciones)`,
          notes:
            index === 0
              ? "Estado 3 del criterio de aceptación. Las etapas 2 a 6 se auditan con el mismo alcance como cobertura complementaria."
              : "Cobertura complementaria con el mismo alcance que la Etapa 1.",
        },
        results
      );

      blocking.push(...describeBlocking(blockingViolations(results)).map((line) => `${stageId}: ${line}`));
      expect(report.totals.violations, `Reporte generado para ${stageId}`).toBeGreaterThanOrEqual(0);
    }

    expect(blocking).toEqual([]);
  });

  test("estado 4 · diálogo de recurso", async ({ page }) => {
    await page.goto("/#etapa-2", { waitUntil: "domcontentloaded" });
    await settle(page);

    const card = page.getByTestId("downloadable-card").filter({ hasText: "Matriz de Pugh" });
    await card.scrollIntoViewIfNeeded();

    const trigger = card.getByRole("button", { name: "Ver vista previa de Matriz de Pugh" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Matriz de Pugh" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cerrar" })).toBeFocused();
    await expect(dialog.getByRole("img")).toBeVisible();

    const results = await axe(page).include("dialog[open]").analyze();
    const report = saveAxeReport(
      {
        slug: "04-dialogo-recurso",
        state: "Diálogo de recurso",
        url: "/#etapa-2",
        scope: "dialog[open] · vista previa de la Matriz de Pugh (AccessibleDialog)",
        notes: "Diálogo modal nativo abierto con showModal(); el foco entra en «Cerrar».",
      },
      results
    );

    // El cierre por Escape devuelve el foco al disparador: parte del mismo flujo.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    expect(describeBlocking(blockingViolations(results)), `Hallazgos bloqueantes: ${report.totals.blocking}`).toEqual([]);
  });

  test("estado 5 · autodiagnóstico abierto", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });
    await settle(page);

    const card = page.getByTestId("autodiagnostic-card");
    await card.scrollIntoViewIfNeeded();

    await card.getByRole("checkbox").check();
    const start = card.getByRole("button", { name: /comenzar/i });
    await expect(start).toBeEnabled();
    await start.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("iframe")).toHaveCount(1);
    await expect(dialog.getByRole("button", { name: "Cerrar" })).toBeFocused();

    // El formulario embebido es de un sistema externo (n8n) fuera del alcance
    // de esta cartilla: se excluye su contenido y se desactiva `frame-tested`,
    // que solo reporta la imposibilidad de auditar ese iframe de terceros.
    const results = await axe(page)
      .include("dialog[open]")
      .exclude("dialog[open] iframe")
      .disableRules(["frame-tested"])
      .analyze();

    const report = saveAxeReport(
      {
        slug: "05-autodiagnostico-abierto",
        state: "Autodiagnóstico abierto",
        url: "/#etapa-1",
        scope: "dialog[open] del autodiagnóstico, excluyendo el contenido del iframe de n8n",
        notes:
          "El formulario embebido pertenece a un sistema externo (n8n) y no forma parte de esta base de código; se audita el contenedor accesible, no el documento de terceros.",
      },
      results
    );

    expect(describeBlocking(blockingViolations(results)), `Hallazgos bloqueantes: ${report.totals.blocking}`).toEqual([]);
  });

  test("estado 6 · formulario de consentimiento", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });
    await settle(page);

    const card = page.getByTestId("autodiagnostic-card");
    await card.scrollIntoViewIfNeeded();

    const consent = card.getByRole("checkbox");
    const start = card.getByRole("button", { name: /comenzar/i });

    // Estado inicial: sin autorización el CTA está deshabilitado.
    await expect(start).toBeDisabled();
    await expect(card.getByText("Marca la autorización para habilitar el autodiagnóstico.")).toBeVisible();

    const beforeConsent = await axe(page).include('[data-testid="autodiagnostic-card"]').analyze();
    const beforeReport = saveAxeReport(
      {
        slug: "06-formulario-consentimiento",
        state: "Formulario de consentimiento (sin autorizar)",
        url: "/#etapa-1",
        scope: '[data-testid="autodiagnostic-card"] · aviso de privacidad, casilla de autorización y CTA deshabilitado',
      },
      beforeConsent
    );

    // Estado autorizado: cambia el mensaje aria-live y se habilita el CTA.
    await consent.check();
    await expect(start).toBeEnabled();
    await expect(card.getByText("Autorización confirmada. Ya puedes comenzar.")).toBeVisible();

    const afterConsent = await axe(page).include('[data-testid="autodiagnostic-card"]').analyze();
    const afterReport = saveAxeReport(
      {
        slug: "06b-formulario-consentimiento-autorizado",
        state: "Formulario de consentimiento (autorizado)",
        url: "/#etapa-1",
        scope: '[data-testid="autodiagnostic-card"] · casilla marcada, mensaje aria-live actualizado y CTA habilitado',
      },
      afterConsent
    );

    expect(
      [
        ...describeBlocking(blockingViolations(beforeConsent)).map((line) => `sin autorizar: ${line}`),
        ...describeBlocking(blockingViolations(afterConsent)).map((line) => `autorizado: ${line}`),
      ],
      `Hallazgos bloqueantes: ${beforeReport.totals.blocking + afterReport.totals.blocking}`
    ).toEqual([]);
  });

  test("estado 7 · reflexión guardada", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });
    await settle(page);

    const save = page.getByRole("button", { name: "Guardar reflexión" }).first();
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeVisible();

    // El cierre de etapa es un `section` sin identificador estable: se marca
    // desde el botón de guardado antes de que este desaparezca al guardar.
    await save.evaluate((element) => {
      element.closest("section")?.setAttribute("data-axe-scope", "reflection");
    });

    const closing = page.locator('[data-axe-scope="reflection"]');
    await expect(closing).toHaveCount(1);

    const textarea = closing.getByRole("textbox");
    await expect(save).toBeDisabled();
    await textarea.fill("Quiero identificar en qué punto estoy antes de rediseñar mi curso con GenAI.");
    await expect(save).toBeEnabled();
    await save.click();

    // Estado guardado: la respuesta se muestra como texto y aparece «Modificar respuesta».
    await expect(closing.getByText("Quiero identificar en qué punto estoy antes de rediseñar mi curso con GenAI.")).toBeVisible();
    await expect(closing.getByRole("button", { name: "Modificar respuesta" })).toBeVisible();
    await expect(closing.getByRole("textbox")).toHaveCount(0);
    expect(
      await page.evaluate(() => localStorage.getItem("reflection_stage_01")),
      "La reflexión se persiste en localStorage por etapa"
    ).toContain("Quiero identificar");

    const results = await axe(page).include('[data-axe-scope="reflection"]').analyze();
    const report = saveAxeReport(
      {
        slug: "07-reflexion-guardada",
        state: "Reflexión guardada",
        url: "/#etapa-1",
        scope: "Cierre de la Etapa 1 con la reflexión ya guardada (texto persistido + «Modificar respuesta»)",
        notes: "La reflexión se guarda en localStorage (`reflection_stage_01`); no se envía a ningún servidor.",
      },
      results
    );

    expect(describeBlocking(blockingViolations(results)), `Hallazgos bloqueantes: ${report.totals.blocking}`).toEqual([]);
  });
});
