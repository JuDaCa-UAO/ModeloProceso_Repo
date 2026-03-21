# AGENTS.md — Guía operativa para Codex
## Proyecto: Cartilla Web GenAI UAO — Etapa 1

> Este documento es la **fuente de verdad operativa** para cualquier agente de Codex que modifique este repositorio.
> El objetivo inmediato es **llevar a producción una Etapa 1 sólida, fiel al storyboard y alineada con la arquitectura actual**.
> No improvisar UX, no inventar flujos, no saltarse la documentación.

---

## 1. Misión

Refactorizar y alinear el proyecto existente para que la **Etapa 1** represente fielmente la visión de diseño ya definida, aprovechando la arquitectura escalable actual y sin introducir deuda técnica innecesaria.

La misión **no** es rehacer el proyecto sin criterio ni “ponerlo bonito”.
La misión es:

1. **Ajustar el código existente** para que siga el flujo de diseño aprobado.
2. **Preservar y mejorar** la Clean Architecture ya implementada.
3. **Mantener componentes reutilizables** para futuras etapas.
4. **Garantizar la independencia de cada stage**.
5. **Documentar en README.md** cualquier cambio estructural, de flujo o de responsabilidades.

---

## 2. Hechos del proyecto que NO deben ser ignorados

### 2.1. Estado actual del repo
El proyecto ya tiene una base importante:

- Next.js 16 App Router
- React 19
- TypeScript
- Clean Architecture adaptada a Next.js
- Ruta dinámica por etapa: `src/app/etapa/[stageId]/`
- Motor genérico de renderizado de etapas
- Separación entre:
  - `domain`
  - `application`
  - `infrastructure`
  - `presentation`
- Contenido stage-driven en `src/content/stages/`
- Viewer 3D y assets ya existentes
- Laia ya existe como personaje visual/narrativo
- Embebido del autodiagnóstico ya existe
- Consentimiento ya existe
- Transición a Etapa 2 ya existe
- Algunas piezas funcionan, pero el flujo completo todavía no está bien orquestado

### 2.2. El problema actual NO es de arquitectura base
La base arquitectónica ya permite conectarse a distintos backends y ya tiene una estructura escalable.
El problema principal es de **orquestación de experiencia, mapping del storyboard a UI y consistencia del flujo**.

### 2.3. Fase actual de multimedia
Para esta fase inicial:
- **los contenidos multimedia pueden quedar hardcodeados**,
- incluyendo rutas a:
  - videos
  - imágenes
  - modelos 3D
  - fondos
- siempre que estén centralizados de forma ordenada y documentados.

No intentar “generalizar de más” el multimedia todavía.
Sí dejar preparado el sistema para escalar después.

---

## 3. Regla de oro del desarrollo

### 3.1. El proyecto debe seguir el flujo aprobado
La Etapa 1 debe seguir **al pie de la letra** el flujo de diseño ya definido.
No cambiar el orden narrativo ni los hitos funcionales sin justificación explícita.

### 3.2. Toda mejora estructural debe quedar documentada
Si se cambia:
- estructura de carpetas,
- contratos de componentes,
- sistema de scroll,
- sistema de progreso,
- contenido del stage,
- navegación global,
- manejo de assets,
- responsabilidades entre capas,

entonces también se debe **actualizar README.md**.

README no es decorativo.
README debe quedar como espejo del proyecto real.

---

## 4. Flujo aprobado de Etapa 1 (fuente de verdad)

La Etapa 1 debe implementarse con esta secuencia funcional:

1. **Pantalla inicial / lobby**
   - bienvenida
   - Laia introduce el recorrido
   - CTA para iniciar
   - posibilidad de “continuar” si existe progreso previo

2. **Presentación amplia del modelo 3D**
   - animación/video que muestra en qué parte de la espiral está el docente
   - scroll bloqueado durante este momento si aplica

3. **Desbloqueo de navegación global**
   - al terminar esa presentación inicial, se habilita un botón en la pantalla principal que permite ir a cualquier etapa

4. **Persistencia del viewer 3D**
   - luego de la presentación amplia, el viewer pasa a un modo reducido y fijo arriba a la derecha
   - el viewer solo indica etapa actual
   - la etapa actual debe titilar o señalarse claramente

5. **Título visible del stage**
   - cada etapa debe tener título claro y persistente en su entrada
   - para Etapa 1: `Reconócete para avanzar`

6. **Explicación de dónde está el usuario dentro del modelo**
   - antes del rail
   - el usuario primero entiende su posición, luego ve el resumen de etapas

