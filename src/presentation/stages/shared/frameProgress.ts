export function frameProgressKey(stageId: string) {
  return `ai-tech-ed-frames-${stageId}`;
}

export function readFrameProgress(stageId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = window.localStorage.getItem(frameProgressKey(stageId));
    const n = parseInt(v ?? "", 10);
    return isNaN(n) || n < 0 ? 0 : n;
  } catch {
    return 0;
  }
}

export function saveFrameProgress(stageId: string, n: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(frameProgressKey(stageId), String(n));
  } catch { /* quota exceeded — silently ignore */ }
}
