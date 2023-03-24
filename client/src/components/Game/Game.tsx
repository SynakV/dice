import React, { FC, useState } from "react";
import { GameplayType } from "@utils/common/types";
import { DeskType } from "@src/utils/common/types";
import { Desk } from "@src/components/Game/Desk/Desk";
import { playAudio } from "@utils/helpers/audio.helper";
import { History } from "@components/Game/History/History";
import { Conclusion } from "@components/Game/Conclusion/Conclusion";

interface Props {
  desk?: DeskType;
  onGameStarted?: () => void;
}

export const Game: FC<Props> = ({ desk, onGameStarted }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [gameplay, setGamaplay] = useState<GameplayType>({});

  const handleToggleHistory = () => {
    playAudio("hover");
    setIsHistoryOpen((prev) => !prev);
  };

  const isAllPlayersPresent =
    desk?.players?.players?.length === desk?.players?.max;

  return (
    <div className="game">
      <span
        className={`game__start ${
          isAllPlayersPresent ? "" : "game__start--disabled"
        }`}
        onClick={
          isAllPlayersPresent
            ? () => onGameStarted && onGameStarted()
            : () => {}
        }
      >
        Start game
      </span>
      <Conclusion
        gameplay={gameplay}
        setGameplay={setGamaplay}
        toggleHistoryOpen={handleToggleHistory}
      />
      <History
        isOpen={isHistoryOpen}
        history={gameplay.history}
        toggleHistory={handleToggleHistory}
      />
      <Desk
        gameplay={gameplay}
        setGameplay={setGamaplay}
        toggleHistory={handleToggleHistory}
      />
    </div>
  );
};
