/**
 * PRESENTATION — StageViewer
 *
 * Widget fijo en esquina superior derecha que muestra el modelo espiral
 * en miniatura con la etiqueta de la etapa actual.
 *
 * Aparece a partir del Frame 3 (Sección 3) y permanece visible
 * durante el resto del recorrido de la Etapa 1.
 *
 * TODO: animación de "brillo / pulso intermitente" en el anillo correspondiente
 * a la etapa activa. El modelo espiral (espiral.glb) tiene secciones separadas
 * que mapean a cada etapa. En una iteración futura se deberá:
 *   1. Aislar la geometría del anillo de la etapa actual (por nombre de mesh o índice).
 *   2. Aplicar un material emissive animado (pulsación) solo a ese mesh.
 *   3. Pasar `currentStageIndex: number` como prop para controlar qué anillo activa.
 * Referencia: Three.js traversal + MeshStandardMaterial emissiveIntensity animado en useFrame.
 *
 * TODO: hacer OrbitControls opcionales (actualmente sin controles — widget decorativo).
 */

"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import Model from "@/app/modelo/Model";
import styles from "./StageViewer.module.css";

function RotatingSpiral() {
  const groupRef = useRef<{ rotation: { y: number } } | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Model url="/models/espiral.glb" />
      </Center>
    </group>
  );
}

type StageViewerProps = {
  /** Etiqueta que se muestra debajo del canvas. Ej: "Etapa actual: Etapa 1" */
  stageLabel: string;
};

export default function StageViewer({ stageLabel }: StageViewerProps) {
  return (
    <div className={styles.widget} aria-label={stageLabel}>
      <div className={styles.canvas}>
        <Canvas flat camera={{ position: [0, 0, 60], fov: 42 }}>
          <ambientLight intensity={1.05} color="#ffffff" />
          <directionalLight position={[4, 5, 3]} intensity={0.55} color="#ffffff" />
          <directionalLight position={[-3, -2, -4]} intensity={0.22} color="#ffffff" />
          <RotatingSpiral />
        </Canvas>
      </div>
      <p className={styles.label}>{stageLabel}</p>
    </div>
  );
}
