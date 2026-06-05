/**
 * COMPAT — Redirect legacy
 *
 * /etapa/[stageId] fue la ruta canónica hasta que se unificó todo bajo /etapas/.
 * Se mantiene como redirect permanente para no romper:
 *   - progreso guardado en localStorage (campo lastRoute = "/etapa/...")
 *   - enlaces externos o pruebas anteriores
 *   - el redirect de /modelo → /etapa/etapa-1
 *
 * TODO: eliminar esta carpeta cuando se confirme que ningún usuario tiene
 * progreso guardado con rutas /etapa/* en localStorage.
 */

import { redirect } from "next/navigation";

type Props = { params: Promise<{ stageId: string }> };

export default async function LegacyStagePage({ params }: Props) {
  const { stageId } = await params;
  redirect(`/etapas/${stageId}`);
}
