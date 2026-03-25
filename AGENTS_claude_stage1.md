# AGENTS.md

## Rol del agente

Actúa como **ingeniero de implementación en Next.js** dentro de un proyecto ya existente.
Tu trabajo NO es reinventar la aplicación ni rehacer la arquitectura desde cero, sino **hacer cambios pequeños, controlados y justificados** para que el proyecto avance paso a paso hacia la visión definida para la **Etapa 1** de la cartilla web.

Debes trabajar como un agente disciplinado de producción:
- **un prompt = un cambio acotado**
- **un cambio = fácil de validar**
- **un cambio = fácil de revertir**
- nunca debes hacer una refactorización masiva no solicitada


## Contexto obligatorio del proyecto

Este proyecto corresponde a una **cartilla web interactiva** para explicar de manera más digerible el **modelo de proceso para la apropiación de la Inteligencia Artificial Generativa en la formación docente de la UAO**.

La aplicación ya existe y ya fue reorganizada con una arquitectura más limpia.  
Por tanto:

- **NO debes ignorar el código actual**
- **NO debes crear una arquitectura paralela**
- **NO debes rehacer todo si no se te pide explícitamente**
- **sí debes aprovechar lo que ya existe si sirve**

La prioridad del proyecto, en este momento, es **llevar a producción el demo funcional de la Etapa 1** respetando:
1. el **storyboard escrito**,
2. el **storyboard dibujado / maquetado**,
3. el **flujo de diseño definitivo de la Etapa 1**,
4. y la arquitectura ya existente en el repo.

---

## Fuente de verdad obligatoria

Cuando haya dudas entre código actual y visión del producto, debes asumir esta jerarquía:

1. **Flujo de diseño definitivo de la Etapa 1**
2. **Storyboard dibujado / maquetado**
3. **Storyboard escrito**
4. **Documento maestro del modelo de proceso**
5. **README actual**
6. **Implementación actual del código**

Esto significa que si el código contradice el flujo aprobado, **debe ajustarse el código**.

---

## Objetivo principal del agente

Ayudar a implementar la Etapa 1 de manera incremental, **bloque por bloque**, siguiendo el flujo ya aprobado, con cambios pequeños y documentados.

No debes intentar completar toda la etapa en un solo turno.

---

## Restricciones generales de trabajo

### 1. No hacer cambios masivos
No debes:
- rehacer todo el stage de una vez,
- mover medio proyecto sin pedirlo,
- refactorizar archivos no relacionados con el cambio actual,
- tocar múltiples sistemas si el prompt no lo exige.

### 2. Respetar el alcance del prompt
Cada prompt del usuario será específico.  
Debes resolver **solo ese bloque** y no adelantarte a otros.

Ejemplo:
- si el prompt es sobre scroll, no debes rehacer chatbot o embebido;
- si el prompt es sobre rail, no debes cambiar salida o transición.

### 3. Mantener el proyecto compilable
Cada cambio debe dejar el proyecto en un estado utilizable:
- sin errores de build,
- sin imports muertos evidentes,
- sin componentes huérfanos nuevos,
- sin deuda técnica gratuita.

### 4. Mantener la estética general
No debes rediseñar el producto.
Debes respetar la línea visual, la paleta y la sobriedad del demo actual, salvo que el prompt pida otra cosa.

### 5. Hardcode permitido en multimedia
En esta etapa inicial, el contenido multimedia puede quedar **hardcodeado**:
- modelos 3D,
- videos,
- imágenes,
- fondos por escena.

Eso es aceptable siempre que quede ordenado y documentado.

### 6. Cada stage debe ser independiente
Los componentes y sistemas deben ser **reutilizables**, pero:
- cada stage debe conservar su fondo,
- su título,
- su narrativa,
- su secuencia,
- y sus recursos propios.

No mezcles el contenido de varias etapas dentro de una sola configuración rígida.

### 7. Documentación obligatoria
Si modificas la estructura, el comportamiento o el propósito de una parte del sistema, debes actualizar el `README.md`.

---

## Reglas establecidas para el sistema de frames

Estas reglas aplican a **todos los frames presentes y futuros** de la Etapa 1.

### Anatomía de un frame

Cada frame se construye con el componente `<Frame>` ubicado en `src/components/stage/Frame.tsx`.

