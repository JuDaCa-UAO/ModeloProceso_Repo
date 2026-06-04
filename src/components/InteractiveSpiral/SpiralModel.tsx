"use client";

import React, { useState, useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { STAGE_META, StageMeta } from "@/content/stages";
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
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  scale: number;
  stageIndex: number;
  defaultMaterial: THREE.Material;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  
  // Obtenemos la etapa correspondiente (el index de stage-1 a stage-6 es de 1 a 6)
  // STAGE_META tiene index 0 = etapa 0, index 1 = etapa 1, etc.
  const stageData = STAGE_META[stageIndex];
  
  // Si no hay datos, no renderizamos el orbe
  if (!stageData) return null;

  // Creamos un material único para este orbe para que el emissive solo afecte a este
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "default";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Si available es true, navegamos a la ruta
    if (stageData.available) {
      document.body.style.cursor = "default";
      router.push(stageData.href);
    }
  };

  return (
    <mesh
      geometry={geometry}
      position={position}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={hovered ? "#ff6666" : "#666666"}
        emissive={hovered ? "#ff0000" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.4}
        metalness={0.8}
      />
      {hovered && (
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

export default function SpiralModel(props: any) {
  const { nodes, materials } = useGLTF("/models/espiral.glb") as unknown as GLTFResult;

  // Material default para la espiral
  const spiralMaterial = materials.Spiral;
  const inactivaMaterial = materials.Etapa_Inactiva;

  return (
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
      />
      <Orb
        geometry={nodes.Cube_E1002.geometry}
        position={[-10.93, 4.349, 43.561]}
        scale={1.3}
        stageIndex={2}
        defaultMaterial={inactivaMaterial}
      />
      <Orb
        geometry={nodes.Cube_E3001.geometry}
        position={[-0.503, 6.408, 55.74]}
        scale={1.3}
        stageIndex={3}
        defaultMaterial={inactivaMaterial}
      />
      <Orb
        geometry={nodes.Cube_E4001.geometry}
        position={[3.275, 9.688, 31.997]}
        scale={1.3}
        stageIndex={4}
        defaultMaterial={inactivaMaterial}
      />
      <Orb
        geometry={nodes.Cube_E5001.geometry}
        position={[-12.233, 12.511, 52.109]}
        scale={1.3}
        stageIndex={5}
        defaultMaterial={inactivaMaterial}
      />
      <Orb
        geometry={nodes.Cube_E6001.geometry}
        position={[14.599, 15.712, 40.562]}
        scale={1.3}
        stageIndex={6}
        defaultMaterial={inactivaMaterial}
      />
    </group>
  );
}

useGLTF.preload("/models/espiral.glb");
