import Link from "next/link";
import Image from "next/image";
import React, { FC } from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  url?: string;
}

export const Navigator: FC<Props> = ({ url }) => {
  const Cursor = useCursor();
  const portal = usePortal();

  return portal(
    <Link href={url || "/"}>
      <Cursor hint="Back" id="navigator-back">
        <Image
          width={50}
          height={50}
          alt="arrow-back"
          className="navigator"
          src="/images/arrow-back.png"
        />
      </Cursor>
    </Link>
  );
};
