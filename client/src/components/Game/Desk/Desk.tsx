import React, { useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import { Cubes } from "@components/Game/Desk/Cubes/Cubes";
import { afterEndGame } from "@utils/helpers/gameplay/gameplay.helper";

export const Desk = () => {
  const { refreshGame } = useGame();
  const { desk, setDesk } = useDesk();

  const { players, isGameEnded } = desk.gameplay;

  useEffect(() => {
    if (isGameEnded) {
      refreshGame();
      setDesk(afterEndGame);
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
