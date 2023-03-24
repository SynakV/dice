import React from "react";
import { Game } from "@src/components/Game/Game";
import { Navigator } from "@src/components/Shared/Navigator/Navigator";

export const Offline = () => {
  return (
    <>
      <Game />
      <Navigator text="Home" />
    </>
  );
};
