/**
 * DOMAIN — Entity
 *
 * Sección de contenido dentro de la Introducción o de una etapa: un título
 * opcional y una lista de bloques (`Block`, unión discriminada).
 */
import type { Block } from "./Block";

export interface Section {
  id: string;
  title?: string;
  blocks: Block[];
}
