"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

export type SectionScrollContextValue = {
  continuedIds: Set<string>;
  continueSection: (id: string) => void;
  isBlocking: (id: string) => boolean;
  canContinue: (id: string) => boolean;
  scrollToSection: (id: string) => void;
};

const SectionScrollContext = createContext<SectionScrollContextValue | null>(
  null
);

export function useSectionScroll() {
  const ctx = useContext(SectionScrollContext);
  if (!ctx) {
    throw new Error("useSectionScroll must be used within SectionScrollProvider");
  }
  return ctx;
}

type SectionScrollProviderProps = {
  children: ReactNode;
  continuedIds: Set<string>;
  onContinue: (id: string) => void;
  blockingSectionId: string | null;
  getCanContinue: (id: string) => boolean;
  onScrollTo: (id: string) => void;
};

export function SectionScrollProvider({
  children,
  continuedIds,
  onContinue,
  blockingSectionId,
  getCanContinue,
  onScrollTo,
}: SectionScrollProviderProps) {
  const continueSection = useCallback(
    (id: string) => {
      onContinue(id);
    },
    [onContinue]
  );

  const isBlocking = useCallback(
    (id: string) => blockingSectionId === id,
    [blockingSectionId]
  );

  const canContinue = useCallback(
    (id: string) => getCanContinue(id),
    [getCanContinue]
  );

  const value = useMemo<SectionScrollContextValue>(
    () => ({
      continuedIds,
      continueSection,
      isBlocking,
      canContinue,
      scrollToSection: onScrollTo,
    }),
    [continuedIds, continueSection, isBlocking, canContinue, onScrollTo]
  );

  return (
    <SectionScrollContext.Provider value={value}>
      {children}
    </SectionScrollContext.Provider>
  );
}
