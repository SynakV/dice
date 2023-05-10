import Link from "next/link";
import Image from "next/image";
import React, { FC } from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useHint } from "@utils/contexts/HintProvider";

interface Props {
  url?: string;
}

export const Navigator: FC<Props> = ({ url }) => {
  const getHint = useHint();
  const portal = usePortal();

  return portal(
    <Link href={url || "/"}>
      <Image
        width={50}
        height={50}
        alt="arrow-back"
        // {...getHint("Back")}
        className="navigator"
        src="/images/arrow-back.png"
      />
    </Link>
  );
};
