import React, { FC, useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Placeholder } from "@components/Mode/Shared/Hand/Placeholder/Placeholder";

interface Props {
  cubes: React.FC<any>;
}

export const Desk: FC<Props> = ({ cubes: Cubes }) => {
  const { handle, desk } = useDesk();

  const { players, max, isGameEnded } = desk.gameplay;

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
      {new Array(max.players - players.length).fill(null).map((_, index) => (
        <Placeholder key={index} player={players.length + index + 1} />
      ))}
    </div>
  );
};
