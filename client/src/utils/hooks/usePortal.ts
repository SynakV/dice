import { createPortal } from "react-dom";
import { ReactNode, useEffect, useState } from "react";

export const usePortal = () => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(true);
  }, []);

  const renderElement = (element: ReactNode, container?: Element) => {
    return isShow
      ? createPortal(
          element,
          container || document.getElementsByTagName("body")[0]
        )
      : null;
  };

  return renderElement;
};
