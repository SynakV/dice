import React, { FC, ReactNode } from "react";

interface Props {
  title: string;
  isOpen: boolean;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children, title, isOpen }) => {
  return isOpen ? (
    <div className="modal">
      <div className="modal__window">
        <span className="modal__title">{title}</span>
        {children}
      </div>
    </div>
  ) : null;
};
