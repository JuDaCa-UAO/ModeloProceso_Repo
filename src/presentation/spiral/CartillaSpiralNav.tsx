"use client";

/**
 * PRESENTATION — Client Component
 *
 * Navegación por la espiral 3D dentro de la Cartilla single-page. Reutiliza
 * `SpiralModel` (mismo motor/orbes/GLB `/models/espiral.glb`) pero, en vez de
 * navegar por ruta (`router.push`), al hacer clic en una etapa muta
 * `location.hash` a `#etapa-N`; el hook `useHashNavigation` (montado en
 * `CartillaScroll`) hace el scroll suave al capítulo correspondiente.
 *
 * A propósito, esta espiral NO admite arrastre/zoom/pan de cámara (a
 * diferencia de `InteractiveSpiral`, usada en la app de respaldo `/etapas`):
 * solo gira sobre su propio eje (auto-spin vía `useFrame`, mismo patrón que
 * `RotatingSpiral` en `StageViewer.tsx`) y expone los orbes como botones
 * clicables que navegan a cada etapa. Al no haber cámara arrastrable, no
 * existe conflicto posible entre "girar" y "hacer clic". El giro se pausa
 * mientras el puntero está sobre un orbe, para poder leer la etiqueta y
 * apuntar el clic sin que el objetivo siga moviéndose.
 */
import React, { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Bounds } from "@react-three/drei";
import type * as THREE from "three";
import SpiralModel from "@/components/InteractiveSpiral/SpiralModel";
import { STAGE_META } from "@/content/stages";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import styles from "./CartillaSpiralNav.module.css";

/** Gira el grupo sobre su eje Y a velocidad constante; inmóvil con `enabled=false`. */
function AutoSpin({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!enabled || !groupRef.current || (typeof document !== "undefined" && document.hidden)) return;
    groupRef.current.rotation.y += delta * 0.5;
  });
  return <group ref={groupRef}>{children}</group>;
}

export default function CartillaSpiralNav() {
  const reduced = usePrefersReducedMotion();
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);

  const hoveredStageData = hoveredStageIndex !== null ? STAGE_META[hoveredStageIndex] : null;

  const handleSelectStage = useCallback((stageIndex: number) => {
    const stage = STAGE_META[stageIndex];
    if (!stage) return;
    // Mutar el hash dispara `hashchange` → useHashNavigation hace el scroll.
    // Si ya estamos en ese hash, forzamos el desplazamiento manualmente
    // (asignar el mismo valor no re-dispara `hashchange`).
    if (window.location.hash === `#${stage.id}`) {
      document.getElementById(stage.id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    } else {
      window.location.hash = `#${stage.id}`;
    }
  }, [reduced]);

  // Memoizado con deps estables (`[]`): el HDRI sintético es 100% estático.
  // `Environment` con `children` propios recaptura el cubemap (operación de
  // GPU costosa y síncrona) cada vez que su prop `children` cambia de
  // referencia — y JSX crea una referencia nueva en cada render. Sin este
  // memo, cualquier estado que re-renderice este componente (hover, cambio de
  // hash) dispara esa recaptura y se percibe como que el modelo "se detiene".
  const environment = useMemo(
    () => (
      <Environment resolution={256}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Lightformer form="ring" intensity={1} color="white" position={[0, 0, -10]} scale={[20, 20, 1]} />
        </group>
        <Lightformer form="rect" intensity={0.5} color="white" position={[-10, 0, 10]} scale={[20, 20, 1]} />
        <Lightformer form="rect" intensity={0.5} color="white" position={[10, 0, 10]} scale={[20, 20, 1]} />
      </Environment>
    ),
    []
  );

  return (
    <div className={styles.canvasContainer}>
      {hoveredStageData && (
        <div className={styles.fixedLabelContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.labelOrder}>{String(hoveredStageData.order).padStart(2, "0")}</div>
            <div className={styles.labelName}>{hoveredStageData.name}</div>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 5, 40], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Entorno HDRI sintético para materiales metálicos, sin descargas externas. */}
        {environment}

        <Suspense fallback={null}>
          {/* Sin `observe`: el encuadre se calcula una sola vez al montar (la
              caja del modelo no cambia después, ya que no hay pulso "activo"
              ni cámara arrastrable que deba reencuadrarse). */}
          <Bounds fit clip margin={1.1}>
            <AutoSpin enabled={!reduced && hoveredStageIndex === null}>
              <SpiralModel onHoverStageChange={setHoveredStageIndex} onSelectStage={handleSelectStage} />
            </AutoSpin>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
