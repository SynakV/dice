import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MODE } from "@utils/constants";

export const Mode = () => (
  <div className="mode">
    {Object.entries(MODE).map(([key, { url }]) => (
      <Link className="mode__option" key={key} href={url}>
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
    ))}
  </div>
);
