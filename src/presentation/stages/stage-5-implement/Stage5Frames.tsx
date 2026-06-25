"use client";

import type { StageFramesProps } from "../shared/StageFramesProps";

export default function Stage5Frames({ stageId }: StageFramesProps) {
  console.debug("Rendering stage:", stageId);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        color: "#c9b8e8",
        fontSize: "1.1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <p>Esta etapa estará disponible próximamente.</p>
    </div>
  );
}
