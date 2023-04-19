import { useEffect, useState } from "react";
import { TIMEOUT_TRANSITION } from "@utils/constants";

export const useFadeIn = (isOpen: boolean) => {
  const [isShow, setIsShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsShow(true);
      setIsClosing(false);
    }
    if (!isOpen && isShow) {
      setIsClosing(true);
      setTimeout(() => {
        setIsShow(false);
      }, TIMEOUT_TRANSITION);
    }
  }, [isOpen]);

  return {
    isShow,
    fadeInClass: isClosing ? "closing" : "",
  };
};
