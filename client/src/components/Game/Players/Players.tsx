import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";

export const Players = () => {
  const { desk } = useDesk();
  const portal = usePortal();

  const max = desk.gameplay.max.players;
  const players = desk.gameplay.players;

  return portal(
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
    </div>
  );
};
