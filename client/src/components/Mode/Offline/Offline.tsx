import React from "react";
import { Game } from "@components/Game/Game";
import { Navigator } from "@components/Shared/Navigator/Navigator";

export const Offline = () => {
  return (
    <>
      <Game />
      <Navigator text="Home" />
    </>
  );
};