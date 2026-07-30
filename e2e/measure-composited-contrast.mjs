/*
 * Mide el contraste real de los nodos que axe deja como `color-contrast`
 * incompleto (texto sobre gradientes, imágenes o canvas WebGL, donde axe no
 * puede resolver el color de fondo efectivo).
 *
 * Método, por franjas del tamaño del viewport:
 *   1. captura con el texto visible;
 *   2. captura con el texto de esos nodos en `transparent`;
 *   3. los píxeles que difieren mucho entre ambas SON los glifos, y su valor en
 *      la captura (2) es el fondo real ya compuesto detrás de la letra;
 *   4. se calcula el contraste del color del texto contra ese fondo y se toma
 *      el peor caso, ignorando los bordes con antialiasing.
 *
 * Medir solo bajo los glifos —y no toda la caja— evita falsos positivos por
 * elementos que se solapan o por píxeles de borde.
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const BASE = process.env.BASE_URL || "http://localhost:3010";
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const VIEWPORT = { width: 1280, height: 720 };
/* Un píxel cuenta como glifo si al ocultar el texto cambió con fuerza. Un
 * umbral alto deja fuera los bordes suavizados, que no son color de texto
 * pleno y que WCAG no evalúa. */
const GLYPH_DIFF = 60;

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const hex = (px) => "#" + px.map((v) => v.toString(16).padStart(2, "0")).join("");

function required(fontSizePx, fontWeight) {
  const bold = Number(fontWeight) >= 700;
  const large = fontSizePx >= 24 || (bold && fontSizePx >= 18.66);
  return large ? 3 : 4.5;
}

const raw = async (buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    await document.fonts?.ready;
  });
  await page.waitForTimeout(1500);

  // Fuerza el revelado de GSAP en toda la página antes de medir.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });

  /* Sin transiciones ni animaciones: varias reglas animan `color` durante 200 ms
   * y una captura tomada a medio camino mezcla el color del texto con el fondo,
   * lo que produce falsos positivos. */
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
  });

  await page.addScriptTag({ content: AXE });

  const nodes = await page.evaluate(async () => {
    const res = await axe.run(document, { runOnly: ["color-contrast"] });
    const out = [];
    for (const item of res.incomplete) {
      for (const node of item.nodes) {
        const el = document.querySelector(node.target.join(" "));
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        const cs = getComputedStyle(el);
        out.push({
          selector: node.target.join(" "),
          color: cs.color,
          fontSize: parseFloat(cs.fontSize),
          fontWeight: cs.fontWeight,
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 45),
          decorative: Boolean(el.closest("[aria-hidden='true']")),
          docX: rect.left + window.scrollX,
          docY: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    return out;
  });

  console.log(`Nodos incompletos de color-contrast: ${nodes.length}`);

  const selectors = nodes.map((n) => n.selector);
  const setTransparent = (on) =>
    page.evaluate(
      ({ sels, on }) => {
        for (const sel of sels) {
          const el = document.querySelector(sel);
          if (!el) continue;
          if (on) {
            el.style.setProperty("color", "transparent", "important");
            el.style.setProperty("text-shadow", "none", "important");
          } else {
            el.style.removeProperty("color");
            el.style.removeProperty("text-shadow");
          }
        }
      },
      { sels: selectors, on }
    );

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const parseRgb = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  const pending = nodes.map((n) => ({ ...n, worst: Infinity, worstPx: null, glyphs: 0 }));

  for (let top = 0; top < pageHeight; top += VIEWPORT.height) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(150);
    const actualTop = await page.evaluate(() => window.scrollY);

    const inBand = pending.filter(
      (n) => n.worst === Infinity && n.docY + n.height > actualTop && n.docY < actualTop + VIEWPORT.height
    );
    if (!inBand.length) continue;

    await setTransparent(false);
    await page.waitForTimeout(250);
    const withText = await raw(await page.screenshot({ animations: "disabled" }));

    await setTransparent(true);
    await page.waitForTimeout(250);
    const noText = await raw(await page.screenshot({ animations: "disabled" }));

    const ch = noText.info.channels;
    const W = noText.info.width;

    for (const n of inBand) {
      const x0 = Math.max(0, Math.floor(n.docX));
      const y0 = Math.max(0, Math.floor(n.docY - actualTop));
      const x1 = Math.min(W, Math.ceil(n.docX + n.width));
      const y1 = Math.min(noText.info.height, Math.ceil(n.docY - actualTop + n.height));
      if (x1 <= x0 || y1 <= y0) continue;

      const [tr, tg, tb] = parseRgb(n.color);
      const tl = lum(tr, tg, tb);
      let worst = Infinity;
      let worstPx = null;
      let glyphs = 0;

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const p = (y * W + x) * ch;
          const diff =
            Math.abs(withText.data[p] - noText.data[p]) +
            Math.abs(withText.data[p + 1] - noText.data[p + 1]) +
            Math.abs(withText.data[p + 2] - noText.data[p + 2]);
          if (diff < GLYPH_DIFF) continue; // no es glifo pleno
          glyphs++;
          const r = ratio(tl, lum(noText.data[p], noText.data[p + 1], noText.data[p + 2]));
          if (r < worst) {
            worst = r;
            worstPx = [noText.data[p], noText.data[p + 1], noText.data[p + 2]];
          }
        }
      }
      n.worst = worst;
      n.worstPx = worstPx;
      n.glyphs = glyphs;
    }
    process.stdout.write(".");
  }
  console.log("");

  await browser.close();

  const measured = pending
    .filter((n) => n.worst !== Infinity && n.glyphs > 0)
    .map((n) => ({ ...n, need: required(n.fontSize, n.fontWeight) }))
    .map((n) => ({ ...n, pass: n.worst >= n.need }));

  const noGlyphs = pending.filter((n) => n.glyphs === 0 || n.worst === Infinity);
  const failing = measured.filter((r) => !r.pass).sort((a, b) => a.worst - b.worst);

  console.log(
    `\nMedidos con glifos: ${measured.length} · cumplen: ${measured.length - failing.length} · ` +
      `incumplen: ${failing.length} · sin glifos visibles (no medibles): ${noGlyphs.length}\n`
  );
  if (failing.length) {
    console.log("INCUMPLEN (fondo real bajo los glifos):");
    for (const r of failing) {
      console.log(
        `  ${r.worst.toFixed(2)} < ${r.need}  texto ${r.color} sobre ${hex(r.worstPx)}  ` +
          `${r.fontSize}px/${r.fontWeight}${r.decorative ? "  [decorativo aria-hidden]" : ""}  "${r.text}"\n` +
          `      ${r.selector}`
      );
    }
  }
})();
