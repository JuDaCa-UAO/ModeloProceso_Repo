export type ProgressState = {
  hasStarted: boolean;
  lastRoute: string;      // a dónde “Continuar”
  updatedAt: number;      // timestamp
};

const STORAGE_KEY = "ai-tech-ed-progress";

const DEFAULT_STATE: ProgressState = {
  hasStarted: false,
  lastRoute: "/etapa/etapa-0",
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
  window.localStorage.removeItem(STORAGE_KEY);
}
