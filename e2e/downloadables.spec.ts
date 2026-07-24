import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const DOWNLOADABLES: Array<{
  path: string;
  previewPath: string;
  oldPath?: string;
  oldPreviewPath?: string;
}> = [
  {
    path: "/media/descargables/etapa-2/matriz-pugh/matriz-pugh.pdf",
    previewPath: "/media/descargables/etapa-2/matriz-pugh/preview-matriz-pugh.png",
    oldPath: "/media/etapa-2/Matriz-de-Pugh.pdf",
  },
  {
    path: "/media/descargables/etapa-3/canvas-diseno/canvas-etapa-3-diseno.pdf",
    previewPath: "/media/descargables/etapa-3/canvas-diseno/preview-canvas-etapa-3-diseno.png",
    oldPath: "/media/etapa-3/Canvas-de-diseno.pdf",
    oldPreviewPath: "/media/etapa-3/Canvas_etapa3.png",
  },
  {
    path: "/media/descargables/etapa-3/matriz-experiencia/matriz-de-la-experiencia.pdf",
    previewPath: "/media/descargables/etapa-3/matriz-experiencia/preview-matriz-de-la-experiencia.png",
  },
  {
    path: "/media/descargables/etapa-4/canvas-alistamiento/canvas-etapa-4-alistamiento.pdf",
    previewPath: "/media/descargables/etapa-4/canvas-alistamiento/preview-canvas-etapa-4-alistamiento.png",
    oldPath: "/media/etapa-4/descargas/Canvas-de-alistamiento-GenAI.pdf",
  },
  {
    path: "/media/descargables/etapa-6/canvas-evaluacion/canvas-etapa-6-evaluacion.pdf",
    previewPath: "/media/descargables/etapa-6/canvas-evaluacion/preview-canvas-etapa-6-evaluacion.png",
    oldPath: "/media/etapa-6/descargas/Canvas-de-evaluacion-GenAI.pdf",
  },
];

async function revealStage(page: Page, stageId: string) {
  void stageId;
  const firstCard = page.getByTestId("downloadable-card").first();
  await firstCard.scrollIntoViewIfNeeded();
  return page.locator("body");
}

test.describe("Descargables pedagógicos", () => {
  test("explica la Matriz de Pugh y conserva el foco al cerrar la vista previa", async ({ page }) => {
    await page.goto("/#etapa-2", { waitUntil: "domcontentloaded" });
    const stage = await revealStage(page, "etapa-2");

    await expect(stage.getByText("¿Qué es la Matriz de Pugh?", { exact: true })).toBeVisible();
    await expect(stage.getByRole("heading", { name: "Cómo usarla" })).toBeVisible();
    await expect(stage.locator("ol")).toHaveCount(1);

    const card = stage.getByTestId("downloadable-card").filter({ hasText: "Matriz de Pugh" });
    const informationButton = card.getByRole("button", { name: /información de Matriz de Pugh/i });
    await expect(informationButton).toHaveAttribute("aria-expanded", "false");
    await informationButton.click();
    await expect(card.getByRole("region", { name: "Información importante" })).toContainText(
      "Etapa 2: Exploración"
    );
    await expect(informationButton).toHaveAttribute("aria-expanded", "true");
    await informationButton.click();
    await expect(card.getByRole("region", { name: "Información importante" })).toHaveCount(0);
    const trigger = card.getByRole("button", { name: "Ver vista previa de Matriz de Pugh" });
    await expect(card.getByRole("img")).toHaveAttribute("alt", /Previsualización de la Matriz de Pugh/);
    await expect(card.getByRole("link", { name: "Descargar PDF" })).toHaveAttribute(
      "href",
      DOWNLOADABLES[0].path
    );
    await expect(card.getByRole("link", { name: "Abrir recurso" })).toHaveAttribute("target", "_blank");
    const resourceLinks = card.getByRole("link");
    await expect(resourceLinks).toHaveCount(2);
    await expect(resourceLinks.nth(0)).toHaveText("Abrir recurso");
    await expect(resourceLinks.nth(1)).toHaveText("Descargar PDF");

    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Matriz de Pugh" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveAttribute("alt", /Previsualización de la Matriz de Pugh/);
    await expect(dialog.getByRole("button", { name: "Cerrar" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("muestra los cinco recursos en sus etapas pedagógicas", async ({ page }) => {
    await page.goto("/#etapa-3", { waitUntil: "domcontentloaded" });
    const stage3 = await revealStage(page, "etapa-3");
    await expect(stage3.getByTestId("downloadable-card").filter({ hasText: "Canvas de diseño" })).toBeVisible();
    await expect(stage3.getByTestId("downloadable-card").filter({ hasText: "Matriz de la experiencia" })).toBeVisible();

    await page.goto("/#etapa-4", { waitUntil: "domcontentloaded" });
    const stage4 = await revealStage(page, "etapa-4");
    await expect(stage4.getByTestId("downloadable-card").filter({ hasText: "Canvas de alistamiento" })).toBeVisible();

    await page.goto("/#etapa-6", { waitUntil: "domcontentloaded" });
    const stage6 = await revealStage(page, "etapa-6");
    await expect(stage6.getByTestId("downloadable-card").filter({ hasText: "Canvas de evaluación" })).toBeVisible();
  });

  test("sirve los PDFs nuevos y redirige las rutas antiguas", async ({ request }) => {
    for (const resource of DOWNLOADABLES) {
      const response = await request.get(resource.path);
      expect(response.status(), resource.path).toBe(200);
      expect(response.headers()["content-type"], resource.path).toContain("application/pdf");

      const preview = await request.get(resource.previewPath);
      expect(preview.status(), resource.previewPath).toBe(200);
      expect(preview.headers()["content-type"], resource.previewPath).toContain("image/png");

      if (resource.oldPath) {
        const legacy = await request.get(resource.oldPath, { maxRedirects: 0 });
        expect(legacy.status(), resource.oldPath).toBe(308);
        expect(legacy.headers().location, resource.oldPath).toBe(resource.path);
      }

      if (resource.oldPreviewPath) {
        const legacyPreview = await request.get(resource.oldPreviewPath, { maxRedirects: 0 });
        expect(legacyPreview.status(), resource.oldPreviewPath).toBe(308);
        expect(legacyPreview.headers().location, resource.oldPreviewPath).toBe(resource.previewPath);
      }
    }
  });

  test("mantiene el diálogo de preview sin violaciones críticas o serias", async ({ page }) => {
    await page.goto("/#etapa-2", { waitUntil: "domcontentloaded" });
    const stage = await revealStage(page, "etapa-2");
    const card = stage.getByTestId("downloadable-card").filter({ hasText: "Matriz de Pugh" });
    await card.getByRole("button", { name: "Ver vista previa de Matriz de Pugh" }).click();

    const results = await new AxeBuilder({ page }).include("dialog").analyze();
    const critical = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
    expect(critical).toEqual([]);
  });

  test("se adapta sin desbordamiento horizontal en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/#etapa-2", { waitUntil: "domcontentloaded" });
    const stage = await revealStage(page, "etapa-2");
    const card = stage.getByTestId("downloadable-card").filter({ hasText: "Matriz de Pugh" });
    await expect(card).toBeVisible();
    const cardWidth = await card.evaluate((element) => element.getBoundingClientRect().width);
    expect(cardWidth).toBeLessThanOrEqual(320);
    const cardOverflows = await card.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
    expect(cardOverflows).toBe(false);
  });
});
