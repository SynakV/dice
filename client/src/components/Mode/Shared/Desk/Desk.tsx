import React, { FC, useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";

interface Props {
  cubes: React.FC<any>;
}

export const Desk: FC<Props> = ({ cubes: Cubes }) => {
  const { handle, desk } = useDesk();

  const { players, isGameEnded } = desk.gameplay;

  useEffect(() => {
    if (isGameEnded) {
      handle.endGame();
    }
  }, [isGameEnded]);

  return (
    <div className="desk">
      {players.map((player, index) => (
        <Cubes key={player.id || index} player={player} />
      ))}
    </div>
  );
};
