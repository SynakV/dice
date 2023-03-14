import { useEffect, useState } from "react";

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
      }, 300);
    }
  }, [isOpen]);

  return {
    isShow,
    fadeInClass: isClosing ? "closing" : "",
  };
};
