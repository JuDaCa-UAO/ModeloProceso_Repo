"use client";

import React, { useState, useRef, useMemo } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { STAGE_META } from "@/content/stages";

// Umbral (px) para distinguir un clic de un arrastre de rotación: si el puntero
// se movió más que esto entre pointerdown y click sobre un orbe, se considera
// que el usuario estaba girando el modelo y NO se dispara la navegación.
const DRAG_THRESHOLD_PX = 6;

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
  isActive,
  hideLabels,
  onHover,
  onSelectStage,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  scale: number;
  stageIndex: number;
  isActive?: boolean;
  hideLabels?: boolean;
  onHover?: (isHovered: boolean) => void;
  /**
   * Selección in-page: si se provee, el clic la invoca en lugar de navegar por
   * ruta (`router.push`). Permite usar la misma espiral dentro de la Cartilla
   * single-page (scroll a `#etapa-N`) sin romper la app de respaldo `/etapas`.
   */
  onSelectStage?: (stageIndex: number) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  // Posición del puntero en el último pointerdown sobre el orbe (para la guarda
  // drag-vs-click). null = no hay un gesto de presión en curso sobre este orbe.
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  
  // Obtenemos la etapa correspondiente (el index de stage-1 a stage-6 es de 1 a 6)
  // STAGE_META tiene index 0 = introducción, index 1 = etapa 1, etc.
  const stageData = STAGE_META[stageIndex];

  useFrame(({ clock }) => {
    if (!stageData) return;
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
  
  // Si no hay datos, no renderizamos el orbe
  if (!stageData) return null;

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hideLabels) return;
    setHovered(true);
    if (onHover) onHover(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hideLabels) return;
    setHovered(false);
    if (onHover) onHover(false);
    document.body.style.cursor = "default";
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (hideLabels) return;
    pointerDownRef.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (hideLabels) return;

    // Guarda drag-vs-click: si el puntero se desplazó más que el umbral desde el
    // pointerdown, el gesto fue una rotación del modelo, no una selección.
    const down = pointerDownRef.current;
    pointerDownRef.current = null;
    if (down) {
      const dx = e.nativeEvent.clientX - down.x;
      const dy = e.nativeEvent.clientY - down.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return;
    }

    if (!stageData.available) return;
    document.body.style.cursor = "default";

    // Same-page (Cartilla) si hay callback; si no, navegación por ruta (respaldo).
    if (onSelectStage) {
      onSelectStage(stageIndex);
    } else {
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
      onPointerDown={handlePointerDown}
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
    </mesh>
  );
}

export default function SpiralModel({
  activeStageIndex,
  hideLabels,
  onHoverStageChange,
  onSelectStage,
  ...props
}: {
  activeStageIndex?: number;
  hideLabels?: boolean;
  onHoverStageChange?: (stageIndex: number | null) => void;
  /** Selección in-page de una etapa (índice 1–6). Ver `Orb.onSelectStage`. */
  onSelectStage?: (stageIndex: number) => void;
} & React.ComponentPropsWithoutRef<"group">) {
  const { nodes, materials } = useGLTF("/models/espiral.glb") as unknown as GLTFResult;

  // Material de la espiral con un rojo institucional más intenso (mejor contraste
  // sobre el fondo crema). Se clona para no mutar la caché del GLTF.
  const spiralMaterial = useMemo(() => {
    const base = materials.Spiral.clone() as THREE.MeshStandardMaterial;
    if (base.color) base.color.set("#e3001b");
    if ("emissive" in base && base.emissive) {
      base.emissive.set("#3d0008");
      base.emissiveIntensity = 0.35;
    }
    return base;
  }, [materials.Spiral]);
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
          isActive={activeStageIndex === 1}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 1 : null)}
          onSelectStage={onSelectStage}
        />
        <Orb
          geometry={nodes.Cube_E1002.geometry}
          position={[-10.93, 4.349, 43.561]}
          scale={1.3}
          stageIndex={2}
          isActive={activeStageIndex === 2}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 2 : null)}
          onSelectStage={onSelectStage}
        />
        <Orb
          geometry={nodes.Cube_E3001.geometry}
          position={[-0.503, 6.408, 55.74]}
          scale={1.3}
          stageIndex={3}
          isActive={activeStageIndex === 3}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 3 : null)}
          onSelectStage={onSelectStage}
        />
        <Orb
          geometry={nodes.Cube_E4001.geometry}
          position={[3.275, 9.688, 31.997]}
          scale={1.3}
          stageIndex={4}
          isActive={activeStageIndex === 4}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 4 : null)}
          onSelectStage={onSelectStage}
        />
        <Orb
          geometry={nodes.Cube_E5001.geometry}
          position={[-12.233, 12.511, 52.109]}
          scale={1.3}
          stageIndex={5}
          isActive={activeStageIndex === 5}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 5 : null)}
          onSelectStage={onSelectStage}
        />
        <Orb
          geometry={nodes.Cube_E6001.geometry}
          position={[14.599, 15.712, 40.562]}
          scale={1.3}
          stageIndex={6}
          isActive={activeStageIndex === 6}
          hideLabels={hideLabels}
          onHover={(hovered) => onHoverStageChange?.(hovered ? 6 : null)}
          onSelectStage={onSelectStage}
        />
      </group>
    </Center>
  );
}

useGLTF.preload("/models/espiral.glb");
