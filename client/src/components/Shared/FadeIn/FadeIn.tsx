import React, { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export const FadeIn = ({ children, className }: Props) => {
  return (
    <div className={className} style={{ animation: "fadeIn 0.5s" }}>
      {children}
    </div>
  );
};
