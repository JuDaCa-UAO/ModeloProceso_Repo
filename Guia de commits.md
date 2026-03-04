# ──────────────────────────────────────────────────────────────────────────────
# COMMITS — Migración a Clean Architecture + reestructuración src/
# Proyecto: AI TECH-ED — Modelo de Proceso GenAI Educativo
# ──────────────────────────────────────────────────────────────────────────────

# 1. Configuración base
feat(config): add path aliases @domain, @application, @infra in tsconfig
feat(config): add CSP and security headers in next.config.ts
feat(config): add .env.local.example with N8N env vars

# 2. Capa Domain — núcleo sin dependencias externas
feat(domain): add StageFlagKey value object
feat(domain): add HierarchyLevel and StageResultId value objects
feat(domain): add Stage1ProgressState entity with coerceStage1Progress
feat(domain): add ConsentRule — pure function for consent validation
feat(domain): add GatingRule — pure function for section visibility
feat(domain): add ResultRule — derive recommendations from result level
feat(domain): add IStageProgressRepository interface
feat(domain): add IStageContentRepository interface
feat(domain): add ChatbotContext entity and LaiaMood type
feat(domain): add LaiaContextRule — pure function for Laia mood
feat(domain): add EmailValidator and RequiredValidator shared validators

# 3. Capa Application — casos de uso
feat(application): add IAutodiagnosticPort output port
feat(application): add IProgressEventBus output port
feat(application): add EvaluateFlagsUseCase — compute all stage flags from raw state
feat(application): add GetStageContentUseCase — fetch stage tree by id
feat(application): add StartStageUseCase — register stage start
feat(application): add SaveIntentionUseCase — validate and persist intention
feat(application): add BuildLaiaContextUseCase — build chatbot context from progress

# 4. Capa Infrastructure — implementaciones concretas
feat(infra): add env.ts — typed accessor for process.env
feat(infra): add n8n.config.ts — single source of truth for N8N URLs
feat(infra): add N8NAutodiagnosticAdapter implementing IAutodiagnosticPort
feat(infra): add LocalStorageEventBus implementing IProgressEventBus
feat(infra): add LocalStorageProgressRepository implementing IStageProgressRepository
feat(infra): add StaticStageContentRepository implementing IStageContentRepository

# 5. Contenido reestructurado
feat(content): add character-assets.ts — isolate LAIA_ASSETS from stage content
feat(content): add stage-1.content.ts — refactored tree importing from shared assets
feat(content): add stages/index.ts — StageMeta registry with getStageMeta()

# 6. Estado unificado y hooks
feat(lib): add StageProgressStore — unified useSyncExternalStore replacing two parallel stores
feat(hooks): add hooks/domain/useStageProgress — generic hook by stageId using EvaluateFlagsUseCase
feat(hooks): add hooks/ui/useScrollPin — moved to ui/ subfolder
feat(hooks): add hooks/ui/useProgressiveReveal — moved to ui/ subfolder

# 7. Componentes — capa de presentación
feat(components): add BlockContext type — shared contract between BlockRenderer and blocks
feat(components): add blocks.module.css — shared styles extracted from etapa1.module.css
feat(components): add ParagraphsBlock component
feat(components): add BulletsBlock component
feat(components): add StateCardsBlock component
feat(components): add HorizontalRailBlock component
feat(components): add AnimationBlock — configurable flagToSet
feat(components): add ConsentFormBlock — checkboxes + email form
feat(components): add AutodiagnosticBlock — N8N iframe with fallback
feat(components): add ResultSummaryBlock — calls ResultRule from domain
feat(components): add IntentionFormBlock — textarea + emotion select
feat(components): add TransitionAnimationBlock — wraps AnimationBlock for E1→E2
feat(components): add BlockRenderer — single switch dispatcher for all block types
feat(components): add stage/types.ts — presentation types with ReactNode

# 8. Ruta dinámica — reemplaza rutas estáticas por etapa
feat(app): add app/etapa/[stageId]/page.tsx — Server Component with generateStaticParams
feat(app): add app/etapa/[stageId]/StageClient.tsx — generic client engine ~100 lines

# 9. Corrección de tipos y domain boundary
fix(types): remove ReactNode import from types/stage.ts — domain boundary violation

# 10. Actualizaciones de rutas y navegación
fix(app): update modelo/page.tsx redirect to /etapa/etapa-1
fix(app): update inicio/ActionButtons.tsx href to /etapa/etapa-1
fix(components): update HorizontalScrollRail import to hooks/ui/useScrollPin

# 11. Eliminación de archivos legacy
refactor: delete app/etapa-1/ — superseded by app/etapa/[stageId]/
refactor: delete app/etapa2/ — superseded by app/etapa/[stageId]/
refactor: delete hooks/useStageProgress.ts — superseded by hooks/domain/useStageProgress.ts
refactor: delete hooks/useScrollPin.ts — superseded by hooks/ui/useScrollPin.ts
refactor: delete hooks/useProgressiveReveal.ts — superseded by hooks/ui/useProgressiveReveal.ts
refactor: delete content/stage1.ts — superseded by content/stages/stage-1.content.ts
refactor: delete lib/validation/index.ts — superseded by src/domain/shared/validation/

# 12. Corrección de imports rotos tras eliminación legacy
fix(app): update opciones/page.tsx to use resetStore() instead of legacy useStageProgress
fix(app): update StageClient to use writeProgress() for global nav state
fix(app): fix embebido-1 redirect to /etapa/etapa-1

# 13. Fix sintaxis en contenido
fix(content): fix FACTORS array — replace ASCII quotes inside string literals causing TS1127

# 14. Reestructuración — todo el código fuente a src/
refactor: move app/ components/ content/ hooks/ lib/ types/ into src/
feat(config): update tsconfig @/* alias from ./* to ./src/*

# 15. Fix routing — links internos apuntaban a rutas eliminadas
fix(app): update opciones/page.tsx Link href /etapa-1 → /etapa/etapa-1
fix(lib): update default lastRoute /modelo → /etapa/etapa-1 in progress.ts and useProgress.ts

# 16. Documentación
docs: rewrite README with architecture diagram, folder structure, and usage guides