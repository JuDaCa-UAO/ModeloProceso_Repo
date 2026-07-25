/**
 * Optimización de imágenes fuente (uso puntual, no corre en build).
 *
 * Las infografías/sliders del diseño llegan a 100+ megapíxeles y varios MB.
 * `next/image` ya sirve variantes del tamaño de pantalla en runtime, pero el
 * archivo FUENTE gigante encarece la primera optimización en Vercel y pesa en
 * el repo. Este script reduce cada fuente a un borde máximo razonable (por
 * encima del mayor variante que next/image sirve, ~1920 px, así que sin pérdida
 * visible) y la reescribe como webp de alta calidad.
 *
 * El original se respalda una sola vez en `.cache/media-sources/` (gitignored)
 * antes de sobrescribir. La caché queda fuera de `public/` para que nunca se
 * publique junto con los assets de producción.
 *
 * Uso:  node scripts/optimize-images.mjs
 * Requiere: devDependency `sharp`.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BACKUP = path.join(ROOT, ".cache/media-sources");

// Infografías con texto fino: 2560. Sliders cuadrados (mostrados ~560px): 1600.
const TARGETS = [
  { f: "public/media/etapa-2/imagenes/criterios-posibilidades.webp", cap: 2560 },
  { f: "public/media/etapa-2/imagenes/comparacion-herramientas.webp", cap: 2560 },
  { f: "public/media/etapa-4/imagenes/sala-control.webp", cap: 2560 },
  { f: "public/media/etapa-4/imagenes/lista-alistamiento.webp", cap: 2560 },
  { f: "public/media/etapa-5/imagenes/docente-mediador.webp", cap: 2560 },
  { f: "public/media/etapa-6/imagenes/dimensiones-evaluacion.webp", cap: 2560 },
  { f: "public/media/etapa-6/imagenes/dos-miradas.webp", cap: 2560 },
  { f: "public/media/etapa-5/imagenes/evidencia-1.webp", cap: 1600 },
  { f: "public/media/etapa-5/imagenes/evidencia-2.webp", cap: 1600 },
  { f: "public/media/etapa-5/imagenes/evidencia-3.webp", cap: 1600 },
  { f: "public/media/etapa-5/imagenes/evidencia-4.webp", cap: 1600 },
  { f: "public/media/etapa-5/imagenes/evidencia-5.webp", cap: 1600 },
];

fs.mkdirSync(BACKUP, { recursive: true });

for (const { f, cap } of TARGETS) {
  const src = path.join(ROOT, f);
  if (!fs.existsSync(src)) {
    console.log(`${f}  MISSING - skipped`);
    continue;
  }
  const bak = path.join(BACKUP, f.replace(/[/\\]/g, "__"));
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak); // respaldo pristino una vez

  const before = fs.statSync(src).size;
  const buf = await sharp(bak) // siempre desde el original respaldado
    .resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, effort: 5 })
    .toBuffer();
  fs.writeFileSync(src, buf);
  const dims = await sharp(src).metadata();
  console.log(
    `${path.basename(f).padEnd(26)} ${(before / 1048576).toFixed(2)}MB -> ${dims.width}x${dims.height} ${(buf.length / 1024).toFixed(0)}KB`
  );
}
