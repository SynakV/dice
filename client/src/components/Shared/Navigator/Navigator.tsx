import Link from "next/link";
import React, { FC } from "react";
import { usePortal } from "@utils/hooks/usePortal";

interface Props {
  url?: string;
  text: string;
}

export const Navigator: FC<Props> = ({ url, text }) => {
  const portal = usePortal();

  return portal(
    <Link href={url || "/"}>
      <div className="navigator">{text}</div>
    </Link>
  );
};
