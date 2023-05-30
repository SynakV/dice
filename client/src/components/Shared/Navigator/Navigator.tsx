import Image from "next/image";
import React, { FC } from "react";
import { useRouter } from "next/router";
import { usePortal } from "@utils/hooks/usePortal";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  url?: string;
  onNavigate?: () => void;
}

export const Navigator: FC<Props> = ({ url, onNavigate }) => {
  const Cursor = useCursor();
  const portal = usePortal();
  const { push } = useRouter();

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      push(url || "/");
    }
  };

  return portal(
    <FadeIn>
      <Cursor hint="Back" id="navigator-back">
        <div className="navigator" onClick={handleNavigate}>
          <Image
            width={50}
            height={50}
            alt="arrow-back"
            className="navigator__image"
            src="/images/arrow-back.png"
          />
        </div>
      </Cursor>
    </FadeIn>
  );
};
