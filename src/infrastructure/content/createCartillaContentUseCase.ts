/**
 * INFRASTRUCTURE — Composition root
 *
 * Única función que construye un `GetCartillaContentUseCase` real. La
 * presentación llama a esta función; nunca construye el repositorio
 * directamente.
 */
import { GetCartillaContentUseCase } from "@application/content/usecases/GetCartillaContentUseCase";
import { StaticCartillaContentRepository } from "./StaticCartillaContentRepository";

let instance: GetCartillaContentUseCase | null = null;

export function getCartillaContentUseCase(): GetCartillaContentUseCase {
  if (instance) return instance;
  instance = new GetCartillaContentUseCase(new StaticCartillaContentRepository());
  return instance;
}
