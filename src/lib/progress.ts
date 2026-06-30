export type ProgressState = {
  hasStarted: boolean;
  lastRoute: string;      // a dónde “Continuar”
  updatedAt: number;      // timestamp
};

const STORAGE_KEY = "ai-tech-ed-progress";

const DEFAULT_STATE: ProgressState = {
  hasStarted: false,
  lastRoute: "/etapas/introduccion",
  updatedAt: 0,
};

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      hasStarted: Boolean(parsed.hasStarted ?? DEFAULT_STATE.hasStarted),
      lastRoute: String(parsed.lastRoute ?? DEFAULT_STATE.lastRoute),
      updatedAt: Number(parsed.updatedAt ?? DEFAULT_STATE.updatedAt),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeProgress(patch: Partial<ProgressState>) {
  if (typeof window === "undefined") return;

  const current = readProgress();
  const next: ProgressState = {
    ...current,
    ...patch,
    updatedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  
  // Limpiar no solo el progreso global, sino todos los datos persistidos de las etapas
  // (frames, guide hand, data-driven engine progress)
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith("ai-tech-ed-")) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));
}
