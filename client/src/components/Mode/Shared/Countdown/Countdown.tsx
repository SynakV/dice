import { usePortal } from "@utils/hooks/usePortal";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import React, { FC, useEffect, useState } from "react";
import { useCountdown } from "@utils/hooks/useCountdown";

interface Props {
  date: number;
  onTimeout: () => void;
}

export const Countdown: FC<Props> = ({ date, onTimeout }) => {
  const [isOpen, setIsOpen] = useState(true);

  const portal = usePortal();
  const { seconds } = useCountdown(date);
  const { isShow, fadeInClass } = useFadeIn(isOpen);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout();
      setIsOpen(false);
    }
  }, [seconds]);

  return isShow
    ? portal(<div className={`countdown ${fadeInClass}`}>{seconds}</div>)
    : null;
};
