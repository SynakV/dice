import React, { FC } from "react";
import { Main } from "@components/Main/Main";
import { Music } from "@src/components/Music/Music";

export const Layout: FC = () => {
  return (
    <div className="layout">
      <div className="background" />
      <Music />
      <Main />
    </div>
  );
};
