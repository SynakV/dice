import Link from "next/link";
import Image from "next/image";
import React, { FC } from "react";
import { usePortal } from "@utils/hooks/usePortal";

interface Props {
  url?: string;
}

export const Navigator: FC<Props> = ({ url }) => {
  const portal = usePortal();

  return portal(
    <Link href={url || "/"}>
      <Image
        width={50}
        height={50}
        alt="arrow-back"
        className="navigator"
        src="/images/arrow-back.png"
      />
    </Link>
  );
};
