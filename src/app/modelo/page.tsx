import { redirect } from "next/navigation";

export default function ModeloPage() {
  // Legacy redirect — new canonical route is /etapa/etapa-1
  redirect("/etapa/etapa-1");
}
