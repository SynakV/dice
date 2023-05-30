import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MODE } from "@utils/constants";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";

export const Mode = () => {
  const Cursor = useCursor();

  return (
    <FadeIn className="mode">
      {Object.entries(MODE).map(([key, { title, url }]) => (
        <Cursor key={key} hint={title} position="bottom" id={title}>
          <Link href={url} className="mode__option">
            <Image
              width={200}
              height={150}
              alt="grunge-wifi"
              src="/images/grunge-wifi.webp"
            />
            {url === MODE.offline.url && (
              <>
                <Image
                  width={200}
                  height={20}
                  alt="grunge-line-1"
                  src="/images/grunge-line.png"
                />
                <Image
                  width={200}
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
