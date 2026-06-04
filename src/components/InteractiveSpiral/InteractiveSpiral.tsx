"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import SpiralModel from "./SpiralModel";
import styles from "./InteractiveSpiral.module.css";

export default function InteractiveSpiral() {
  return (
    <div className={styles.canvasContainer}>
      <Canvas camera={{ position: [0, 5, 60], fov: 45 }}>
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
          <SpiralModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
