"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, Bounds } from "@react-three/drei";
import SpiralModel from "./SpiralModel";
import styles from "./InteractiveSpiral.module.css";
import { STAGE_META } from "@/content/stages";

export default function InteractiveSpiral() {
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  const hoveredStageData = hoveredStageIndex !== null ? STAGE_META[hoveredStageIndex] : null;

  return (
    <div className={styles.canvasContainer}>
      {/* Etiqueta fija superior */}
      {hoveredStageData && (
        <div className={styles.fixedLabelContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.labelOrder}>
              {String(hoveredStageData.order).padStart(2, "0")}
            </div>
            <div className={styles.labelName}>{hoveredStageData.name}</div>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 5, 40], fov: 45 }}>
        {/* Luces base */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
        
        {/* Controles para poder rotar/hacer zoom */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={20}
          maxDistance={100}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Entorno HDRI sintético para que los materiales metálicos se vean bien sin hacer descargas externas */}
        <Environment resolution={256}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <Lightformer form="ring" intensity={1} color="white" position={[0, 0, -10]} scale={[20, 20, 1]} />
          </group>
          <Lightformer form="rect" intensity={0.5} color="white" position={[-10, 0, 10]} scale={[20, 20, 1]} />
          <Lightformer form="rect" intensity={0.5} color="white" position={[10, 0, 10]} scale={[20, 20, 1]} />
        </Environment>

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <SpiralModel onHoverStageChange={setHoveredStageIndex} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
