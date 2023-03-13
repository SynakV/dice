import React, { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  title: string;
  isOpen: boolean;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children, title, isOpen }) => {
  const [isShow, setIsShow] = useState(isOpen);
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

  return isShow ? (
    <div className={`modal ${isClosing ? "closing" : ""}`}>
      <div className="modal__window">
        <span className="modal__title">{title}</span>
        {children}
      </div>
    </div>
  ) : null;
};
