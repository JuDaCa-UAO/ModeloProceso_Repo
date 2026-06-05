"use client";

import React, { useState, useRef } from "react";
import { useGLTF, Html, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { STAGE_META } from "@/content/stages";
import styles from "./InteractiveSpiral.module.css";

// Definimos el tipo para los nodos del GLTF según lo generado
type GLTFResult = {
  nodes: {
    Spiral002: THREE.Mesh;
    Cube_E1001: THREE.Mesh;
    Cube_E1002: THREE.Mesh;
    Cube_E3001: THREE.Mesh;
    Cube_E4001: THREE.Mesh;
    Cube_E5001: THREE.Mesh;
    Cube_E6001: THREE.Mesh;
  };
  materials: {
    Spiral: THREE.Material;
    Etapa_Inactiva: THREE.MeshStandardMaterial;
  };
};

function Orb({
  geometry,
  position,
  scale,
  stageIndex,
  defaultMaterial,
  isActive,
  hideLabels,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  scale: number;
  stageIndex: number;
  defaultMaterial: THREE.Material;
  isActive?: boolean;
  hideLabels?: boolean;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Obtenemos la etapa correspondiente (el index de stage-1 a stage-6 es de 1 a 6)
  // STAGE_META tiene index 0 = etapa 0, index 1 = etapa 1, etc.
  const stageData = STAGE_META[stageIndex];
  
  // Si no hay datos, no renderizamos el orbe
  if (!stageData) return null;

  useFrame(({ clock }) => {
    if (isActive && materialRef.current && meshRef.current) {
      // Pulso entre 0 y 1
      const pulse = (Math.sin(clock.getElapsedTime() * 3) + 1) / 2;
      // Transiciona de 0 (se ve igual a las inactivas) hasta 2.5 (brillo amarillo)
      materialRef.current.emissiveIntensity = pulse * 2.5;
      
      const s = scale * (1.0 + pulse * 0.1);
      meshRef.current.scale.set(s, s, s);
    } else if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (hideLabels) return;
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    if (hideLabels) return;
    setHovered(false);
    document.body.style.cursor = "default";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (hideLabels) return;
    // Si available es true, navegamos a la ruta
    if (stageData.available) {
      document.body.style.cursor = "default";
      router.push(stageData.href);
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={hovered && !isActive ? "#FFD86A" : "#666666"}
        emissive={isActive || hovered ? "#FFD86A" : "#000000"}
        emissiveIntensity={hovered && !isActive ? 0.8 : 0}
        roughness={0.4}
        metalness={0.8}
      />
      {!hideLabels && hovered && (
        <Html distanceFactor={30} position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className={styles.labelContainer}>
            <div className={styles.labelOrder}>
              {String(stageData.order).padStart(2, "0")}
            </div>
            <div className={styles.labelName}>{stageData.name}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function SpiralModel({ 
  activeStageIndex,
  hideLabels,
  ...props 
}: { 
  activeStageIndex?: number;
  hideLabels?: boolean;
  [key: string]: any;
}) {
  const { nodes, materials } = useGLTF("/models/espiral.glb") as unknown as GLTFResult;

  // Material default para la espiral
  const spiralMaterial = materials.Spiral;
  const inactivaMaterial = materials.Etapa_Inactiva;

  return (
    <Center>
      <group {...props} dispose={null}>
        {/* Estructura central de la espiral */}
        <mesh 
          geometry={nodes.Spiral002.geometry} 
          material={spiralMaterial} 
          position={[-0.437, 0.827, 44.286]} 
        />
        
        {/* Orbes mapeados a las etapas de la 1 a la 6 */}
        <Orb
          geometry={nodes.Cube_E1001.geometry}
          position={[8.455, 0.89, 43.561]}
          scale={1.3}
          stageIndex={1}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 1}
          hideLabels={hideLabels}
        />
        <Orb
          geometry={nodes.Cube_E1002.geometry}
          position={[-10.93, 4.349, 43.561]}
          scale={1.3}
          stageIndex={2}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 2}
          hideLabels={hideLabels}
        />
        <Orb
          geometry={nodes.Cube_E3001.geometry}
          position={[-0.503, 6.408, 55.74]}
          scale={1.3}
          stageIndex={3}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 3}
          hideLabels={hideLabels}
        />
        <Orb
          geometry={nodes.Cube_E4001.geometry}
          position={[3.275, 9.688, 31.997]}
          scale={1.3}
          stageIndex={4}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 4}
          hideLabels={hideLabels}
        />
        <Orb
          geometry={nodes.Cube_E5001.geometry}
          position={[-12.233, 12.511, 52.109]}
          scale={1.3}
          stageIndex={5}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 5}
          hideLabels={hideLabels}
        />
        <Orb
          geometry={nodes.Cube_E6001.geometry}
          position={[14.599, 15.712, 40.562]}
          scale={1.3}
          stageIndex={6}
          defaultMaterial={inactivaMaterial}
          isActive={activeStageIndex === 6}
          hideLabels={hideLabels}
        />
      </group>
    </Center>
  );
}

useGLTF.preload("/models/espiral.glb");
