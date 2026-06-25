"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SpiralModel from "@/components/InteractiveSpiral/SpiralModel";
import { useAccessibility } from "@/context/AccessibilityContext";

/**
 * Encuadre determinista: ajusta la cámara para que el modelo llene su contenedor
 * y quede centrado, sin importar el tamaño/aspecto del canvas ni la escala de
 * interfaz. Se recalcula ante cambios de tamaño del canvas (resize de ventana o
 * `zoom` del `--ui-scale`) y ante cambios de `uiScale`.
 *
 * Mide la caja del modelo una sola vez (rotación ≈ 0). Como la espiral gira sobre
 * su eje Y y sus extensiones X/Z son similares, la silueta es estable durante la
 * rotación, por lo que basta una medición y recalcular solo la distancia.
 */
function FitCamera({
  targetRef,
  uiScale,
  margin = 1.12,
}: {
  targetRef: React.RefObject<THREE.Group | null>;
  uiScale: number;
  margin?: number;
}) {
  const size = useThree((s) => s.size);
  const boxSize = useRef<THREE.Vector3 | null>(null);
  const needsFit = useRef(true);

  // Marca refit cuando cambian las dimensiones del canvas o la escala de interfaz.
  useEffect(() => {
    needsFit.current = true;
  }, [size.width, size.height, uiScale]);

  useFrame((state) => {
    const target = targetRef.current;
    if (!target) return;

    // Medición única de la caja del modelo (cuando ya está cargado).
    if (!boxSize.current) {
      const box = new THREE.Box3().setFromObject(target);
      if (box.isEmpty()) return;
      boxSize.current = box.getSize(new THREE.Vector3());
      needsFit.current = true;
    }

    if (!needsFit.current) return;

    const cam = state.camera as THREE.PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;

    const { x: w, y: h, z: d } = boxSize.current;
    const fov = (cam.fov * Math.PI) / 180;
    const aspect = state.size.width / state.size.height;
    // Extensión horizontal: la mayor entre ancho y profundidad (la rotación en Y
    // intercambia X/Z), para que no se recorte en ninguna orientación.
    const horiz = Math.max(w, d);
    const distH = horiz / 2 / (Math.tan(fov / 2) * aspect);
    const distV = h / 2 / Math.tan(fov / 2);
    const dist = Math.max(distH, distV) * margin + d / 2;

    cam.position.set(0, 0, dist);
    cam.near = Math.max(0.1, dist - d);
    cam.far = dist + d * 2;
    cam.updateProjectionMatrix();

    const controls = state.controls as unknown as
      | { target: THREE.Vector3; update: () => void }
      | null;
    if (controls?.target) {
      controls.target.set(0, 0, 0);
      controls.update();
    }

    needsFit.current = false;
  });

  return null;
}

function RotatingSpiral({
  enableRotation,
  activeStageIndex,
  groupRef,
}: {
  enableRotation: boolean;
  activeStageIndex?: number;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  useFrame((_, delta) => {
    // No gastar ciclos cuando la pestaña está oculta.
    if (!enableRotation || !groupRef.current || (typeof document !== "undefined" && document.hidden)) return;
    groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef}>
      <SpiralModel activeStageIndex={activeStageIndex} hideLabels={true} />
    </group>
  );
}

type StageViewerProps = {
  /** Si es false, el modelo queda estático (p. ej. prefers-reduced-motion). */
  enableRotation?: boolean;
  /** Índice numérico de la etapa activa para titilar (ej. 1) */
  activeStage?: number;
  /** Si es true, el modelo se renderiza en bajo consumo (DPR bajo, WebGL de baja potencia, sin antialias). */
  lowPower?: boolean;
};

export default function StageViewer({
  enableRotation = true,
  activeStage,
  lowPower = false,
}: StageViewerProps) {
  // Se lee fuera del <Canvas>: el contexto de React no cruza el reconciler de r3f.
  const { uiScale } = useAccessibility();
  const groupRef = useRef<THREE.Group | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 
        Forzar que el elemento <canvas> y su contenedor interno de R3F llenen el 100%
        del espacio del div absolute. Sin esto, en navegadores con zoom CSS (--ui-scale),
        R3F mide el tamaño lógico pero el canvas se dibuja encogido por el zoom de Chrome,
        lo que desalinea y desvia el modelo 3D hacia la izquierda y deja un vacío a la derecha.
      */}
      <style>{`
        .r3f-canvas-container canvas {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      <div className="r3f-canvas-container" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <Canvas
          flat
          camera={{ position: [0, 0, 45], fov: 42 }}
          // Limita la resolución del render para reducir presión de memoria GPU (1x para bajo consumo, hasta 1.5x en modo normal).
          dpr={lowPower ? 1 : [1, 1.5]}
          gl={{
            powerPreference: lowPower ? "low-power" : "high-performance",
            antialias: !lowPower,
            stencil: false,
            depth: true,
            failIfMajorPerformanceCaveat: false,
          }}
          // Recuperación de contexto: preventDefault permite que el navegador restaure
          // el contexto WebGL en vez de matarlo (p. ej. tras un Fast Refresh en dev).
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false
            );
          }}
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
            minDistance={5}
            maxDistance={500}
          />

          <FitCamera targetRef={groupRef} uiScale={uiScale} />
          <RotatingSpiral
            enableRotation={enableRotation}
            activeStageIndex={activeStage}
            groupRef={groupRef}
          />
        </Canvas>
      </div>
    </div>
  );
}
