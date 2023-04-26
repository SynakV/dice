import { DeskType } from "@utils/common/types";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { ERRORS, Error } from "@components/Mode/Shared/Error/Error";

interface Props {
  children: ReactNode;
}

export const Guard: FC<Props> = ({ children }) => {
  const { player } = useGame();
  const { desk }: { desk: DeskType & { status?: number } } = useDesk();
  const [error, setError] = useState<ERRORS | null>(null);
  const [isShowChildren, setIsShowChildren] = useState(false);

  useEffect(() => {
    if (!desk) {
      return setIsShowChildren(false);
    }

    if (desk.status === 404) {
      return setError(ERRORS.GAME_DOES_NOT_EXIST);
    }

    if (desk.gameplay.isGameStarted && !player?.id) {
      return setError(ERRORS.GAME_ALREADY_STARTED);
    }

    if (
      desk.gameplay.players.length === desk.gameplay.max.players &&
      !player?.id
    ) {
      return setError(ERRORS.GAME_FULL_OF_PLAYERS);
    }

    if (desk._id) {
      setIsShowChildren(true);
    }
  }, [desk]);

  return (
    <>
      {isShowChildren && desk && children}
      <Error type={error} />
    </>
  );
};
