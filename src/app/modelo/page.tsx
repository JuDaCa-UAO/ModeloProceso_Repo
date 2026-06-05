import { redirect } from "next/navigation";

export default function ModeloPage() {
  // Legacy redirect — new canonical route is /etapas/etapa-1
  redirect("/etapas/etapa-1");
}
