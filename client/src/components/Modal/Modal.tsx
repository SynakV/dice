import { createPortal } from "react-dom";
import React, { FC, ReactNode } from "react";
import { useFadeIn } from "@src/utils/hooks/useFadeIn";

interface Props {
  title: string;
  isOpen: boolean;
  className?: string;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children, title, isOpen, className }) => {
  const { isShow, fadeInClass } = useFadeIn(isOpen);

  return isShow
    ? createPortal(
        <div className={`modal ${className} ${fadeInClass}`}>
          <div className="modal__window">
            <span className="modal__title">{title}</span>
            {children}
          </div>
        </div>,
        document.getElementsByTagName("body")[0]
      )
    : null;
};
