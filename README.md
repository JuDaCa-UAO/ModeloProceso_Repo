# Cartilla Web GenAI · UAO

Aplicación educativa de una sola página para recorrer el modelo de proceso de
alfabetización digital docente en el uso y apropiación de GenAI.

## Stack

- Next.js 16 con App Router
- React 19 y TypeScript estricto
- React Three Fiber / Three.js para la espiral interactiva
- GSAP para revelado y desplazamiento
- CSS Modules y tokens institucionales
- Playwright para pruebas end-to-end
- pnpm como único gestor de paquetes

## Arquitectura

El proyecto implementa Clean Architecture en un monolito modular:

```text
app ───────────────► presentation
 │
 └──► infrastructure ──► application ──► domain
             └──────────────────────────► domain

presentation ─────────► application
presentation ─ ─ tipos ─ ─ ─ ─ ─ ─ ─ ► domain
```

- `domain`: entidades, value objects y contratos puros; no conoce React, Next
  ni variables de entorno.
- `application`: casos de uso y puertos; solo depende de `domain`.
- `infrastructure`: repositorios estáticos, manifiesto y adaptadores
  multimedia, configuración e integración N8N.
- `presentation`: componentes React, providers y hooks de interfaz.
- `app`: composition root de Next.js; conecta casos de uso, resolvers y UI.

Las decisiones, alternativas y consecuencias están registradas en
[ADR-0001](docs/adr/0001-clean-architecture-y-convencion-multimedia.md).

## Estructura

```text
src/
├── app/
├── application/
│   ├── content/
│   └── media/
├── domain/
│   ├── content/
│   └── media/
├── infrastructure/
│   ├── config/
│   ├── content/
│   │   └── data/
│   ├── media/
│   │   ├── manifest/
│   │   └── providers/
│   └── n8n/
├── presentation/
│   ├── content/
│   ├── hooks/
│   ├── laia/
│   ├── providers/
│   ├── reflection/
│   ├── sections/
│   ├── shell/
│   ├── spiral/
│   ├── stage/
│   └── video/
└── styles/
```

No deben crearse raíces paralelas como `src/components`, `src/content`,
`src/context` o `src/lib`. La auditoría automática marca esas carpetas como
inconsistentes.

## Convención multimedia

Todos los recursos de producto viven bajo `public/media`. Se usan nombres en
minúsculas, kebab-case y sin espacios.

```text
public/media/
├── compartido/
│   ├── imagenes/
│   └── modelos/
├── introduccion/
│   └── videos/
└── etapa-N/
    ├── imagenes/
    ├── videos/
    └── descargables/
```

Una categoría se crea solo cuando contiene archivos. Las rutas de imágenes,
videos y descargables de contenido se registran una única vez en
`src/infrastructure/media/manifest/media-manifest.ts`; los componentes reciben
medios resueltos y no conocen proveedores concretos.

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:3000`.

El host multimedia remoto es opcional:

```bash
copy .env.local.example .env.local
```

`NEXT_PUBLIC_MEDIA_BASE_URL` solo se necesita para entradas del manifiesto con
`provider: "http"`. La URL activa de N8N se centraliza en
`src/infrastructure/n8n/n8n.config.ts`.

## Puertas de calidad

```bash
pnpm lint
pnpm typecheck
pnpm audit:architecture
pnpm build
pnpm test:e2e
```

`audit:architecture` comprueba:

- alcance de todos los archivos TypeScript/TSX desde App Router;
- dependencias permitidas entre capas;
- raíces inesperadas bajo `src`;
- archivos de `public` sin referencia;
- claves del manifiesto multimedia sin consumidor.

`next/font/google` descarga DM Sans durante `pnpm build`; el entorno de build
debe permitir acceso a Google Fonts para conservar exactamente la tipografía
aprobada.

## Cómo agregar contenido

1. Define o modifica datos en `src/infrastructure/content/data`.
2. Reutiliza los tipos de `src/domain/content`; evita contenido pedagógico
   dentro de JSX.
3. Si agregas un medio, colócalo en la categoría de su etapa y regístralo en el
   manifiesto.
4. Reutiliza los bloques de `src/presentation/content/blocks`.
5. Ejecuta todas las puertas de calidad antes de integrar el cambio.

Agregar una etapa no requiere crear una página ni un componente específico: se
incorpora al repositorio estático y el mismo `StageChapter` renderiza sus datos.
