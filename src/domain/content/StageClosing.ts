/**
 * DOMAIN — Entity
 *
 * Cierre de etapa: replica la tarjeta "CierreEtapa" del diseño importado
 * (video-resumen con controles manuales + pregunta de reflexión + botón
 * continuar). `final`/`finalNote` solo se usan en la Etapa 6 (cierre cíclico
 * de la espiral).
 */
import type { MediaKey } from "./value-objects/MediaKey";
import type { ClosingAccent } from "./value-objects/Accent";

export interface StageClosing {
  title: string;
  message: string;
  question: string;
  summaryVideo: MediaKey;
  summaryCaptions?: MediaKey;
  laiaAvatar: MediaKey;
  continueLabel: string;
  continueHref: string;
  accent: ClosingAccent;
  final?: boolean;
  finalNote?: string;
}
