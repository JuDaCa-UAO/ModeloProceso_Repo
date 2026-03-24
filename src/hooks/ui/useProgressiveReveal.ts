/**
 * PRESENTATION — UI Hook
 *
 * useProgressiveReveal: gestiona la revelación progresiva de secciones
 * usando IntersectionObserver. Controla cuál sección está "activa" (en foco)
 * y cuáles han sido "reveladas" (ya entraron al viewport).
 *
 * Puramente visual — no toca estado de progreso de negocio.
 * Movido a hooks/ui/ para separarlo de hooks/domain/.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseProgressiveRevealOptions = {
  ids: string[];
  threshold?: number;
  rootMargin?: string;
};

export function useProgressiveReveal({
  ids,
  threshold = 0.25,
  rootMargin = "0px 0px -12% 0px",
}: UseProgressiveRevealOptions) {
  const refs = useRef(new Map<string, HTMLElement>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ratiosRef = useRef(new Map<string, number>());
  const lastActiveIdRef = useRef<string>(ids[0] ?? "");
  const [revealedSet, setRevealedSet] = useState<Set<string>>(
    () => new Set(ids.slice(0, 1))
  );
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    setRevealedSet(new Set(ids.slice(0, 1)));
    setActiveId(ids[0] ?? "");
    ratiosRef.current.clear();
    lastActiveIdRef.current = ids[0] ?? "";
  }, [ids]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          const id = node.dataset.sectionId;
          if (!id) continue;
          ratiosRef.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        setRevealedSet((current) => {
          let changed = false;
          const next = new Set(current);
          for (const entry of entries) {
            const node = entry.target as HTMLElement;
            const id = node.dataset.sectionId;
            if (!id) continue;
            if (entry.isIntersecting && !next.has(id)) {
              next.add(id);
              changed = true;
            }
          }
          if (next.size === 0) {
            const fallbackId = lastActiveIdRef.current || ids[0];
            if (fallbackId) { next.add(fallbackId); changed = true; }
          }
          return changed ? next : current;
        });

        let nextActiveId = "";
        let nextActiveRatio = 0;
        for (const id of ids) {
          const ratio = ratiosRef.current.get(id) ?? 0;
          if (ratio > nextActiveRatio) {
            nextActiveRatio = ratio;
            nextActiveId = id;
          }
        }
        const currentActiveId = lastActiveIdRef.current;
        const currentRatio = ratiosRef.current.get(currentActiveId) ?? 0;
        // Hysteresis: evita parpadeo del texto cuando dos secciones tienen ratios similares.
        // Solo cambia si el nuevo gana claramente o la actual casi no se ve.
        const HYSTERESIS = 0.08;
        const shouldSwitch =
          nextActiveId &&
          (nextActiveRatio > currentRatio + HYSTERESIS || currentRatio < 0.06);
        if (shouldSwitch) {
          lastActiveIdRef.current = nextActiveId;
          setActiveId(nextActiveId);
        }
      },
      { threshold: [0, threshold, 0.5, 1], rootMargin }
    );

    observerRef.current = observer;

    for (const [, el] of refs.current) {
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [ids, threshold, rootMargin]);

  const registerSectionRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      node.dataset.sectionId = id;
      refs.current.set(id, node);
      observerRef.current?.observe(node); // Observa el nuevo nodo inmediatamente
    } else {
      const el = refs.current.get(id);
      if (el) observerRef.current?.unobserve(el);
      refs.current.delete(id);
    }
  }, []);

  const revealed = useMemo(() => revealedSet, [revealedSet]);

  return { activeId, revealed, registerSectionRef };
}
