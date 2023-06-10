import Link from "next/link";
import Image from "next/image";
import { MODE } from "@utils/constants";
import React, { useEffect } from "react";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";
import {
  useMedia,
  MUSIC_NAME,
  VIDEO_NAME,
  DEFAULT_FADE_TIME,
} from "@utils/contexts/MediaProvider";

export const Mode = () => {
  const Cursor = useCursor();
  const { playMusic, playVideo } = useMedia();

  useEffect(() => {
    playVideo({
      name: VIDEO_NAME.PREPARATION,
      appFadeDuration: DEFAULT_FADE_TIME,
    });
    playMusic({
      name: MUSIC_NAME.PREPARATION,
      switchDuration: DEFAULT_FADE_TIME,
    });
  }, []);

  return (
    <FadeIn className="mode">
      {Object.entries(MODE).map(([key, { title, url }]) => (
        <Cursor key={key} hint={title} position="bottom" id={title}>
          <Link href={url} className="mode__option">
            <Image
              width={280}
              height={200}
              alt="grunge-wifi"
              src="/images/grunge-wifi.webp"
            />
            {url === MODE.offline.url && (
              <>
                <Image
                  width={280}
                  height={20}
                  alt="grunge-line-1"
                  src="/images/grunge-line.png"
                />
                <Image
                  width={280}
                  height={20}
                  alt="grunge-line-2"
                  src="/images/grunge-line.png"
                />
              </>
            )}
          </Link>
        </Cursor>
      ))}
    </FadeIn>
  );
};
