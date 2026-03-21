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
10. [Esqueleto estructural de Etapa 1](#esqueleto-estructural-de-etapa-1)
11. [Como agregar una nueva etapa](#como-agregar-una-nueva-etapa)
12. [Como agregar un nuevo bloque de contenido](#como-agregar-un-nuevo-bloque-de-contenido)
13. [Integracion con N8N](#integracion-con-n8n)
14. [Chatbot Laia](#chatbot-laia)
15. [Testing](#testing)
16. [Seguridad](#seguridad)
17. [Decisiones de arquitectura](#decisiones-de-arquitectura)

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
| 1 | Reconocete para avanzar | Implementacion actual consolidada |
| 2 | Descubre nuevas posibilidades | Landing provisional de llegada |
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

- `stage-entry`
- `stage-header`
- `paragraphs`
- `callout`
- `bullets`
- `horizontal-rail`
- `state-cards`
- `contextual-chatbot`
- `stage1-animation`
- `consent-form`
- `autodiagnostic-module`
- `transition-animation`
- `scaffold-panel`
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
- `/etapa/etapa-1` -> implementacion actual consolidada de Etapa 1
- `/etapa/etapa-2` -> landing provisional de llegada desde la transicion de Etapa 1
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

`src/content/stages/stage-1.content.ts` es la implementacion stage-driven oficial de Etapa 1. Su secuencia actual es:

1. `Entrada de Etapa 1`
2. `Presentacion inicial del modelo`
3. `Encabezado del stage`
4. `Progresion dentro del modelo`
5. `Laia como guia del recorrido`
6. `Scroll vertical y reveal acumulativo`
7. `Botones de continuidad y navegacion`
8. `Explicacion del modelo`
9. `Rail de etapas`
10. `Estados del docente`
11. `Consentimiento`
12. `Chatbot contextual`
13. `Autodiagnostico embebido`
14. `Cierre de la etapa`
15. `Video final`
16. `Transicion a la Etapa 2`

### Que se implemento finalmente

Etapa 1 ya no esta solo en estado de base o esqueleto. Hoy queda implementada como recorrido funcional con:

- entrada con Laia, CTA principal y opcion de `Continuar donde iba`
- animacion amplia inicial del modelo, con desbloqueo del boton global `Ir a etapas`
- viewer 3D persistente reducido, separado del sistema de continuidad
- encabezado funcional del stage con titulo visible `Etapa 1: Reconocete para avanzar`
- explicacion de ubicacion dentro del modelo antes del rail
- rail sticky con resumen digerible de las 6 etapas
- bloque de estados del docente con apoyo contextual de Laia
- consentimiento obligatorio previo al autodiagnostico
- chatbot contextual opcional y no bloqueante
- autodiagnostico embebido integrado al marco visual de la cartilla
- cierre de etapa, video final obligatorio y transicion ambientada a Etapa 2

### Contraste con el README anterior

Estas afirmaciones del README viejo ya no eran correctas y se actualizan aqui:

- donde decia que Etapa 1 estaba en `base oficial en preparacion`, hoy ya existe una implementacion funcional de punta a punta
- donde decia que `src/content/stages/stage-1.content.ts` era solo un `esqueleto estructural`, hoy ya define el flujo implementado
- donde decia que `TransitionAnimationBlock` no estaba conectado, hoy ya forma parte del cierre obligatorio de Etapa 1
- donde la lista de bloques soportados omitia `contextual-chatbot`, hoy ya se documenta como bloque vigente del sistema

### Entrada implementada

La primera parte del flujo ya tiene implementacion funcional:

- pantalla inicial dentro de la Etapa 1
- presencia visible de Laia
- CTA principal para iniciar
- boton de continuar exacto desde la entrada cuando existe progreso guardado
- animacion amplia del modelo en modo protagonista
- desbloqueo del boton global `Ir a etapas` al terminar la animacion

El CTA de entrada desplaza al usuario hacia la presentacion amplia sin romper el sistema de continuidad global existente. Si el usuario ya habia avanzado dentro de la etapa, la entrada tambien ofrece continuar exactamente en la ultima seccion guardada.

### Rol actual del viewer 3D

- durante la animacion inicial el viewer funciona en modo protagonista
- al terminar la animacion se reduce y queda fijo en la esquina superior derecha
- el viewer muestra la etapa actual como activa y usa la mejor senal visual disponible sin depender del sistema de continuidad
- se mantiene desacoplado del sistema de continuidad
- su responsabilidad es orientar visualmente la etapa actual, no recordar la seccion exacta del recorrido
- al cerrar Etapa 1, el viewer pasa a mostrarla como completada y resalta de forma sutil la Etapa 2 como siguiente estacion

### Diferencia entre "Ir a etapas" y "Continuar"

Estado actual:

- `Continuar` usa `src/lib/progress.ts` y recuerda `lastRoute`, `lastStageId` y `lastSectionId`
- `Continuar` ya puede retomar la seccion exacta guardada dentro de la etapa usando hash de seccion
- el desbloqueo del boton global para ir a cualquier etapa ocurre cuando se activa `stage1AnimationViewed`
- el boton ya existe y abre la navegacion global de etapas
- el viewer solo indica etapa activa; no guarda checkpoints ni reemplaza la continuidad
- la navegacion final de etapas futuras sigue limitada por las etapas publicadas en `STAGE_META`

### Explicacion del modelo

- antes del rail aparece un bloque explicativo que ubica al usuario dentro de la espiral
- ese bloque explica por que el recorrido empieza en Etapa 1: primero se reconoce el punto de partida y luego se abre el resto del modelo
- la explicacion vive en `src/content/stages/stage-1.content.ts` y usa bloques stage-driven, sin meter logica de negocio en la UI

### Rail de etapas

- el rail aparece solo despues de explicar la ubicacion dentro del modelo
- reutiliza `HorizontalScrollRail` para resumir las 6 etapas sin convertir el flujo en tabs ni wizard
- Etapa 1 se marca como actual dentro del rail
- el desplazamiento principal sigue siendo vertical: el scroll del usuario mueve el rail y despues permite continuar naturalmente con los siguientes bloques
- el rail incluye una senal explicita para indicar que se puede seguir bajando

### Por que el rail va despues

El flujo definitivo pide que el usuario primero entienda en que punto de la espiral esta y por que inicia en esta etapa. Solo despues de ese contexto aparece el resumen de las seis etapas, para que el rail funcione como mapa breve y no como una lista pesada sin explicacion previa.

### Estados del docente

- el bloque presenta tres estados posibles: `Aprendiendo sin miedo`, `Explorando con proposito` e `Innovando e inspirando`
- los estados se muestran como orientaciones de acompanamiento y no como juicios, etiquetas ni clasificaciones fijas del docente
- cada tarjeta explica que significa ese estado y como cambia el tono del acompanamiento dentro de la cartilla
- Laia introduce este bloque con un dialogo breve para reforzar que el objetivo es acompanar, no evaluar
- el bloque mantiene la logica de scroll progresivo y acumulativo, y cierra con una senal clara para seguir avanzando

### Por que ocurre antes del consentimiento

En el flujo definitivo, el usuario primero entiende su lugar en el modelo y luego comprende como la cartilla adapta el acompanamiento segun estos estados. Despues de ese contexto aparece el consentimiento, porque el embebido y el autodiagnostico deben llegar cuando ya esta claro para que sirve el recorrido y como se va a modular el apoyo.

### Consentimiento

- Laia contextualiza este momento antes del formulario y refuerza que el ejercicio es confidencial, no punitivo y de proposito formativo
- el bloque pide dos acuerdos explicitos y un correo valido para compartir el resultado
- la validacion real sigue dependiendo de `consentValidated`, calculado desde dominio y aplicacion
- cuando el consentimiento queda valido, el CTA `Aceptar y continuar` habilita el siguiente tramo del flujo
- ese paso activa la continuidad hacia el bloque posterior y prepara la apertura del autodiagnostico sin mezclar la logica del embebido dentro del formulario

### Dependencias activadas por el consentimiento

- `consentValidated` habilita el acceso al bloque siguiente dentro de la secuencia
- el boton del consentimiento marca `autodiagnosticStarted` para dejar listo el tramo operativo posterior
- el chatbot contextual aparece despues de este acuerdo y el embebido sigue dependiendo de `consentValidated` junto con `autodiagnosticStarted`

### Chatbot contextual

- aparece despues del consentimiento y antes del embebido, como una ayuda opcional integrada al scroll principal
- Laia explica para que sirve, cuando puede ayudar y recuerda que el usuario puede continuar aunque no lo use
- en esta version el bloque ofrece preguntas sugeridas con respuestas hardcodeadas dentro de la misma pagina
- el bloque no funciona como overlay ni bloquea el flujo: incluye un CTA directo para continuar al autodiagnostico
- el contexto visual de Laia ya usa la base de `BuildLaiaContextUseCase`, pero las respuestas del chatbot siguen siendo provisionales

### Autodiagnostico embebido

- se accede despues del consentimiento valido y del paso de continuidad que activa `autodiagnosticStarted`
- el embebido permanece dentro del marco visual de la cartilla, con un contenedor propio del stage en lugar de sentirse como una pagina ajena
- durante este tramo Laia entra en silencio narrativo para que el foco quede en la interaccion individual con el modulo
- si el embebido tarda en cargar, el stage mantiene una capa de espera integrada y, si falla, muestra un fallback sin romper la continuidad visual
- el scroll general no se reemplaza: el autodiagnostico sigue siendo una seccion mas del recorrido y, al completarse, habilita el cierre de la etapa

### Cierre de etapa

- cuando el embebido se completa, el recorrido vuelve al marco principal de la cartilla antes de salir de Etapa 1
- el viewer cambia para mostrar Etapa 1 como completada y sugerir Etapa 2 como siguiente paso
- el cierre no dispara una ruta de inmediato: primero recupera el contexto general, luego conduce al video final obligatorio

### Video final y transicion

- el video final es obligatorio y bloquea el avance hasta completarse
- al terminar, activa `transitionAnimationViewed`, habilita el boton `Continuar a Etapa 2` y dispara el cambio de ambiente del fondo
- la transicion no se resuelve como un simple enlace: primero cambia la estacion visual del recorrido y luego conduce a una landing provisional de Etapa 2 para evitar una ruta rota

### Pase de estabilizacion

Se hizo un pase quirurgico de estabilizacion sin cambiar el flujo aprobado de Etapa 1.

Que se estabilizo:

- la deteccion de seccion activa ahora es mas estable para bloques altos y para el rail sticky
- el scroll hacia secciones visibles y la restauracion por hash ya reservan espacio para el viewer fijo
- cada seccion activa puede mostrar una retroalimentacion breve para indicar si el usuario debe seguir bajando o si el avance esta bloqueado temporalmente
- la animacion inicial y el video final ahora muestran una guia visible adicional sobre el estado del avance
- se suavizaron los estados visuales entre bloques para que el reveal acumulativo no se sienta abrupto
- se reforzo la contencion horizontal del layout para reducir desbordes visuales

Bugs resueltos:

- se redujo el salto visual cuando `scrollIntoView` aterrizaba debajo del viewer persistente
- el rail tiene una lectura mas estable porque la seccion activa ya no depende solo del `intersectionRatio`
- los bloqueos temporales durante la animacion inicial y el video final ahora tienen feedback visible y persistente
- se corrigio parte de la sensacion de que algunos bloques “se salen” de pantalla por falta de contencion horizontal
- se corrigio el bloqueo fantasma del scroll en los videos obligatorios: ahora el lock se activa solo cuando el video entra realmente en zona de foco, muestra una accion visible dentro del viewport y se libera de inmediato al terminar la reproduccion

Limitaciones que permanecen:

- el chatbot sigue siendo una ayuda provisional con respuestas hardcodeadas
- Etapa 2 sigue siendo una landing provisional, no su flujo completo
- el embebido depende de la integracion actual con N8N y puede mostrar fallback si no carga

### Papel de Laia

- sigue activa como narradora y guia textual
- los dialogos viven en `content/`
- la logica de mood sigue preparada en dominio/aplicacion
- ya existe una seccion funcional propia para su papel de guia, texto y apoyo contextual dentro de la etapa
- contextualiza la entrada, los estados, el consentimiento y la ayuda previa al embebido
- durante el autodiagnostico entra en silencio narrativo para no competir con la interaccion principal
- el audio sigue siendo una decision temporal pendiente, pero la estructura ya deja ese espacio reservado

### Multimedia hardcodeado en esta fase

Por decision de fase, los assets siguen hardcodeados y centralizados de forma pragmatica:

- `public/videos/intro-modelo.mp4`
- `public/videos/TransicionE1-a-E2.mp4`
- `public/models/espiral.glb`
- `public/ui/bg-home.png`
- `public/ui/*`
- `src/content/shared/character-assets.ts`

La implementacion definitiva puede seguir usando rutas hardcodeadas mientras se mantengan ordenadas y documentadas.

### Componentes reutilizables para otras etapas

La implementacion actual de Etapa 1 deja estas piezas listas para reutilizarse en otras etapas sin acoplarlas al contenido de esta estacion:

- `StageShell`, para ambientacion, viewer persistente y boton global de etapas
- `ProgressiveSection`, `useProgressiveReveal` y `useScrollPin`, para reveal acumulativo y scroll guiado
- `BlockRenderer` y los bloques `stage-entry`, `stage-header`, `horizontal-rail`, `state-cards`, `consent-form`, `contextual-chatbot`, `autodiagnostic-module`, `transition-animation` y `scaffold-panel`
- `AnimationCard` y `AnimationBlock`, para momentos multimedia con bloqueo temporal y feedback de avance
- `lib/progress.ts`, `lib/useProgress.ts` y `StageProgressStore`, para continuidad global y progreso por etapa

La justificacion de mantenerlos como reutilizables es que el flujo aprobado exige independencia entre etapas, pero no justifica duplicar sistemas de shell, reveal, continuidad, rail o embeds.

### Componentes y configuraciones especificas de Etapa 1

Hoy lo realmente especifico de Etapa 1 vive sobre todo en configuracion y contenido:

- `src/content/stages/stage-1.content.ts`, que define el orden, copy, dialogos, estados, prompts y acciones del flujo
- los flags `stage1AnimationViewed` y `transitionAnimationViewed` usados en esta primera estacion
- el video `public/videos/intro-modelo.mp4` como presentacion amplia de Etapa 1
- el video `public/videos/TransicionE1-a-E2.mp4` como cierre actual de la transicion
- los paneles del rail, los estados del docente y los prompts del chatbot cargados desde contenido hardcodeado

La justificacion es no sobre-generalizar todavia el multimedia ni el contenido narrativo mientras la referencia definitiva sigue siendo el documento de flujo de Etapa 1.

### Cambios importantes respecto al proyecto anterior

- se elimino la cola vieja de `resultado -> intencion -> transicion` que contradecia el flujo definitivo
- la entrada ahora convive con dos sistemas distintos y complementarios: `Continuar` para volver al punto exacto e `Ir a etapas` para navegacion global desbloqueada
- el viewer dejo de comportarse como pseudo-navegacion interna y quedo separado de la continuidad real
- el rail salio del inicio heredado y paso a aparecer solo despues de explicar la ubicacion en el modelo
- el consentimiento, el chatbot y el embebido quedaron orquestados en el orden aprobado
- el cierre ya no es un simple cambio de ruta: vuelve al marco principal, exige video final y luego habilita la llegada a Etapa 2

### Supuestos y decisiones temporales vigentes

- el documento **"Flujo de diseno - Etapa 1"** sigue siendo la referencia definitiva si el codigo o el README se contradicen
- el multimedia permanece hardcodeado y centralizado por fase
- el chatbot sigue siendo una ayuda provisional con respuestas hardcodeadas
- el embebido sigue dependiendo de la integracion actual con N8N y puede caer a fallback
- la landing de Etapa 2 existe solo como llegada segura mientras su flujo completo sigue pendiente
- el audio de Laia sigue reservado como capacidad futura, no como funcionalidad ya cerrada

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
- `ContextualChatbotBlock`
- `StateCardsBlock`
- `ConsentFormBlock`
- `AutodiagnosticBlock`
- `TransitionAnimationBlock`, ya conectado al cierre obligatorio de Etapa 1
- `StageProgressStore`
- `lib/progress.ts` y `lib/useProgress.ts` para navegacion general
- `ResultRule.ts` y `resultStateId` como base de una futura lectura del autodiagnostico sin volver a introducir el flujo viejo

### Que se considera la base oficial ahora

Desde esta limpieza:

- `src/content/stages/stage-1.content.ts` es la base oficial de la implementacion actual de Etapa 1 en codigo
- el documento **"Flujo de diseno - Etapa 1"** es la referencia definitiva del flujo
- cualquier ajuste nuevo debe partir de esta base limpia y funcional, no de los pasos eliminados del flujo anterior

## Esqueleto estructural de Etapa 1

### Que se creo

Esta seccion se conserva por trazabilidad, pero ya no describe un esqueleto pendiente. La estructura creada ya quedo consolidada en la implementacion actual de Etapa 1.

Nuevas piezas estructurales:

- bloque reusable `scaffold-panel` en `src/types/stage.ts`
- bloque reusable `stage-entry` para la pantalla inicial
- bloque reusable `stage-header` para el encabezado funcional del stage
- componente reusable [`src/components/stage/blocks/ScaffoldPanelBlock.tsx`](/e:/ModeloProceso/ModeloProceso_Repo/src/components/stage/blocks/ScaffoldPanelBlock.tsx)
- componente reusable [`src/components/stage/blocks/StageEntryBlock.tsx`](/e:/ModeloProceso/ModeloProceso_Repo/src/components/stage/blocks/StageEntryBlock.tsx)
- componente reusable [`src/components/stage/blocks/StageHeaderBlock.tsx`](/e:/ModeloProceso/ModeloProceso_Repo/src/components/stage/blocks/StageHeaderBlock.tsx)
- reorganizacion completa de [`src/content/stages/stage-1.content.ts`](/e:/ModeloProceso/ModeloProceso_Repo/src/content/stages/stage-1.content.ts)
- implementacion real del bloque explicativo del modelo antes del rail
- implementacion real del rail de etapas con 6 paneles resumidos y Etapa 1 marcada como actual
- implementacion real del bloque de estados del docente antes del consentimiento
- refactor del bloque de consentimiento para reforzar confidencialidad, proposito formativo y gating del flujo
- implementacion del chatbot contextual como ayuda opcional previa al embebido
- refactor del autodiagnostico embebido para integrarlo al stage y ampliar su marco visual
- implementacion del cierre de Etapa 1 con video obligatorio, cambio de fondo y llegada provisional a Etapa 2

### Como quedo organizado

El esqueleto sigue este orden logico:

1. entrada
2. progresion
3. Laia
4. scroll
5. botones
6. explicacion del modelo
7. rail
8. estados
9. consentimiento
10. chatbot
11. embebido
12. salida
13. video final
14. transicion a Etapa 2

### Criterio de implementacion

- el scroll vertical sigue siendo el mecanismo principal
- cada bloque tiene su propio slot en `content/`
- `StageShell` sigue resolviendo el viewer persistente sin meter logica de flujo dentro del contenido
- los `scaffold-panel` que siguen existiendo solo se usan en slots de apoyo donde todavia conviene mantener una representacion ligera
- la etapa sigue siendo independiente de las demas aunque ya reserve el espacio de la transicion

### Que sigue pendiente

- navegacion final hacia etapas futuras cuando su contenido este publicado
- integracion del chatbot real con backend o motor conversacional
- audio contextual de Laia y afinacion multimedia fina

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
- chatbot contextual opcional dentro de Etapa 1, por ahora con respuestas hardcodeadas
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
