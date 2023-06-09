import React, { ReactNode } from "react";

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export const FadeIn = ({ id, className, children }: Props) => {
  return (
    <div
      {...(id && { id })}
      {...(className && { className })}
      style={{ animation: "fadeIn 0.5s" }}
    >
      {children}
    </div>
  );
};
