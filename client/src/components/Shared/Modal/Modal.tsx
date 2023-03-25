import React, { FC, ReactNode } from "react";
import { useFadeIn } from "@src/utils/hooks/useFadeIn";
import { usePortal } from "@src/utils/hooks/usePortal";

interface Props {
  title: string;
  isOpen: boolean;
  className?: string;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children, title, isOpen, className }) => {
  const portal = usePortal();
  const { isShow, fadeInClass } = useFadeIn(isOpen);

  return isShow
    ? portal(
        <div className={`modal ${className} ${fadeInClass}`}>
          <div className="modal__window">
            <span className="modal__title">{title}</span>
            {children}
          </div>
        </div>
      )
    : null;
};
