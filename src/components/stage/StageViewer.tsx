"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import SpiralModel from "@/components/InteractiveSpiral/SpiralModel";

function RotatingSpiral({ enableRotation, activeStageIndex }: { enableRotation: boolean; activeStageIndex?: number }) {
  const spinRef = useRef<{ rotation: { y: number } } | null>(null);

  useFrame((_, delta) => {
    if (!enableRotation || !spinRef.current) return;
    spinRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={spinRef}>
      <SpiralModel activeStageIndex={activeStageIndex} hideLabels={true} position={[-2, 1.5, 0]} />
    </group>
  );
}

type StageViewerProps = {
  /** Si es false, el modelo queda estático (p. ej. prefers-reduced-motion). */
  enableRotation?: boolean;
  /** Índice numérico de la etapa activa para titilar (ej. 1) */
  activeStage?: number;
};

export default function StageViewer({
  enableRotation = true,
  activeStage,
}: StageViewerProps) {
  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 45], fov: 42 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.05} color="#ffffff" />
      <directionalLight position={[4, 5, 3]} intensity={0.55} color="#ffffff" />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.25}
        color="#ffffff"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        target={[0, 0, 0]}
        minDistance={20}
        maxDistance={50}
      />

      <RotatingSpiral enableRotation={enableRotation} activeStageIndex={activeStage} />
    </Canvas>
  );
}
