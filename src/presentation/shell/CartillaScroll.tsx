"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import useHashNavigation from "./useHashNavigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REVEAL_SELECTOR = "[data-reveal]";

/**
 * Isla cliente de scroll de la Cartilla: recibe las secciones como `children`
 * ya renderizados en servidor (RSC) y solo orquesta el revelado progresivo
 * al hacer scroll. No contiene contenido propio ni lógica de dominio.
 *
 * `prefers-reduced-motion: reduce` deja todo visible sin animación (estado
 * final directo, sin ScrollTrigger) en vez de solo desactivar la duración.
 */
export default function CartillaScroll({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useHashNavigation();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR, rootRef.current);
        gsap.set(targets, { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR, rootRef.current);
        gsap.set(targets, { opacity: 0, y: 40 });

        ScrollTrigger.batch(targets, {
          start: "top 80%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.6,
              ease: "power2.out",
              overwrite: true,
            }),
        });

        return () => {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready?.then(refresh);
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
