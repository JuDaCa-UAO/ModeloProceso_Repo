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
  const defaultId = ids[0] ?? "";
  const idsSet = useMemo(() => new Set(ids), [ids]);
  const lastActiveIdRef = useRef<string>(defaultId);
  const [revealedSet, setRevealedSet] = useState<Set<string>>(
    () => new Set(defaultId ? [defaultId] : [])
  );
  const [activeId, setActiveId] = useState<string>(defaultId);

  useEffect(() => {
    ratiosRef.current.clear();
    lastActiveIdRef.current = defaultId;
  }, [defaultId]);

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
          const next = new Set([...current].filter((id) => idsSet.has(id)));

          for (const entry of entries) {
            const node = entry.target as HTMLElement;
            const id = node.dataset.sectionId;
            if (!id || !idsSet.has(id)) continue;
            if (entry.isIntersecting && !next.has(id)) {
              next.add(id);
              changed = true;
            }
          }

          if (next.size === 0) {
            const fallbackId = lastActiveIdRef.current || defaultId;
            if (fallbackId) {
              next.add(fallbackId);
              changed = true;
            }
          }

          if (!changed && next.size === current.size) return current;
          return next;
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

        if (nextActiveId) {
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
  }, [defaultId, ids, idsSet, rootMargin, threshold]);

  const registerSectionRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      node.dataset.sectionId = id;
      refs.current.set(id, node);
      observerRef.current?.observe(node);
      return;
    }

    const el = refs.current.get(id);
    if (el) observerRef.current?.unobserve(el);
    refs.current.delete(id);
  }, []);

  const revealed = useMemo(() => {
    const filtered = new Set([...revealedSet].filter((id) => idsSet.has(id)));
    if (filtered.size === 0 && defaultId) filtered.add(defaultId);
    return filtered;
  }, [defaultId, idsSet, revealedSet]);

  const resolvedActiveId = idsSet.has(activeId) ? activeId : defaultId;

  return { activeId: resolvedActiveId, revealed, registerSectionRef };
}
