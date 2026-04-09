"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import Model from "@/app/modelo/Model";
import styles from "../stage/StageViewer.module.css";

function RotatingSpiralMini() {
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

type MiniSpiralViewerProps = {
  /** Etiqueta que se muestra debajo del canvas. Ej: "Etapa actual: Etapa 1" */
  stageLabel: string;
};

export default function MiniSpiralViewer({ stageLabel }: MiniSpiralViewerProps) {
  return (
    <div className={styles.widget} aria-label={stageLabel}>
      <div className={styles.canvas}>
        <Canvas flat camera={{ position: [0, 0, 60], fov: 42 }}>
          <ambientLight intensity={1.05} color="#ffffff" />
          <directionalLight position={[4, 5, 3]} intensity={0.55} color="#ffffff" />
          <directionalLight position={[-3, -2, -4]} intensity={0.22} color="#ffffff" />
          <RotatingSpiralMini />
        </Canvas>
      </div>
      <p className={styles.label}>{stageLabel}</p>
    </div>
  );
}
