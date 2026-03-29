# AI TECH-ED — Modelo de Proceso GenAI Educativo

Plataforma interactiva basada en **Next.js 16 App Router** que guía a docentes universitarios a través de un modelo de proceso de 6 etapas para la integración reflexiva, crítica y pedagógica de Inteligencia Artificial Generativa en sus prácticas educativas.

---

## Índice

1. [Qué hace esta app](#qué-hace-esta-app)
2. [Arquitectura](#arquitectura)
3. [Estructura de carpetas](#estructura-de-carpetas)
4. [Flujo de comunicación entre capas](#flujo-de-comunicación-entre-capas)
5. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
6. [Variables de entorno](#variables-de-entorno)
7. [Cómo agregar una nueva etapa](#cómo-agregar-una-nueva-etapa)
8. [Cómo agregar un nuevo bloque de contenido](#cómo-agregar-un-nuevo-bloque-de-contenido)
9. [Integración con N8N](#integración-con-n8n)
10. [Chatbot Laia](#chatbot-laia)
11. [Testing](#testing)
12. [Seguridad](#seguridad)
13. [Decisiones de arquitectura](#decisiones-de-arquitectura)

---

## Qué hace esta app

El docente entra a la app y recorre 6 etapas del modelo espiral GenAI:

| Etapa | Nombre | Estado |
|---|---|---|
| 1 | Reconócete para avanzar | ✅ Implementada |
| 2 | Descubre nuevas posibilidades | 🔧 Próxima |
| 3 | Diseña con propósito | 🔧 Próxima |
| 4 | Prepara el terreno para el éxito | 🔧 Próxima |
| 5 | Hazlo realidad en el aula | 🔧 Próxima |
| 6 | Reflexiona, aprende y mejora | 🔧 Próxima |

Cada etapa tiene:
- Animaciones de introducción y transición
- Diálogos con la asistente Laia
- Formularios de consentimiento, autodiagnóstico e intención
- Contenido progresivo desbloqueado por hitos completados

---

## Arquitectura

El proyecto sigue **Clean Architecture** adaptada a Next.js App Router. La regla fundamental es:

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

**Domain no conoce a nadie. Presentation no importa de Infrastructure directamente.**

### Las 4 capas

#### 1. Domain (`src/domain/`)
Reglas de negocio puras. No importa React, Next.js, localStorage ni fetch.

- **Entities**: `StageProgress.ts` — modelo de datos de progreso del docente
- **Value Objects**: `StageFlagKey.ts`, `HierarchyLevel.ts` — tipos con significado de negocio
- **Repositories (interfaces)**: `IStageProgressRepository.ts`, `IStageContentRepository.ts` — contratos, no implementaciones

#### 2. Application (`src/application/`)
Casos de uso. Orquesta el dominio y llama a puertos de infraestructura.

- `GetStageContentUseCase.ts` — obtiene el árbol de nodos de una etapa
- **Ports (interfaces de salida)**: `IAutodiagnosticPort.ts`, `IProgressEventBus.ts`

#### 3. Infrastructure (`src/infrastructure/`)
Implementaciones concretas de los contratos del dominio.

- `LocalStorageProgressRepository.ts` — implementa `IStageProgressRepository`
- `LocalStorageEventBus.ts` — implementa `IProgressEventBus`
- `StaticStageContentRepository.ts` — lee archivos de `content/stages/`
- `N8NAutodiagnosticAdapter.ts` — implementa `IAutodiagnosticPort`
- `n8n.config.ts` — **único lugar** donde viven las URLs de N8N
- `env.ts` — acceso tipado a variables de entorno

#### 4. Presentation (`app/`, `components/`, `hooks/`, `lib/state/`)
Todo lo que React y Next.js tocan.

- **Server Components** (`app/etapa/[stageId]/page.tsx`): obtienen contenido antes del render
- **Client Components** (`StageClient.tsx`, `BlockRenderer.tsx`, bloques): interactividad
- **Store** (`lib/state/StageProgressStore.ts`): `useSyncExternalStore` por etapa

---

## Estructura de carpetas

Los archivos de configuración (`next.config.ts`, `tsconfig.json`, `package.json`, `eslint.config.mjs`, `postcss.config.mjs`) y la carpeta `public/` permanecen en la raíz — es un requisito de Next.js. **Todo el código fuente vive dentro de `src/`.**

```
.
├── src/                                 # Todo el código fuente
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Redirige a /inicio
│   │   ├── globals.css
│   │   ├── inicio/
│   │   │   ├── page.tsx                 # Página de bienvenida con Laia
│   │   │   └── ActionButtons.tsx
│   │   ├── etapa/
│   │   │   └── [stageId]/               # ← Ruta dinámica para TODAS las etapas
│   │   │       ├── page.tsx             # Server Component (obtiene árbol de contenido)
│   │   │       ├── StageClient.tsx      # Client Component (motor de renderizado)
│   │   │       ├── StageClientLoader.tsx # Wrapper dynamic(ssr:false) — evita hydration mismatch
│   │   │       └── stageClient.module.css
│   │   ├── etapas/
│   │   │   └── page.tsx                 # Selector de todas las etapas del modelo
│   │   ├── embebido-1/
│   │   │   └── page.tsx                 # Redirect legacy → /etapa/etapa-1
│   │   ├── modelo/
│   │   │   └── page.tsx                 # Redirect legacy → /etapa/etapa-1
│   │   └── opciones/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── character-step-dialog/       # Diálogo paso a paso con avatar de Laia
│   │   │   ├── CharacterStepDialog.tsx
│   │   │   └── CharacterStepDialog.module.css
│   │   ├── mini-spiral-viewer/          # Visor 3D del modelo espiral (canvas compacto)
│   │   │   └── MiniSpiralViewer.tsx
│   │   ├── tech-trail-background/       # Fondo animado con partículas tech
│   │   │   ├── TechTrailBackground.tsx
│   │   │   └── TechTrailBackground.module.css
│   │   └── stage/
│   │       ├── blocks/
│   │       │   └── blocks.module.css    # Estilos de bloques usados directamente en StageClient
│   │       ├── Frame.tsx / Frame.module.css
│   │       ├── HorizontalScrollRail.tsx
│   │       ├── PauseMenu.tsx / PauseMenu.module.css
│   │       ├── StageViewer.tsx / StageViewer.module.css
│   │       └── ToastStack.tsx / ToastStack.module.css
│   │
│   ├── content/
│   │   ├── stages/
│   │   │   ├── index.ts                 # Metadatos de todas las etapas (StageMeta)
│   │   │   └── stage-1.content.ts       # Árbol de contenido de Etapa 1
│   │   └── shared/
│   │       └── character-assets.ts      # Rutas de assets visuales de Laia
│   │
│   ├── hooks/                           # (actualmente vacío — lógica de estado directamente en StageClient)
│   │
│   ├── lib/
│   │   ├── state/
│   │   │   └── StageProgressStore.ts    # Progreso por etapa (useSyncExternalStore)
│   │   ├── progress.ts                  # Estado global de navegación (hasStarted, lastRoute)
│   │   └── useProgress.ts               # Hook useSyncExternalStore sobre progress.ts
│   │
│   ├── types/
│   │   └── stage.ts                     # Tipos de dominio compartidos (sin React)
│   │
│   ├── domain/                          # Núcleo — sin dependencias externas
│   │   └── stage/
│   │       ├── entities/
│   │       │   └── StageProgress.ts     # Modelo de datos de progreso
│   │       ├── value-objects/
│   │       │   ├── StageFlagKey.ts      # Union type de flags de etapa
│   │       │   └── HierarchyLevel.ts    # Nivel jerárquico del docente
│   │       └── repositories/            # Contratos (interfaces)
│   │           ├── IStageProgressRepository.ts
│   │           └── IStageContentRepository.ts
│   │
│   ├── application/                     # Casos de uso — orquesta dominio
│   │   └── stage/
│   │       ├── usecases/
│   │       │   └── GetStageContentUseCase.ts
│   │       └── ports/
│   │           ├── IAutodiagnosticPort.ts
│   │           └── IProgressEventBus.ts
│   │
│   └── infrastructure/                  # Implementaciones concretas
│       ├── config/
│       │   └── env.ts                   # Variables de entorno tipadas
│       ├── n8n/
│       │   ├── n8n.config.ts            # ⚠️ ÚNICO lugar con URLs de N8N
│       │   └── N8NAutodiagnosticAdapter.ts
│       └── persistence/
│           ├── LocalStorageEventBus.ts
│           ├── LocalStorageProgressRepository.ts
│           └── StaticStageContentRepository.ts  # ⚠️ Registrar nuevas etapas aquí
│
├── public/                              # Assets estáticos (requerido en raíz por Next.js)
├── next.config.ts                       # CSP headers + configuración Next.js
└── tsconfig.json                        # Path aliases: @/* → src/  @domain/* @application/* @infra/*
├── .env.local.example                   # ← Copiar como .env.local y rellenar
└── package.json
```

---

## Flujo de comunicación entre capas

### Ejemplo: docente guarda progreso de frames

```
[StageClient]                    Presentation
  writeProgress({ hasStarted: true })
       ↓
[lib/progress.ts]                Presentation/State
  localStorage.setItem(...)
       ↓
[useSyncExternalStore]           React reconciliation
  getSnapshot() → estado actualizado
       ↓
[StageClient re-render]          Presentation
  ActionButtons muestra "Continuar"
```

### Regla de importación

```
✅ Permitido:
  Presentation → Infrastructure (store/progress/n8n.config)
  Server Components → Application → Domain

❌ Prohibido:
  Domain → cualquier otra capa
  Presentation → Domain directamente (excepto tipos)
```

---

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con las URLs de N8N

# Iniciar servidor de desarrollo
pnpm dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

Rutas principales:
- `/` → redirige a `/inicio`
- `/inicio` → página de bienvenida con Laia
- `/etapas` → selector de todas las etapas del modelo
- `/etapa/etapa-1` → Etapa 1 (activa)
- `/modelo` → redirect legacy a `/etapa/etapa-1`
- `/embebido-1` → redirect legacy a `/etapa/etapa-1`

---

## Variables de entorno

Copiar `.env.local.example` como `.env.local` y completar los valores.

| Variable | Descripción | Requerida |
|---|---|---|
| `NEXT_PUBLIC_N8N_BASE_URL` | URL base de la instancia N8N | ✅ Para autodiagnóstico |
| `NEXT_PUBLIC_N8N_AUTODIAG_FORM_ID` | ID del formulario de autodiagnóstico en N8N | ✅ Para autodiagnóstico |
| `NEXT_PUBLIC_APP_ENV` | Entorno: `development` / `staging` / `production` | No (default: `development`) |
| `NEXT_PUBLIC_VERBOSE_LOGGING` | Logs adicionales en consola | No (automático en dev) |

Sin configurar N8N, el bloque de autodiagnóstico muestra un estado fallback informativo.

---

## Cómo agregar una nueva etapa

### Paso 1 — Crear el contenido

```typescript
// content/stages/stage-2.content.ts
import { LAIA_ASSETS } from "@/content/shared/character-assets";
import type { SectionNode } from "@/types/stage";

export const STAGE2_ID = "etapa-2";
export const STAGE2_NAME = "Descubre nuevas posibilidades";

export const STAGE2_TREE: SectionNode[] = [
  {
    id: "intro",
    title: "Introducción",
    requires: [],
    dialogue: { character: LAIA_ASSETS.neutral, lines: ["¡Bienvenido a la Etapa 2!"] },
    content: [{ type: "paragraphs", items: ["Contenido de ejemplo..."] }],
  },
];
```

### Paso 2 — Registrar en el repositorio

```typescript
// src/infrastructure/persistence/StaticStageContentRepository.ts
import { STAGE2_TREE } from "@/content/stages/stage-2.content";

const STAGE_REGISTRY: Record<string, SectionNode[]> = {
  "etapa-1": STAGE1_TREE,
  "etapa-2": STAGE2_TREE,  // ← agregar aquí
};
```

### Paso 3 — Actualizar metadatos

```typescript
// content/stages/index.ts
export const STAGE_META: StageMeta[] = [
  { id: "etapa-1", name: "Reconócete para avanzar", order: 1, href: "/etapa/etapa-1", available: true },
  { id: "etapa-2", name: "Descubre nuevas posibilidades", order: 2, href: "/etapa/etapa-2", available: true }, // ← true
  // ...
];
```

### Paso 4 — Agregar a generateStaticParams

```typescript
// app/etapa/[stageId]/page.tsx
export function generateStaticParams() {
  return [
    { stageId: "etapa-1" },
    { stageId: "etapa-2" }, // ← agregar aquí
  ];
}
```

La nueva etapa queda disponible en `/etapa/etapa-2`. No hay ningún cambio en `StageClient.tsx`.

---

## Cómo agregar un nuevo bloque de contenido

### Paso 1 — Definir el tipo

```typescript
// types/stage.ts — en el union type SectionContentBlock
| { type: "video-gallery"; videos: string[]; autoplay?: boolean }
```

### Paso 2 — Crear el componente

```typescript
// components/stage/blocks/VideoGalleryBlock.tsx
"use client";
import type { BlockContext } from "./BlockContext";

interface Props {
  videos: string[];
  autoplay?: boolean;
  ctx: BlockContext;
}

export function VideoGalleryBlock({ videos, autoplay, ctx }: Props) {
  return (
    <div>
      {videos.map((src) => (
        <video key={src} src={src} autoPlay={autoplay} controls />
      ))}
    </div>
  );
}
```

### Paso 3 — Despachar en BlockRenderer

```typescript
// components/stage/BlockRenderer.tsx
case "video-gallery":
  return <VideoGalleryBlock key={key} videos={block.videos} autoplay={block.autoplay} ctx={ctx} />;
```

### Paso 4 — Usar en contenido

```typescript
// content/stages/stage-1.content.ts (o cualquier etapa)
content: [
  { type: "video-gallery", videos: ["/videos/intro.mp4", "/videos/demo.mp4"] }
]
```

---

## Sistema de Frames — Guía de implementación

Esta sección documenta el sistema visual de secciones progresivas usado en la Etapa 1 (y base para etapas futuras). Cada "frame" es un panel glassmorphism que aparece en la página cuando el frame anterior completa su secuencia interactiva.

### Archivos clave

| Archivo | Responsabilidad |
|---|---|
| `src/components/stage/Frame.tsx` | Componente panel base — contiene la estructura visual |
| `src/components/stage/Frame.module.css` | Estilos del panel, bordes tech, corners, hintSlot |
| `src/app/etapa/[stageId]/StageClient.tsx` | Orquesta todos los frames, define `completedFrames` y `ScrollHint` |
| `src/app/etapa/[stageId]/StageClientLoader.tsx` | Wrapper `dynamic(ssr:false)` que evita hydration mismatch por persist de frames en localStorage |
| `src/app/etapa/[stageId]/stageClient.module.css` | Estilos del contenedor `.root`, gap entre frames y estilos de `ScrollHint` |

### Assets de la Etapa 1

| Recurso | Ruta |
|---|---|
| Fondo estándar | `/ui/backgroundUAO.png` |
| Fondo biblioteca | `/ui/fondo_biblioteca.png` |
| Fondo home | `/ui/bg-home.png` |
| Avatar Laia (neutral) | `/ui/laia.png` |
| Avatar Laia (explicando) | `/ui/laia_explaining.png` |
| Avatar Laia (explicando holo) | `/ui/Laia_explaining_holo.png` |
| Avatar Laia (confundida) | `/ui/laia_confused.png` |
| Avatar Laia (triunfante) | `/ui/Laia_triumphant.png` |
| Ícono Laia | `/ui/Laia-Icon.png` |
| Modelo 3D espiral | `/models/espiral.glb` |
| Video intro modelo | `/videos/intro-modelo.mp4` |
| Video transición E1 → E2 | `/videos/TransicionE1-a-E2.mp4` |

### Estado: `completedFrames`

El sistema usa un único contador de estado para controlar qué frames son visibles:

```tsx
const [completedFrames, setCompletedFrames] = useState(0);

/** Marca el frame N como terminado. Seguro llamarlo más de una vez. */
const completeFrame = useCallback((frameIndex: number) => {
  setCompletedFrames((prev) => Math.max(prev, frameIndex));
}, []);
```

Lógica de visibilidad:
- `completedFrames === 0` → solo Frame 1 visible (aparece siempre)
- `completedFrames >= 1` → Frame 2 aparece
- `completedFrames >= 2` → Frame 3 aparece
- El frame N llama `completeFrame(N)` cuando el usuario termina su interacción

### Indicador de avance: `ScrollHint`

Sub-componente definido en `StageClient.tsx` (no en un archivo separado):

```tsx
function ScrollHint({ label }: { label?: string }) {
  return (
    <div className={styles.scrollHint} aria-label="Desplázate hacia abajo">
      <span className={styles.scrollArrow} aria-hidden>▼</span>
      {label ? <span className={styles.scrollLabel}>{label}</span> : null}
    </div>
  );
}
```

**Regla**: `ScrollHint` siempre se pasa al frame mediante el prop `hint`. **Nunca** se renderiza fuera del frame ni con `position: sticky` en la página.

El componente `<Frame>` lo muestra en su slot `.hintSlot` (`position: absolute; bottom: -40px`), que sobresale ligeramente por debajo del borde del panel.

### Props del componente `<Frame>`

| Prop | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador HTML del panel |
| `sectionTitle` | `string` | Texto en esquina superior izquierda con decoración bracket |
| `backgroundImage` | `string` | Ruta del asset de fondo CSS (ej: `/ui/backgroundUAO.png`) |
| `overlay` | `string` | Color CSS del overlay oscurecedor (estándar: `"rgba(4, 2, 3, 0.45)"`) |
| `hint` | `ReactNode` | Indicador de avance — normalmente `<ScrollHint />` o `null` |
| `align` | `string?` | Alineación del contenido (opcional) |
| `background` | `string?` | Color de fondo sólido alternativo al `backgroundImage` |
| `children` | `ReactNode` | Contenido del frame |

### Anatomía visual

```
┌─ Frame (.frame) ───────────────────────────────── clamp(480px, 65vw, 1000px) ──┐
│  ├─ .backgroundLayer   (posición absolute, z-index 0 — CSS background-image)   │
│  ├─ .overlay           (posición absolute, z-index 1 — color oscurecedor)      │
│  ├─ span.cornerTL/TR/BL/BR  (brackets decorativos, z-index 3)                  │
│  ├─ .sectionTitle      (posición absolute top-left, z-index 3)                 │
│  └─ .content           (posición relative, z-index 2, flex, padding-top 52px+) │
│       └─ children                                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
         └─ .hintSlot  (posición absolute, bottom: -40px — fuera del borde)
```

Especificaciones CSS relevantes (`Frame.module.css`):
- `.frame`: `width: clamp(480px, 65vw, 1000px)`, `min-height: clamp(420px, 72dvh, 700px)`, glassmorphism (`background: rgba(6,4,5,0.82)` + `backdrop-filter: blur(16px)`), borde rojo (`border: 1.5px solid rgba(248,46,53,0.55)`), **sin `overflow: hidden`** (necesario para que `.hintSlot` sea visible)
- `.hintSlot`: `position: absolute; bottom: -40px; width: 100%; display: flex; justify-content: center`
- `.cornerTL/TR/BL/BR`: brackets en `#fe6a6f`, 20×20px, 3px de borde
- Separación entre frames (`.root` en `stageClient.module.css`): `gap: clamp(5rem, 12dvh, 8rem)` — suficiente para que el hintSlot no solape el frame siguiente

### Cómo añadir un frame nuevo

Copiar este patrón en `StageClient.tsx` después del último frame existente:

```tsx
{/* ═══ FRAME N: Nombre descriptivo ════════════════════════════ */}
{completedFrames >= N ? (
  <Frame
    id="frame-nombre"
    sectionTitle={`Sección ${N}: Título visible`}
    backgroundImage="/ui/backgroundUAO.png"
    overlay="rgba(4, 2, 3, 0.45)"
    hint={completedFrames >= N + 1 ? <ScrollHint label="Texto del indicador" /> : null}
  >
    {/* Contenido del frame */}
    <button onClick={() => completeFrame(N + 1)}>Avanzar →</button>
  </Frame>
) : null}
```

Donde `N` es el número del frame anterior (el frame nuevo es el N+1, pero verifica la condición `>= N`).

**Frame 1** es la excepción — siempre se renderiza sin condición porque es el punto de entrada.

### Frame con modelo 3D (`MiniSpiralViewer`)

```tsx
<div className={styles.modelStage}>
  <MiniSpiralViewer enableRotation />
</div>
```

Especificaciones de `.modelStage`:
- `height: clamp(300px, 50dvh, 480px)`
- `background: rgba(2, 1, 2, 0.80)` (contraste oscuro para el canvas 3D)
- `border-radius: 10px`, `overflow: hidden`

### Frame con video

```tsx
<video
  className={styles.videoPlayer}
  src="/videos/nombre-video.mp4"
  autoPlay
  playsInline
  onEnded={() => completeFrame(N)}
/>
```

Reglas del video:
- Sin prop `controls` (el video no puede pausarse — es narrativo)
- `pointer-events: none` via CSS (`.videoPlayer`)
- `onEnded` llama a `completeFrame(N)` para habilitar el siguiente frame
- `object-fit: contain` para respetar proporciones

### Frames implementados en Etapa 1

| Frame | ID | Trigger de completado |
|---|---|---|
| Frame 1 | `frame-intro` | `CharacterStepDialog` → último paso → `completeFrame(1)` |
| Frame 2 | `frame-modelo` | Video `intro-modelo.mp4` termina → `handleVideoEnded` → `completeFrame(2)` |
| Frame 3 | `frame-modelo-interactivo` | `LaiaChatBar` Fase B → último paso → `completeFrame(3)`. Añade `className={styles.frameWithBar}` + `hintOffset={200}` |

### Frame tipo "con barra de Laia" (usado en Frame 3)

Este tipo de frame tiene una `LaiaChatBar` que sobresale por debajo del borde inferior del frame. Se configura con dos props adicionales de `<Frame>`:

- `bottomBar={<LaiaChatBar ... />}` — renderiza en `.bottomBarSlot` (`position: absolute; bottom: -30px`), parcialmente fuera del borde
- `hintOffset={200}` — empuja el ScrollHint 200px hacia abajo para dejarlo por debajo de la barra
- `className={styles.frameWithBar}` — añade `margin-bottom` extra para que la barra no choque con el siguiente frame

El frame tiene dos fases internas gestionadas con `f3Phase: 'initial' | 'laia-model' | 'laia-viewer'`:
- **`initial`**: Modelo 3D visible + instrucciones + botón "Continuar"
- **`laia-model`**: Modelo 3D visible + `LaiaChatBar` con `F3_LAIA_STEPS_A`
- **`laia-viewer`**: Modelo oculto + `StageViewer` fijo top-right + `LaiaChatBar` con `F3_LAIA_STEPS_B`

### StageViewer (widget fijo top-right)

Componente `src/components/stage/StageViewer.tsx`. Aparece en Frame 3 fase B y permanece visible el resto del recorrido.

- `position: fixed; top: 1.5rem; right: 1.5rem; z-index: 100`
- Renderiza el modelo con rotación pasiva (sin OrbitControls)
- Prop: `stageLabel: string` — texto mostrado bajo el canvas (ej: `"Etapa actual: Etapa 1"`)
- **TODO pendiente**: animación de brillo/pulso intermitente en el anillo de la etapa activa. Ver comentario en `StageViewer.tsx` para instrucciones de implementación (Three.js mesh traversal + `emissiveIntensity` en `useFrame`)

### LaiaChatBar

Componente `src/components/stage/LaiaChatBar.tsx`. Barra de diálogo de Laia anclada al pie de un frame.

- Maneja internamente el avance de pasos (estado `current`)
- Prop `steps: LaiaChatStep[]` — array de `{ text, imgSrc? }`
- Prop `onComplete: () => void` — llamado al avanzar más allá del último paso
- Usa `key={f3Phase}` en StageClient para resetear el índice al cambiar de fase
- Avatar con `next/image` (`fill` + `unoptimized`)
- Botón de audio presente pero `disabled` (funcionalidad pendiente)

### Orden narrativo de la Etapa 1

El orden aprobado en `AGENTS_claude_stage1.md` que deben seguir los frames:

1. ✅ Entrada guiada con Laia (Frame 1)
2. ✅ Presentación del modelo 3D + video (Frame 2)
3. Animación grande para ubicar al usuario en la espiral
4. Viewer 3D que luego queda fijo arriba a la derecha
5. Explicación del stage actual
6. Rail de etapas
7. Estados
8. Consentimiento
9. Chatbot opcional
10. Embebido (autodiagnóstico)
11. Cierre con video
12. Transición a la siguiente etapa

No alterar este orden sin instrucción explícita.

---

## Integración con N8N

El autodiagnóstico se carga como un `<iframe>` del formulario de N8N.

| Archivo | Responsabilidad |
|---|---|
| `src/infrastructure/n8n/n8n.config.ts` | URLs de N8N — único lugar, lee de `process.env` |
| `src/infrastructure/n8n/N8NAutodiagnosticAdapter.ts` | Implementación de `IAutodiagnosticPort` para webhooks de N8N |
| `src/application/stage/ports/IAutodiagnosticPort.ts` | Contrato — no menciona N8N |

**Flujo de URL del iframe (actual):**
```
NEXT_PUBLIC_N8N_BASE_URL (.env.local)
  → env.ts (ENV.N8N_BASE_URL)
  → n8n.config.ts (N8N_CONFIG.forms.autodiagnostic)
  → StageClient (src del iframe embebido)
```

Para implementar la **recepción del resultado** vía webhook (pendiente):
1. Implementar `N8NAutodiagnosticAdapter.notifyCompletion()` con el webhook real de N8N
2. Crear `CompleteAutodiagnosticUseCase` que llame el adapter y persista `resultStateId` en el store

---

## Chatbot Laia

Laia es la asistente pedagógica. Actualmente aparece como:
- Diálogos paso a paso vía `CharacterStepDialog` (entrada de Etapa 1)
- Chat inline en Frame 3 (chat panel con avatar + input)
- Widget fijo `StageViewer` en esquina superior derecha desde Frame 3

### Para activar Laia conversacional (pendiente)

1. Crear `src/domain/chatbot/entities/ChatbotContext.ts` — estado: mood, nivel, etapa
2. Crear `src/domain/chatbot/rules/LaiaContextRule.ts` — elige mood según progreso
3. Crear `src/application/chatbot/usecases/BuildLaiaContextUseCase.ts`
4. Crear `src/infrastructure/chatbot/LaiaServiceAdapter.ts`
5. Crear `app/api/laia/route.ts` como BFF para el LLM

---

## Testing

La arquitectura permite testar cada capa de forma aislada.

### Componentes — con props mockeadas

```typescript
import { render, screen } from "@testing-library/react";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";

const mockSteps = [{ imgSrc: "/ui/laia.png", lines: ["Hola"] }];
render(<CharacterStepDialog steps={mockSteps} onComplete={vi.fn()} />);
expect(screen.getByRole("button")).toBeInTheDocument();
```

Para configurar Vitest:

```bash
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event
```

---

## Seguridad

| Medida | Dónde |
|---|---|
| Content Security Policy | `next.config.ts` — permite solo el dominio de N8N configurado |
| URLs de N8N en variables de entorno | `src/infrastructure/n8n/n8n.config.ts` |
| iframe con sandbox | `AutodiagnosticBlock.tsx` |
| X-Frame-Options | `next.config.ts` |
| X-Content-Type-Options | `next.config.ts` |
| Referrer-Policy | `next.config.ts` |

---

## Decisiones de arquitectura

### Clean Architecture en lugar de colocación por feature

El proyecto tiene tres dominios con distinto ritmo de cambio: **etapas** (contenido pedagógico, cambia por ciclo académico), **progreso** (lógica de estado del docente, estable) y **chatbot** (Laia, evoluciona hacia LLM). Clean Architecture separa estos dominios para que cada uno evolucione sin romper los otros.

### `useSyncExternalStore` + localStorage en lugar de Zustand

El estado del docente es local y debe sobrevivir recargas de página. `useSyncExternalStore` + `localStorage` con un store parametrizado por `stageId` resuelve esto sin dependencias adicionales y es SSR-safe. Cuando se integre un backend, solo cambia el repositorio — el hook de React no.

### Ruta dinámica `[stageId]` en lugar de páginas por etapa

Para que agregar una nueva etapa sea solo crear un archivo de contenido. `StageClient.tsx` es el mismo componente para todas las etapas — recibe el árbol de nodos diferente según `stageId`.

### Archivos de navegación global (mantenidos intencionalmente)

Dos archivos de `lib/` almacenan estado de navegación global separado del progreso de etapas:

| Archivo | Por qué se conserva |
|---|---|
| `lib/progress.ts` | Estado global: `hasStarted` y `lastRoute` para el botón "Continuar" en `/inicio` |
| `lib/useProgress.ts` | Hook `useSyncExternalStore` sobre `lib/progress.ts` — usado por `ActionButtons` y `/opciones` |

Almacenan datos distintos a `Stage1ProgressState` y no deben mezclarse con `StageProgressStore`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
