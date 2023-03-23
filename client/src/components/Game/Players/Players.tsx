import React from "react";
import { createPortal } from "react-dom";
import { useDesk } from "@src/utils/contexts/DeskContext";

export const Players = () => {
  const { desk } = useDesk();

  const max = desk?.players?.max;
  const players = desk?.players?.players;

  return createPortal(
    <div className="players">
      <div className="players__list">
        {players?.length
          ? players.map((player, index) => (
              <div key={index} className="players__player">
                {player.name}
              </div>
            ))
          : null}
      </div>
      <span className="players__counter">
        Players: {players?.length}/{max}
      </span>
      {/* {new Array(15).fill(null).map((_, index) => (
            <div key={index} className="players__player">
              {index}
            </div>
          ))} */}
    </div>,
    document.getElementsByTagName("body")[0]
  );
};
