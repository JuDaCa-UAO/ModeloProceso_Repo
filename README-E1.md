# README — Etapa 1: Registro de cambios

## Cambio 1: Eliminación de sistemas de scroll + Creación de componente Frame

### Fecha: 2026-03-24

---

### Resumen

Se eliminaron todos los sistemas de scroll custom (gating, progressive reveal, scroll pin, section scroll context) para que la página funcione como scroll vertical normal del navegador. Se creó un nuevo componente `Frame` que sirve como contenedor de pantalla completa con fondo personalizable.

---

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/etapa/[stageId]/StageClient.tsx` | Removidas todas las dependencias de scroll: `useProgressiveReveal`, `useSectionScrollGate`, `SectionScrollProvider`, `SectionContinueDock`, `SectionScrollProgress`, `getContinueRequires`, `sectionNeedsContinueButton`. El componente ahora renderiza las secciones directamente sin gating ni progressive reveal. |
| `src/components/stage/StageSection.tsx` | Removida dependencia de `useSectionScroll` (SectionScrollContext). Ya no requiere props `active`, `revealed`, `activeIndex`, `registerRef`. Siempre renderiza el body completo sin condiciones de scroll. |
| `src/components/stage/StageShell.tsx` | Removida prop `scrollProgress` y todo el renderizado del indicador de progreso de scroll en el viewer dock y en el main. |
| `src/components/stage/HorizontalScrollRail.tsx` | Removida dependencia de `useScrollPin`. El rail ahora usa overflow-x nativo en lugar de mapear posición de scroll vertical a desplazamiento horizontal via transform. |
| `src/components/stage/stage.module.css` | Removidos estilos de: sección muted/revealed/active (opacity, transforms, stagger delays), scroll progress indicator, continue dock, rail pin area (sticky + multi-viewport height), viewerRecorrido scroll progress. El rail ya no usa `position: sticky` ni `min-height: calc(100dvh * var())`. |

### Archivos nuevos

| Archivo | Propósito |
|---|---|
| `src/components/stage/Frame.tsx` | Componente de frame a pantalla completa (`100dvh`). Soporta: fondo personalizable (color/gradiente/imagen), overlay, tag/etiqueta, alineación vertical, y renderizado de cualquier children. |
| `src/components/stage/Frame.module.css` | Estilos del componente Frame. |

### Archivos que quedaron sin usar (candidatos a limpieza)

Estos archivos ya no son importados por ningún componente. Se conservan por ahora para no hacer una limpieza masiva en un solo cambio:

- `src/contexts/SectionScrollContext.tsx` — contexto de scroll entre secciones
- `src/hooks/ui/useScrollPin.ts` — hook de pin de scroll
- `src/hooks/ui/useProgressiveReveal.ts` — hook de revelación progresiva
- `src/hooks/ui/useSectionScrollGate.ts` — hook de bloqueo de scroll
- `src/lib/sectionScrollFlow.ts` — lógica de continue button
- `src/lib/scroll/pin.ts` — utilidades de cálculo de pin
- `src/components/stage/SectionScrollChrome.tsx` — progress indicator + continue dock
- `src/components/stage/ProgressiveSection.tsx` — sección con progressive reveal genérica

---

### Cómo usar el componente Frame

```tsx
import Frame from "@/components/stage/Frame";

// Frame con gradiente de fondo
<Frame background="linear-gradient(180deg, #0a0506, #050304)">
  <h1>Bienvenido</h1>
</Frame>

// Frame con imagen de fondo y overlay
<Frame 
  backgroundImage="/images/bg-stage1.jpg"
  overlay="rgba(0, 0, 0, 0.6)"
  tag="Etapa 1"
  align="center"
>
  <h2>Reconócete para avanzar</h2>
</Frame>

// Frame con color sólido
<Frame background="#1a0a0c" id="seccion-intro">
  <MyComponent />
</Frame>
```

### Props del Frame

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — | Contenido del frame |
| `background` | `string` | — | CSS background (color, gradiente) |
| `backgroundImage` | `string` | — | URL de imagen de fondo |
| `backgroundAlt` | `string` | `""` | Alt text de la imagen |
| `overlay` | `string` | — | Color/gradiente de overlay |
| `tag` | `string` | — | Etiqueta arriba del contenido |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alineación vertical |
| `id` | `string` | — | ID para navegación por ancla |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

---

### Qué NO se tocó

- Contenido de `stage-1.content.ts` — intacto
- Domain layer (entities, rules, value-objects) — intacto
- Application layer (usecases) — intacto
- Infrastructure (persistence, n8n) — intacto
- Bloques individuales (AnimationBlock, ConsentFormBlock, etc.) — intacto
- Hooks de dominio (`useStageProgress`) — intacto
- Páginas de inicio, modelo, opciones — intacto
