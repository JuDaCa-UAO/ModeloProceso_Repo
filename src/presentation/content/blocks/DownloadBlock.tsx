import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import DownloadableCard from "../downloads/DownloadableCard";

export default function DownloadBlock({
  block,
  resolver,
}: {
  block: Extract<Block, { type: "download" }>;
  resolver: IMediaResolver;
}) {
  const media = resolver.resolve(block.mediaKey);
  const preview = resolver.resolve(block.previewMediaKey);

  return (
    <DownloadableCard
      title={block.title}
      description={block.description}
      information={block.information}
      stageLabel={block.stageLabel}
      resourceType={block.resourceType}
      pdf={media}
      preview={preview}
    />
  );
}
