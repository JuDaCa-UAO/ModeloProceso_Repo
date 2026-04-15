import { useState, useEffect, useRef } from "react";
import { SequenceConfig } from "./sequenceRegistry";

export function useImageSequence(config: SequenceConfig) {
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(config.totalFrames).fill(null));

  useEffect(() => {
    let active = true;

    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const frameNum = String(index).padStart(4, "0");
        img.src = `${config.basePath}/${frameNum}.webp`;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${frameNum}`));
      });
    };

    const init = async () => {
      try {
        const poster = await loadFrame(config.posterFrame);
        if (!active) return;
        framesRef.current[config.posterFrame - 1] = poster;
        setPosterLoaded(true);

        const PRELOAD_COUNT = 8;
        const initialBatch = [];
        for (let i = 1; i <= Math.min(PRELOAD_COUNT, config.totalFrames); i++) {
          if (i !== config.posterFrame) {
            initialBatch.push(
              loadFrame(i)
                .then(img => {
                  if (active) framesRef.current[i - 1] = img;
                })
                .catch(console.warn)
            );
          }
        }
        await Promise.all(initialBatch);
        if (!active) return;
        setReadyToAnimate(true);

        const BATCH_SIZE = 10;
        let chain = Promise.resolve();
        for (let i = Math.min(PRELOAD_COUNT, config.totalFrames) + 1; i <= config.totalFrames; i += BATCH_SIZE) {
          chain = chain.then(() => {
            if (!active) return;
            const batch = [];
            for (let j = i; j < i + BATCH_SIZE && j <= config.totalFrames; j++) {
              batch.push(
                loadFrame(j)
                  .then(img => {
                    if (active) framesRef.current[j - 1] = img;
                  })
                  .catch(() => {})
              );
            }
            return Promise.all(batch) as Promise<any>;
          });
        }
      } catch (err) {
        console.error("Image sequence load error:", err);
      }
    };

    init();

    return () => {
      active = false;
      // We do not unset framesRef here to allow smooth remounts if needed,
      // but if the component remounts and changes config, it will start over cleanly.
    };
  }, [config.basePath, config.totalFrames, config.posterFrame]);

  return { framesRef, posterLoaded, readyToAnimate };
}