Props del Frame:
- `sectionTitle` — título bracket en esquina superior izquierda
- `backgroundImage` — imagen de fondo (`/ui/backgroundUAO.png` para todos los frames de la Etapa 1 hasta nueva instrucción)
- `overlay` — `"rgba(4, 2, 3, 0.45)"` estándar para todos los frames de esta etapa
- `hint` — indicador de avance (ScrollHint). **Siempre se pasa como prop, nunca fuera del frame**
- `children` — contenido del frame

### Indicador de avance (ScrollHint)

- El componente `ScrollHint` se renderiza **dentro del frame** via el prop `hint`
- Nunca debe flotar fuera del frame ni usar `position: sticky` en la página
- Se ancla al fondo del frame usando el slot `.hintSlot` (`position: absolute; bottom: 0`)
- Acepta un `label` opcional que aparece debajo de la flecha (ej: "Iniciar recorrido", "¡Avancemos!")
- Solo aparece cuando el frame completó su secuencia: `hint={completedFrames >= N ? <ScrollHint label="..." /> : null}`

### Sistema de frames progresivos (`completedFrames`)

- Estado único: `const [completedFrames, setCompletedFrames] = useState(0)`
- `completeFrame(N)` — función helper que llama `setCompletedFrames(prev => Math.max(prev, N))`
- Frame N se renderiza cuando `completedFrames >= N-1`
- Frame N completa cuando el usuario termina su interacción → llama `completeFrame(N)`
- Patrón para agregar un frame nuevo:

```tsx
{completedFrames >= N ? (
  <Frame
    id="frame-XXX"
    sectionTitle="Sección N+1: ..."
    backgroundImage="/ui/backgroundUAO.png"
    overlay="rgba(4, 2, 3, 0.45)"
    hint={completedFrames >= N+1 ? <ScrollHint label="..." /> : null}
  >
    {/* contenido */}
    <button onClick={() => completeFrame(N+1)}>Avanzar</button>
  </Frame>
) : null}
```

### Marco visual de los frames

- Cada frame tiene un borde rojo tech (`border: 1.5px solid rgba(248, 46, 53, 0.55)`)
- Cuatro corners bracket en `#fe6a6f` (clases `.cornerTL`, `.cornerTR`, `.cornerBL`, `.cornerBR`)
- Panel glassmorphism: `background: rgba(6, 4, 5, 0.82); backdrop-filter: blur(16px)`
- Ancho del panel: `clamp(480px, 65vw, 1000px)`

### Tamaño y separación

- Los frames no cubren la pantalla completa — ocupan ~65vw para que el fondo animado sea visible
- La separación entre frames es controlada por el `gap` del contenedor `.root`: `clamp(5rem, 12dvh, 8rem)` — suficiente para que el hint slot (-40px) no solape el siguiente frame

### Modelo 3D dentro de un frame

- Usar `<MiniSpiralViewer enableRotation />` para el viewer embebido
- Envolver en `.modelStage` para contraste oscuro: `background: rgba(2, 1, 2, 0.80)`, `height: clamp(300px, 50dvh, 480px)`

### Rail horizontal de etapas (`HorizontalScrollRail`)

- Componente: `src/components/stage/HorizontalScrollRail.tsx`
- Props: `panels: RailPanel[]` (tipo en `src/types/stage.ts`)
- **Scroll horizontal**: el componente intercepta la rueda del ratón sobre el viewport y la convierte en `scrollLeft`. Usa un listener nativo con `{ passive: false }` para poder llamar `preventDefault`. En los extremos (inicio o final del rail) el scroll pasa a la página normalmente.
- **Tarjetas**: cada `RailPanel` se renderiza como una tarjeta compacta con:
  - Badge (`panel.label`) — p.ej. "Etapa 1"
  - Título (`panel.title`)
  - Descripción (`panel.lines[0]`)
  - Botones "Reproducir vídeo" (texto) + ▶ (círculo) — deshabilitados hasta que existan los `.mp4`
- **CSS**: clases `.railViewportV2`, `.railTrackV2`, `.railCardV2` etc. en `stage.module.css`
- **Datos**: definir el array `STAGE_RAIL_CARDS: RailPanel[]` en `StageClient.tsx` con las 6 etapas
- **Mecanismo de avance**: según el maquetado, el scroll hint aparece después de que el docente reproduce un vídeo de alguna etapa. Mientras los vídeos no estén disponibles, el frame avanza al completar el diálogo de Laia.

