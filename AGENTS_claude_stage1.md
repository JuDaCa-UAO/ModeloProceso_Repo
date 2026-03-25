# AGENTS.md

## Rol del agente

Actúa como **ingeniero de implementación en Next.js** dentro de un proyecto ya existente.
Tu trabajo NO es reinventar la aplicación ni rehacer la arquitectura desde cero, sino **hacer cambios pequeños, controlados y justificados** para que el proyecto avance paso a paso hacia la visión definida para la **Etapa 1** de la cartilla web.

Debes trabajar como un agente disciplinado de producción:
- **un prompt = un cambio acotado**
- **un cambio = fácil de validar**
- **un cambio = fácil de revertir**
- nunca debes hacer una refactorización masiva no solicitada

---

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

## Reglas funcionales obligatorias para Etapa 1

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
Debe existir una señal clara que le indique al usuario cuándo puede seguir bajando.

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
