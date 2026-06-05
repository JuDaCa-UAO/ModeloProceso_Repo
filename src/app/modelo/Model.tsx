"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ModelProps = {
  url: string;
  /** Lista de prefijos o nombres de nodos a animar (ej. ["Cube_E1.001"]) */
  animatedNodes?: string[];
  /** Color a usar para la animación (ej. "#ff0000"). Si no se envía, usa el original. */
  animatedColor?: string;
};

type MaterialLike = {
  clone: () => MaterialLike;
  toneMapped?: boolean;
  envMapIntensity?: number;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
  color?: THREE.Color;
};

type MeshLike = {
  isMesh?: boolean;
  name?: string;
  material?: MaterialLike | MaterialLike[];
  scale?: THREE.Vector3;
};

type TraversableScene = {
  clone: (recursive?: boolean) => TraversableScene;
  traverse: (callback: (node: unknown) => void) => void;
};

type AnimatedTarget = {
  mesh: MeshLike;
  baseScale: THREE.Vector3;
  materials: MaterialLike[];
};

export default function Model({ url, animatedNodes = [], animatedColor }: ModelProps) {
  const { scene } = useGLTF(url) as { scene: TraversableScene };
  const animatedTargets = useRef<AnimatedTarget[]>([]);
  const modelRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);

  const tunedScene = useMemo(() => {
    const cloned = scene.clone(true);
    animatedTargets.current = [];

    cloned.traverse((node: unknown) => {
      const mesh = node as MeshLike;
      if (!mesh.isMesh || !mesh.material) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      const localMaterials = materials.map((mat: MaterialLike) => mat.clone());

      mesh.material = Array.isArray(mesh.material)
        ? localMaterials
        : localMaterials[0];

      localMaterials.forEach((localMat) => {
        const tunableMat = localMat as MaterialLike;
        // Keep colors as authored in the model.
        tunableMat.toneMapped = false;
        if (typeof tunableMat.envMapIntensity === "number") {
          tunableMat.envMapIntensity = 0;
        }
      });

      // Detectar si este nodo debe ser animado
      if (mesh.name && animatedNodes.some(prefix => mesh.name!.includes(prefix))) {
        localMaterials.forEach((localMat) => {
          if (animatedColor) {
             const c = new THREE.Color(animatedColor);
             if (localMat.color) localMat.color.copy(c);
             if (localMat.emissive) localMat.emissive.copy(c);
          } else {
             // Asegurar que el material pueda brillar si no tiene color emisivo
             if (localMat.emissive && localMat.emissive.getHex() === 0) {
               if (localMat.color) {
                 localMat.emissive.copy(localMat.color);
               }
             }
          }
        });

        animatedTargets.current.push({
          mesh,
          baseScale: mesh.scale ? mesh.scale.clone() : new THREE.Vector3(1, 1, 1),
          materials: localMaterials,
        });
      }
    });

    return cloned;
  }, [scene, animatedNodes, animatedColor]);

  useFrame(({ clock }, delta) => {
    // 1. Animación de aparición (Entrada)
    if (modelRef.current) {
      if (scaleRef.current < 1) {
        scaleRef.current += delta * 1.5; // Velocidad de aparición
        if (scaleRef.current > 1) scaleRef.current = 1;
        
        // Easing suave (easeOutCubic)
        const easeScale = 1 - Math.pow(1 - scaleRef.current, 3);
        modelRef.current.scale.set(easeScale, easeScale, easeScale);
      }
    }

    // 2. Animación de los nodos (Titilar)
    if (animatedTargets.current.length > 0) {
      const t = clock.getElapsedTime();
      // Oscilación suave para simular latido/titilar (entre 0 y 1)
      const pulse = (Math.sin(t * 4) + 1) / 2; 

      // Escala (aumenta hasta un 25% más grande) y Brillo
      const scaleFactor = 1.0 + (pulse * 0.25);
      const intensity = 0.5 + (pulse * 2.0);

      animatedTargets.current.forEach((target) => {
        if (target.mesh.scale) {
          target.mesh.scale.copy(target.baseScale).multiplyScalar(scaleFactor);
        }
        target.materials.forEach((mat) => {
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = intensity;
          }
        });
      });
    }
  });

  return (
    <group ref={modelRef} scale={[0, 0, 0]}>
      <primitive object={tunedScene} />
    </group>
  );
}

useGLTF.preload("/models/espiral.glb");
