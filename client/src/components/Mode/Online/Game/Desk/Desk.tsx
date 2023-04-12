import React, { useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Cubes } from "@components/Mode/Online/Game/Desk/Cubes/Cubes";

export const Desk = () => {
  const { handle, desk } = useDesk();

  const { players, isGameEnded } = desk.gameplay;

  useEffect(() => {
    if (isGameEnded) {
      handle.endGame();
    }
  }, [isGameEnded]);

  return (
    <div className="desk">
      <div className="desk__cubes">
        {players.map((player, index) => (
          <Cubes player={player} name={player.name} key={player.id || index} />
        ))}
      </div>
    </div>
  );
};
