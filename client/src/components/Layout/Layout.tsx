import React, { FC } from "react";
import { Main } from "@components/Main/Main";
import { Menu } from "@components/Layout/Menu/Menu";

export const Layout: FC = () => {
  return (
    <div className="layout">
      <div className="layout__background" />
      <Menu />
      <Main />
    </div>
  );
};