7. **Rail de etapas**
   - aparece después de la explicación de ubicación
   - resume las 6 etapas del modelo
   - debe ser digerible y no abrumar

8. **Explicación de los estados del docente**
   - Aprendiendo sin miedo
   - Explorando con propósito
   - Innovando e inspirando
   - deben explicarse con claridad, incluyendo que no son juicios, sino apoyos para modular acompañamiento

9. **Consentimiento**
   - bloque claro, tranquilo y funcional
   - requisito obligatorio antes del embebido

10. **Chatbot**
   - aparece como apoyo contextual
   - no bloquea el flujo principal

11. **Autodiagnóstico embebido**
   - núcleo operativo de Etapa 1
   - Laia se minimiza durante esta interacción

12. **Cierre de etapa**
   - retorno al marco principal
   - Etapa 1 se marca como completada

13. **Video/animación de cierre**
   - debe reproducirse antes de permitir pasar a Etapa 2

14. **Transición a Etapa 2**
   - cambio de fondo/ambiente
   - CTA final habilitado solo después del cierre

---

## 5. Principios de implementación que deben respetarse

### 5.1. Reutilización sin perder independencia
Todos los sistemas y componentes deben diseñarse para poder reutilizarse en otros stages, pero:

- cada stage debe tener:
  - fondo propio
  - título propio
  - contenido propio
  - agentes/embebidos propios
  - secuencia propia

No hardcodear Etapa 1 dentro de componentes genéricos si esa lógica debería vivir en `content/` o config.

### 5.2. El scroll es vertical y es central
No reemplazar el scroll vertical por navegación tipo wizard o tabs.
El scroll es la base del recorrido.

Además:
- debe existir retroalimentación clara que indique cuándo el usuario puede seguir scrolleando
- el contenido debe revelarse de forma acumulativa
- lo ya mostrado no debe desaparecer abruptamente

### 5.3. El viewer 3D no es navegación interna
El viewer 3D:
- muestra etapa actual
- permanece visible
- da orientación

Pero **no** guarda progreso interno ni sustituye el sistema de continuidad.

### 5.4. Laia es obligatoria
Laia no se puede eliminar ni reemplazar.
Cumple tres papeles:
- narradora
- guía de interfaz
- rostro de agentes/ayudas

Además:
- debe poder hablar por texto
- debe poder reproducir audio
- debe callar durante el autodiagnóstico si no se necesita intervención

### 5.5. Multimedia hardcodeado, pero ordenado
Para esta fase:
- rutas a videos, fondos, imágenes y modelos 3D pueden ser hardcodeadas,
- pero deben estar centralizadas,
- con nombres claros,
- y documentadas en README.

---

## 6. Sistemas que el agente debe reconocer y respetar

Codex debe tratar explícitamente estos sistemas como sistemas reales del proyecto:

1. **Sistema de ambientación por stage**
2. **Sistema de orquestación de etapa**
3. **Sistema de reveal progresivo acumulativo**
4. **Sistema de scroll y bloqueo temporal**
5. **Sistema de presentación / persistencia del viewer 3D**
6. **Sistema de diálogos de Laia**
7. **Sistema de audio de Laia**
8. **Sistema de consentimiento y habilitación**
9. **Sistema de embebido externo**
10. **Sistema de transición de etapa**
11. **Sistema de chatbot contextual**
12. **Sistema de continuidad / reanudación del recorrido**

No mezclar estas responsabilidades sin necesidad.

---

## 7. Qué debe hacer Codex sobre el código actual

### 7.1. Primero: leer y entender
Antes de modificar nada, Codex debe revisar como mínimo:

- `README.md`
- `src/app/etapa/[stageId]/StageClient.tsx`
- `src/content/stages/stage-1.content.ts`
- `src/components/stage/`
- `src/hooks/ui/`
- `src/lib/progress.ts`
- `src/lib/useProgress.ts`
- viewer 3D actual
- assets en `public/`

### 7.2. Luego: evaluar divergencias
Codex debe comparar el flujo real del proyecto con el flujo aprobado y detectar:

- partes correctas que deben conservarse
- partes rotas que deben refactorizarse
- partes que deben simplificarse
- partes que hoy están bien abstraídas
- partes que aún están muy acopladas a Etapa 1

### 7.3. Después: refactorizar con intención
Codex debe hacer cambios sobre el proyecto existente, no ignorarlo.

