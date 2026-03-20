# AI TECH-ED - Modelo de Proceso GenAI Educativo

Plataforma interactiva basada en **Next.js 16 App Router** para acompanar a docentes universitarios en un modelo de proceso GenAI de 6 etapas.

## Indice

1. [Referencias oficiales](#referencias-oficiales)
2. [Que hace esta app](#que-hace-esta-app)
3. [Arquitectura](#arquitectura)
4. [Estructura de carpetas](#estructura-de-carpetas)
5. [Flujo de comunicacion entre capas](#flujo-de-comunicacion-entre-capas)
6. [Como ejecutar el proyecto](#como-ejecutar-el-proyecto)
7. [Variables de entorno](#variables-de-entorno)
8. [Flujo de Etapa 1](#flujo-de-etapa-1)
9. [Limpieza preparatoria de Etapa 1](#limpieza-preparatoria-de-etapa-1)
10. [Como agregar una nueva etapa](#como-agregar-una-nueva-etapa)
11. [Como agregar un nuevo bloque de contenido](#como-agregar-un-nuevo-bloque-de-contenido)
12. [Integracion con N8N](#integracion-con-n8n)
13. [Chatbot Laia](#chatbot-laia)
14. [Testing](#testing)
15. [Seguridad](#seguridad)
16. [Decisiones de arquitectura](#decisiones-de-arquitectura)

## Referencias oficiales

Las decisiones sobre Etapa 1 deben seguir este orden de prioridad:

1. `agents.md` del repositorio.
2. El documento **"Flujo de diseno - Etapa 1"**, que ahora es la referencia definitiva para el flujo de Etapa 1.
3. Este `README.md`, que documenta el estado real de la implementacion despues de la limpieza preparatoria.

Si el codigo contradice el documento **"Flujo de diseno - Etapa 1"**, el documento manda.

## Que hace esta app

La app ofrece un recorrido stage-driven por el modelo espiral GenAI.

| Etapa | Nombre | Estado actual |
|---|---|---|
| 1 | Reconocete para avanzar | Base oficial en preparacion |
| 2 | Descubre nuevas posibilidades | Pendiente |
| 3 | Disena con proposito | Pendiente |
| 4 | Prepara el terreno para el exito | Pendiente |
| 5 | Hazlo realidad en el aula | Pendiente |
| 6 | Reflexiona, aprende y mejora | Pendiente |

La implementacion actual conserva:

- pantalla de inicio con Laia
- ruta dinamica por etapa en `src/app/etapa/[stageId]/`
- renderizado por contenido en `src/content/stages/`
- viewer 3D mini persistente para la etapa
- dialogos de Laia por bloques
- consentimiento
- embebido de autodiagnostico
- infraestructura preparada para progreso local y futuras etapas

## Arquitectura

El proyecto sigue **Clean Architecture** adaptada a Next.js App Router.

```text
Presentation -> Application -> Domain
Infrastructure -> Application -> Domain
```

### Capas

#### 1. Domain (`src/domain/`)

Reglas puras de negocio.

- `stage/entities/StageProgress.ts`
- `stage/value-objects/StageFlagKey.ts`
- `stage/rules/ConsentRule.ts`
- `stage/rules/GatingRule.ts`
- `stage/rules/ResultRule.ts`
- `chatbot/rules/LaiaContextRule.ts`

#### 2. Application (`src/application/`)

Casos de uso que orquestan el dominio.

- `EvaluateFlagsUseCase.ts`
- `GetStageContentUseCase.ts`
- `StartStageUseCase.ts`
- `CompleteAutodiagnosticUseCase.ts`
- `BuildLaiaContextUseCase.ts`

#### 3. Infrastructure (`src/infrastructure/`)

Implementaciones concretas de persistencia y configuracion.

- `LocalStorageProgressRepository.ts`
- `LocalStorageEventBus.ts`
- `StaticStageContentRepository.ts`
- `N8NAutodiagnosticAdapter.ts`
- `n8n.config.ts`
- `env.ts`

#### 4. Presentation (`src/app/`, `src/components/`, `src/hooks/`, `src/lib/`)

UI, hooks y stores.

- `src/app/etapa/[stageId]/page.tsx`
- `src/app/etapa/[stageId]/StageClient.tsx`
- `src/components/stage/*`
- `src/hooks/domain/useStageProgress.ts`
- `src/hooks/ui/useProgressiveReveal.ts`
- `src/hooks/ui/useScrollPin.ts`
- `src/lib/progress.ts`
- `src/lib/useProgress.ts`
- `src/lib/state/StageProgressStore.ts`

## Estructura de carpetas

```text
.
|-- public/
|   |-- models/
|   |-- ui/
|   `-- videos/
|-- src/
|   |-- app/
|   |   |-- inicio/
|   |   |-- etapa/[stageId]/
|   |   |-- embebido-1/
|   |   |-- modelo/
|   |   `-- opciones/
|   |-- application/
|   |   |-- chatbot/usecases/
|   |   `-- stage/
|   |       |-- ports/
|   |       `-- usecases/
|   |-- components/
|   |   |-- character-step-dialog/
|   |   |-- mini-spiral-viewer/
|   |   |-- stage/
|   |   `-- tech-trail-background/
|   |-- content/
|   |   |-- shared/
|   |   `-- stages/
|   |-- domain/
|   |   |-- chatbot/
|   |   |-- shared/
|   |   `-- stage/
|   |-- hooks/
|   |   |-- domain/
|   |   `-- ui/
|   |-- infrastructure/
|   |   |-- config/
|   |   |-- n8n/
|   |   `-- persistence/
|   |-- lib/
|   |   |-- scroll/
|   |   `-- state/
|   `-- types/
|-- README.md
`-- agents.md
```

### Bloques vigentes del sistema de etapas

Los bloques actualmente soportados por `BlockRenderer` son:

- `paragraphs`
- `callout`
- `bullets`
- `horizontal-rail`
- `state-cards`
- `stage1-animation`
- `consent-form`
- `autodiagnostic-module`
- `transition-animation`
- `custom`

## Flujo de comunicacion entre capas

Ejemplo: docente valida consentimiento y habilita el autodiagnostico.

```text
ConsentFormBlock
  -> ctx.onUpdate(...)
  -> useStageProgress(stageId)
  -> StageProgressStore.patchStore(stageId, patch)
  -> LocalStorageProgressRepository.write(stageId, next)
  -> EvaluateFlagsUseCase(state)
  -> ConsentRule.evaluate(...)
  -> StageClient re-render
```

Reglas de dependencia:

- `Domain` no depende de ninguna otra capa.
- `Application` depende de `Domain`.
- `Infrastructure` implementa contratos de `Application` y `Domain`.
- `Presentation` consume `Application`, `Domain` tipado y stores/hooks.

## Como ejecutar el proyecto

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Rutas principales:

- `/` -> redirige a `/inicio`
- `/inicio` -> lobby de entrada con Laia
- `/etapa/etapa-1` -> base actual de Etapa 1
- `/modelo` -> redirect legacy a `/etapa/etapa-1`
- `/opciones` -> reseteo local de progreso

## Variables de entorno

Copiar `.env.local.example` como `.env.local` y completar:

| Variable | Descripcion | Requerida |
|---|---|---|
| `NEXT_PUBLIC_N8N_BASE_URL` | URL base de N8N | Si |
| `NEXT_PUBLIC_N8N_AUTODIAG_FORM_ID` | ID del formulario de autodiagnostico | Si |
| `NEXT_PUBLIC_APP_ENV` | `development`, `staging` o `production` | No |
| `NEXT_PUBLIC_VERBOSE_LOGGING` | logs adicionales en cliente | No |

Si N8N no esta configurado, el bloque embebido muestra fallback.

## Flujo de Etapa 1

### Fuente de verdad

El flujo definitivo de Etapa 1 no se define ya por el estado heredado del codigo sino por el documento **"Flujo de diseno - Etapa 1"**.

### Base oficial actual en codigo

Despues de la limpieza preparatoria, `src/content/stages/stage-1.content.ts` queda como base oficial temporal para la siguiente implementacion. Su orden actual es:

1. `Reconocete para avanzar`
2. `Presentacion amplia del modelo`
3. `Donde estas dentro del modelo`
4. `Recorrido general de las 6 etapas`
5. `Estados del recorrido`
6. `Confianza y consentimiento`
7. `Autodiagnostico`

### Rol actual del viewer 3D

- el mini viewer se conserva
- ya no aparece antes de completar la presentacion amplia
- se mantiene desacoplado del sistema de continuidad
- hoy solo funciona como orientacion visual de la etapa

### Diferencia entre "Ir a etapas" y "Continuar"

Todavia no esta implementada la continuidad exacta por bloque o hito del documento definitivo.

Estado actual:

- `Continuar` usa `src/lib/progress.ts` y recuerda `lastRoute`
- no reconstruye aun el bloque exacto dentro de la etapa
- el desbloqueo del boton global para ir a cualquier etapa sigue pendiente de la implementacion definitiva

### Papel de Laia

- sigue activa como narradora y guia textual
- los dialogos viven en `content/`
- la logica de mood sigue preparada en dominio/aplicacion
- durante el autodiagnostico el foco queda en el embebido; la minimizacion formal de Laia se implementara en la siguiente iteracion

### Multimedia hardcodeado en esta fase

Por decision de fase, los assets siguen hardcodeados y centralizados de forma pragmatica:

- `public/videos/intro-modelo.mp4`
- `public/videos/TransicionE1-a-E2.mp4`
- `public/models/espiral.glb`
- `public/ui/*`

La implementacion definitiva puede seguir usando rutas hardcodeadas mientras se mantengan ordenadas y documentadas.

## Limpieza preparatoria de Etapa 1

### Que se elimino

Se retiro la logica que pertenecia a una version anterior del flujo de Etapa 1:

- bloque obligatorio de resultado como paso fijo de la etapa
- bloque de intencion personal
- caso `result-summary` del `BlockRenderer`
- caso `intention-form` del `BlockRenderer`
- flag `intentionSaved`
- campos `intentionText`, `emotion` e `intentionSaved` del estado de progreso
- `src/components/stage/blocks/IntentionFormBlock.tsx`
- `src/components/stage/blocks/ResultSummaryBlock.tsx`
- `src/application/stage/usecases/SaveIntentionUseCase.ts`
- `src/components/Button.tsx`
- `src/app/modelo/scene3d.tsx`
- `src/app/modelo/ModeloClient.tsx`

Tambien se limpio la orquestacion vieja:

- el rail ya no vive al inicio de `stage-1.content.ts`
- el viewer ya no muestra el contador heredado de 5 hitos
- el viewer fijo ya no aparece antes de completar la presentacion inicial
- el autodiagnostico ya no intenta scrollear a un bloque de resultado eliminado

### Que se conserva

Se mantiene como base reutilizable y util:

- ruta dinamica `/etapa/[stageId]`
- `StageShell`
- `MiniSpiralViewer`
- `useProgressiveReveal`
- `useScrollPin`
- `DialogueBlock` y `CharacterStepDialog`
- `HorizontalScrollRail`
- `StateCardsBlock`
- `ConsentFormBlock`
- `AutodiagnosticBlock`
- `TransitionAnimationBlock` como bloque reusable, aunque no esta conectado en la base temporal actual de Etapa 1
- `StageProgressStore`
- `lib/progress.ts` y `lib/useProgress.ts` para navegacion general
- `ResultRule.ts` y `resultStateId` como base de una futura lectura del autodiagnostico sin volver a introducir el flujo viejo

### Que se considera la base oficial ahora

Desde esta limpieza:

- `src/content/stages/stage-1.content.ts` es la base oficial temporal de Etapa 1 en codigo
- el documento **"Flujo de diseno - Etapa 1"** es la referencia definitiva del flujo
- cualquier nueva implementacion de bloques grandes debe partir de esta base limpia, no de los pasos eliminados

## Como agregar una nueva etapa

1. Crear `src/content/stages/stage-2.content.ts`.
2. Registrar el arbol en `src/infrastructure/persistence/StaticStageContentRepository.ts`.
3. Agregar metadatos en `src/content/stages/index.ts`.
4. Agregar el `stageId` en `generateStaticParams()` de `src/app/etapa/[stageId]/page.tsx`.

Ejemplo minimo:

```ts
import type { SectionNode } from "@/types/stage";

export const STAGE2_TREE: SectionNode[] = [
  {
    id: "intro",
    title: "Descubre nuevas posibilidades",
    content: [{ type: "paragraphs", paragraphs: ["Contenido base"] }],
  },
];
```

## Como agregar un nuevo bloque de contenido

1. Agregar el tipo en `src/types/stage.ts`.
2. Crear el componente en `src/components/stage/blocks/`.
3. Registrar el `case` en `src/components/stage/BlockRenderer.tsx`.
4. Usarlo desde `content/`.

Ejemplo:

```ts
// src/types/stage.ts
| { type: "video-gallery"; videos: string[] }
```

```tsx
// src/components/stage/blocks/VideoGalleryBlock.tsx
"use client";

type Props = {
  videos: string[];
};

export default function VideoGalleryBlock({ videos }: Props) {
  return <div>{videos.length} videos</div>;
}
```

```tsx
// src/components/stage/BlockRenderer.tsx
case "video-gallery":
  return <VideoGalleryBlock key={key} videos={block.videos} />;
```

## Integracion con N8N

El autodiagnostico se carga como `iframe`.

| Archivo | Responsabilidad |
|---|---|
| `src/infrastructure/n8n/n8n.config.ts` | URLs y configuracion |
| `src/infrastructure/n8n/N8NAutodiagnosticAdapter.ts` | Adaptador de comunicacion |
| `src/application/stage/ports/IAutodiagnosticPort.ts` | Contrato |
| `src/components/stage/blocks/AutodiagnosticBlock.tsx` | UI del embebido |

Flujo de configuracion:

```text
.env.local
  -> env.ts
  -> n8n.config.ts
  -> N8NAutodiagnosticAdapter
  -> AutodiagnosticBlock
```

## Chatbot Laia

Laia se conserva como sistema real del proyecto.

Actualmente aparece como:

- avatar en `/inicio`
- dialogos por bloque en las etapas
- contexto preparado para estados de animo segun progreso

Base tecnica:

- `src/domain/chatbot/entities/ChatbotContext.ts`
- `src/domain/chatbot/rules/LaiaContextRule.ts`
- `src/application/chatbot/usecases/BuildLaiaContextUseCase.ts`

## Testing

La estructura sigue preparada para pruebas por capa:

- dominio: reglas puras
- aplicacion: casos de uso
- presentacion: componentes con props mockeadas

Comandos base disponibles:

```bash
pnpm lint
pnpm build
```

## Seguridad

| Medida | Donde |
|---|---|
| CSP | `next.config.ts` |
| sandbox del iframe | `AutodiagnosticBlock.tsx` |
| variables de entorno para N8N | `src/infrastructure/n8n/n8n.config.ts` |
| headers de seguridad | `next.config.ts` |

## Decisiones de arquitectura

### Clean Architecture

Se conserva porque el problema actual es de orquestacion del flujo, no de arquitectura base.

### Ruta dinamica por etapa

Se mantiene `src/app/etapa/[stageId]/` para que cada etapa siga siendo independiente.

### Contenido en `content/`

Los textos, dialogos y orden de bloques siguen viviendo en `src/content/stages/`.

### Multimedia hardcodeado por fase

Se acepta en esta fase para no sobre-generalizar antes de cerrar el flujo definitivo de Etapa 1.

### Limpieza antes que reimplementacion

Antes de construir los bloques grandes pendientes del flujo definitivo, se elimino la cola heredada que obligaba a pasar por resultado e intencion. La siguiente iteracion debe partir de esta base limpia.
