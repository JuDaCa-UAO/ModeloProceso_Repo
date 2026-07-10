import UaoArcBackground from "@/components/uao-arc-background/UaoArcBackground";
import CartillaScroll from "./CartillaScroll";

/**
 * Composición raíz de la nueva Cartilla (documento único de scroll continuo).
 * Server Component: solo compone el fondo decorativo y la isla cliente de
 * scroll; el contenido real llega como `children` ya renderizado en servidor.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UaoArcBackground />
      <CartillaScroll>{children}</CartillaScroll>
    </>
  );
}