El orden recomendado de intervención es:

1. **sistema de continuidad global**
2. **presentación amplia del modelo 3D + desbloqueo de navegación global**
3. **viewer 3D persistente**
4. **orquestación correcta del flujo de Etapa 1**
5. **rail de etapas en el lugar correcto**
6. **sistema de estados**
7. **scroll y reveal acumulativo**
8. **integración limpia del consentimiento, chatbot y embebido**
9. **video de cierre y transición**

---

## 8. Reglas concretas para la Etapa 1

### 8.1. Orden obligatorio
No reordenar arbitrariamente:
- el rail no va antes de explicar la ubicación en el modelo
- el embebido no va antes del consentimiento
- el video de cierre no va después del CTA a Etapa 2
- el viewer fijo no aparece antes de la animación amplia

### 8.2. La navegación global a etapas
Debe existir un botón desbloqueado tras la presentación amplia del modelo.

Ese botón:
- permite ir a cualquier etapa
- no reemplaza el botón “continuar”
- debe convivir con la reanudación del punto previo

### 8.3. El sistema “Continuar”
Debe llevar al usuario exactamente al último punto donde iba.
No solo a la última etapa.
Debe recordar:
- stage
- bloque o hito
- estado mínimo de avance necesario

### 8.4. Título por stage
Cada stage debe exponer un título claro.
No ocultar ni asumir títulos.
Debe ser una pieza estructural del flujo.

### 8.5. Fondo por stage
Cada stage tiene fondo propio.
La transición entre etapas debe reflejarse también en el cambio de fondo.

---

## 9. Cómo debe tratarse `stage-1.content.ts`

`src/content/stages/stage-1.content.ts` ya es una buena base.
Codex debe usarla como punto de partida, pero puede modificarla si es necesario para que el flujo aprobado quede bien implementado.

Sin embargo, debe respetarse esta regla:

- el contenido puro vive en `content/`
- la lógica de negocio no debe meterse ahí
- la UI no debe hardcodear textos que deberían vivir en el contenido

Si se cambia la estructura del árbol de contenido:
- actualizar README
- documentar nuevas convenciones

---

## 10. README.md — obligación de actualización

Si el agente cambia algo importante, debe actualizar README en estas secciones si aplica:

- Qué hace la app
- Arquitectura
- Estructura de carpetas
- Flujo de comunicación entre capas
- Cómo agregar una nueva etapa
- Cómo agregar un nuevo bloque de contenido
- Chatbot Laia
- Decisiones de arquitectura

Además, debe agregarse o actualizarse una sección sobre:

### “Flujo de Etapa 1”
Debe quedar documentado:
- orden de bloques
- rol del viewer 3D
- desbloqueo de navegación global
- diferencia entre “ir a etapas” y “continuar”
- papel de Laia
- uso de multimedia hardcodeado en la fase actual

---

## 11. Qué NO debe hacer Codex

- No borrar Clean Architecture para “simplificar”
- No reintroducir lógica de negocio en componentes visuales
- No meter URLs dispersas por presentation si deberían estar centralizadas
- No mezclar el viewer con el sistema de continuidad
- No hacer de Laia solo un adorno visual
- No rehacer el proyecto desde cero si puede corregirse a partir de la base existente
- No dejar cambios estructurales sin documentar en README
- No romper la independencia entre etapas
- No asumir que el multimedia debe volverse dinámico todavía

---

## 12. Entregable esperado del refactor

Al terminar, el proyecto debe quedar con:

1. Etapa 1 alineada con el flujo aprobado
2. scroll funcional y no frágil
3. viewer 3D con doble comportamiento:
   - presentación amplia
   - persistencia fija
4. desbloqueo correcto del botón global de etapas
5. sistema real de “continuar donde iba”
6. Laia integrada con texto + audio
7. rail de etapas en el orden correcto
8. consentimiento funcional
9. chatbot opcional bien encuadrado
10. embebido limpio dentro del flujo
11. video final antes de transición
12. README actualizado

---

## 13. Criterio final de aceptación

El trabajo está bien hecho solo si:

- el flujo aprobado puede reconocerse claramente en la app
- la arquitectura sigue siendo limpia
- los componentes siguen siendo reutilizables
- cada stage sigue pudiendo ser independiente
- el usuario puede navegar a cualquier etapa
- el usuario puede continuar exactamente donde iba
- y el README explica fielmente el estado real del proyecto

# 13.1 Explicación

Cada cambio que realices debe ser explicado y justificado 
