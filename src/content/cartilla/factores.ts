/**
 * CONTENT — Datos
 *
 * Los cinco factores rectores (F1–F5). Texto verbatim del diseño importado
 * (`Cartilla.dc.html`, sección "Factores rectores"), que coincide en
 * sustancia con `FACTORS` de `content/stages/stage-1.content.ts` (misma
 * fuente EMI, transcripción ligeramente distinta); se usa la redacción del
 * diseño aprobado por ser la más precisa y la que rige la UI nueva.
 */
import type { Factor } from "@domain/content/Factor";

export const FACTORES_RECTORES: Factor[] = [
  { id: "F1", name: "Propósito", question: "¿Qué actividad transformar con sentido pedagógico?" },
  { id: "F2", name: "Razonamiento crítico", question: "¿Qué proceso cognitivo debe hacer el estudiante?" },
  { id: "F3", name: "Ética", question: "¿Qué consideraciones éticas y de responsabilidad hay?" },
  { id: "F4", name: "Herramientas", question: "¿Qué herramientas se incorporan?" },
  { id: "F5", name: "Reflexión", question: "¿Qué se aprende y mejora del proceso?" },
];
