import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Autodiagnóstico docente", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("explica el tratamiento de datos y exige autorización antes de abrir el formulario", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });

    const card = page.getByTestId("autodiagnostic-card");
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("heading", { name: "Haz tu autodiagnóstico docente" })).toBeVisible();
    await expect(card).toContainText("No constituye una evaluación administrativa");
    await expect(card).toContainText("Ley 1581 de 2012");

    const consent = card.getByRole("checkbox", { name: /autorizo el tratamiento de mis datos personales/i });
    const start = card.getByRole("button", { name: "Comenzar autodiagnóstico" });

    await expect(start).toBeDisabled();
    await consent.check();
    await expect(start).toBeEnabled();
    await start.click();

    const dialog = page.getByRole("dialog", { name: "Haz tu autodiagnóstico docente" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTitle("Haz tu autodiagnóstico docente")).toBeVisible();
  });

  test("no presenta violaciones críticas o serias en la tarjeta de consentimiento", async ({ page }) => {
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });

    const card = page.getByTestId("autodiagnostic-card");
    await card.scrollIntoViewIfNeeded();
    const results = await new AxeBuilder({ page }).include('[data-testid="autodiagnostic-card"]').analyze();
    const critical = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? "")
    );

    expect(critical).toEqual([]);
  });

  test("se adapta a 320 px sin desbordamiento horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/#etapa-1", { waitUntil: "domcontentloaded" });

    const card = page.getByTestId("autodiagnostic-card");
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    const overflows = await card.evaluate((element) => element.scrollWidth > element.clientWidth + 1);

    expect(overflows).toBe(false);
  });
});
