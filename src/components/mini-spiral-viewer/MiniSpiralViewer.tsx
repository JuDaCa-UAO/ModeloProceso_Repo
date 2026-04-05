"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import Model from "@/components/stage/Model";

function RotatingSpiralMini({ enableRotation }: { enableRotation: boolean }) {
  const spinRef = useRef<{ rotation: { y: number } } | null>(null);

  useFrame((_, delta) => {
    if (!enableRotation || !spinRef.current) return;
    spinRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={spinRef}>
      <Center>
        <Model url="/models/espiral.glb" />
      </Center>
    </group>
  );
}

type MiniSpiralViewerProps = {
  /** Si es false, el modelo queda estático (p. ej. prefers-reduced-motion). */
  enableRotation?: boolean;
};

export default function MiniSpiralViewer({
  enableRotation = true,
}: MiniSpiralViewerProps) {
  return (
    <Canvas flat camera={{ position: [0, 0, 35], fov: 42 }}>
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

      <RotatingSpiralMini enableRotation={enableRotation} />
    </Canvas>
  );
}