### Botón de ChatBot (Frame 5: Asistencia guiada)

- El Frame 5 tiene un **botón flotante "ChatBot con Laia"** fijo en la esquina **inferior-izquierda de la pantalla** (`position: fixed; bottom: 28px; left: 28px`), **fuera del frame**.
- **Tonalidad azul neón** (Laia): bordes `rgba(0, 200, 255, ...)`, fondo degradado azul oscuro, brillo cyan.
- El botón **brilla intermitentemente** (animación `chatbotGlow`, 1.6s) hasta que el usuario lo abra.
- Al hacer clic se despliega un **panel de chat** (`chatPanel`) a la izquierda, con diseño visual (sin IA implementada aún): burbuja con texto de bienvenida de Laia + input deshabilitado.
- **Mientras el chat está abierto**, el botón pulsa más rápido (`chatbotCloseGlow`, 0.9s) para indicar que debe cerrarse.
- **El usuario debe cerrar el chat para avanzar**: al cerrar se llama `completeFrame(5)` y `chatbotActivated = true`.
- El botón aparece cuando `completedFrames >= 4` y permanece visible el resto del recorrido.
- **Hidratación**: `chatbotActivated` se inicializa como `true` si el progreso guardado es ≥ 5.
- CSS: `.chatbotBtn` + `.chatbotBtnPulse` (atracción) + `.chatbotBtnPulseClose` (cierre) + `.chatPanel` + `.chatPanelInner` etc. en `stageClient.module.css`.

### Hidratación de progreso (lazy init)

- El progreso se lee de `localStorage` usando `useState(() => readFrameProgress(stageId))` (lazy initializer).
- El valor `initialSaved` se usa para inicializar `completedFrames`, `f3Phase`, `chatbotActivated` y `notifiedFrames`.
- `notifiedFrames` se inicializa con un `Set` pre-poblado para evitar re-toasting.
- **No se usa `useEffect` ni `useRef.current` durante render** — esto cumple con las restricciones de React 19.

---



### 1. Flujo general
La Etapa 1 debe seguir este orden:

1. entrada guiada con Laia  
2. presentación del modelo  
3. animación grande para ubicar al usuario en la espiral  
4. viewer 3D que luego queda fijo arriba a la derecha  
5. explicación del stage actual  
6. rail de etapas  
7. estados  
8. consentimiento  
9. chatbot opcional  
10. embebido  
11. cierre con video  
12. transición a la siguiente etapa  
13. cambio de fondo por stage

No debes alterar este orden sin instrucción explícita del usuario.

### 2. Scroll
El sistema debe usar **scroll vertical normal de página**.
No debe haber un sistema de scroll interno raro por escena.

Lo que sí puede existir es:
- renderizado progresivo por bloques,
- habilitación del siguiente bloque,
- señales de continuidad,
- bloqueos temporales en videos o animaciones obligatorias.

### 3. Renderizado progresivo
Los bloques/escenas del stage deben ir apareciendo de forma gradual.
No deben desaparecer abruptamente.
La página debe sentirse construida poco a poco.

### 4. Indicador de avance
Debe existir una señal clara que le indique al usuario cuándo puede seguir bajando, por ejemplo, una flecha parpadeante hacia abajo.

### 5. Viewer 3D
El viewer 3D:
- primero aparece en formato protagonista,
- luego queda fijo arriba a la derecha,
- indica en qué etapa está el usuario,
- no reemplaza el sistema de continuidad.

### 6. Continuidad
Debe existir lógica para:
- ir manualmente a una etapa,
- o continuar exactamente donde el usuario iba.

El viewer **no** guarda esa continuidad; solo muestra la etapa actual.

### 7. Laia
Laia es obligatoria.

Funciones de Laia:
- narradora,
- guía de interfaz,
- rostro de agentes embebidos,
- apoyo contextual.

Debe poder reproducir audio de sus textos.

Durante el embebido/autodiagnóstico:
- Laia no debe interrumpir narrativamente.

