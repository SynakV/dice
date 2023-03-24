import Link from "next/link";
import { createPortal } from "react-dom";
import React, { FC, useEffect, useState } from "react";

interface Props {
  url?: string;
  text: string;
}

export const Navigator: FC<Props> = ({ url, text }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(true);
  }, []);

  return isShow
    ? createPortal(
        <Link href={url || "/"}>
          <div className="navigator">{text}</div>
        </Link>,
        document.getElementsByTagName("body")[0]
      )
    : null;
};