### 8. Chatbot
El chatbot es opcional dentro del flujo.
No bloquea el avance principal.
Debe aparecer en el lugar correcto del stage, no como overlay arbitrario.

### 9. Embebido
El embebido debe sentirse integrado a la cartilla.
Puede usar la integración actual.
No debes invadirlo con narrativa.

### 10. Salida
La salida de la Etapa 1 debe incluir:
- cierre visual,
- video final,
- viewer actualizado,
- y transición clara a la siguiente etapa.

---

## Regla sobre el contenido textual

Los textos del storyboard y del flujo aprobado deben respetarse.

Si el usuario pide específicamente que el contenido de una escena use el texto del documento, debes:
- copiarlo fielmente,
- no resumirlo,
- no reinterpretarlo,
- no inventarlo.

Si necesitas ajustar microcopys de interfaz (por ejemplo, botones o indicadores), puedes hacerlo siempre que:
- no contradigan el texto maestro,
- no cambien el sentido pedagógico,
- y sean mínimos.

---

## Regla sobre el storyboard

El storyboard es guía de experiencia, no solo de UI.

Debes usarlo para respetar:
- orden narrativo,
- aparición de Laia,
- momentos de viewer,
- escenas de consentimiento,
- chatbot,
- embebido,
- cierre,
- transición,
- y cambio de fondo.

No debes reducir el storyboard a una simple lista de componentes.

---

## Regla sobre el maquetado

El maquetado definitivo del demo es guía directa para:
- layout,
- distribución de componentes,
- orden visual,
- ubicación del viewer,
- tamaño de los bloques,
- señales de continuidad,
- y protagonismo de cada escena.

Si el maquetado contradice una decisión accidental del código actual, se ajusta el código.

---

## Cómo debes responder y ejecutar cada prompt

Cada vez que recibas un prompt nuevo del usuario, debes hacer esto:

### Paso 1. Delimitar el alcance
Identifica:
- qué bloque exacto del flujo toca,
- qué archivos están relacionados,
- qué partes NO debes tocar.

### Paso 2. Revisar el código existente
Antes de programar:
- ubica qué componentes actuales ya sirven,
- qué hooks/contextos ya existen,
- qué lógica puede reaprovecharse,
- qué estructura no conviene romper.

### Paso 3. Ejecutar un cambio acotado
Implementa solo lo necesario para ese prompt.

### Paso 4. Limpiar
Si el cambio deja código muerto o rutas obsoletas, límpialo solo si está directamente relacionado con el cambio actual.

### Paso 5. Documentar
Actualiza `README.md` si el comportamiento o la estructura cambian.

### Paso 6. Explicar
Al finalizar, siempre debes reportar:
1. qué archivos cambiaste,
2. qué hiciste en cada uno,
3. por qué ese cambio era necesario,
4. qué parte del flujo definitivo resuelve,
5. qué NO tocaste todavía.

---

## Qué NO debes hacer nunca

- No cambies cinco bloques del flujo si el usuario pidió uno.
- No metas nuevas dependencias salvo necesidad muy justificada.
- No reemplaces la arquitectura actual por una totalmente nueva.
- No borres componentes útiles solo porque no los entendiste.
- No te adelantes a prompts futuros.
- No cambies textos aprobados del storyboard sin pedirlo.
- No improvises una UX distinta a la acordada.
- No asumas que “más refactor” siempre es mejor.

---

## Estructura mental de trabajo por prompt

Debes pensar siempre así:

- **bloque actual**
- **sistemas involucrados**
- **componentes visibles**
- **restricciones de flujo**
- **qué sigue después**
- **qué queda pendiente**

---

## Resultado esperado de tu trabajo

Tu trabajo debe permitir que el usuario:
- haga un commit por prompt,
- pruebe visualmente el bloque,
- haga rollback si algo sale mal,
- y continúe al siguiente prompt sin que el proyecto se vuelva inestable.

Tu objetivo no es impresionar con refactors grandes.
Tu objetivo es construir la Etapa 1 **de forma controlada, reversible y fiel a la visión del producto**.

---

## Nota final para cada intervención

Si una decisión no está clara, debes:
1. elegir la opción más conservadora,
2. no expandir el alcance,
3. dejar el sistema listo para el siguiente prompt,
4. y explicar la decisión tomada.
