import {
  DiceType,
  RoundType,
  UpdateType,
  HistoryType,
  ConclusionType,
} from "@src/utils/types";
import React, { FC, useState } from "react";
import { DeskType } from "@src/utils/common/types";
import { Desk } from "@src/components/Game/Desk/Desk";
import { playAudio } from "@utils/helpers/audio.helper";
import { History } from "@components/Game/History/History";
import { Conclusion } from "@components/Game/Conclusion/Conclusion";

interface Props {
  desk: DeskType;
  onGameStarted: () => void;
}

export const Game: FC<Props> = ({ desk, onGameStarted }) => {
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [update, setUpdate] = useState<UpdateType | null>(null);
  const [history, setHistory] = useState<HistoryType | null>(null);
  const [conclusion, setConclusion] = useState<ConclusionType | null>(null);

  const handleSetConclusion = (conclusion: ConclusionType) => {
    setConclusion((prev) => ({
      ...prev,
      ...conclusion,
    }));
  };

  const handleToggleHistory = () => {
    playAudio("hover");
    setIsHistoryOpen((prev) => !prev);
  };

  const handleSetHistory = (
    result: DiceType | null,
    round: RoundType | null
  ) => {
    if (result === null && round === null) {
      setHistory(null);
    } else {
      setHistory((prev) => ({
        ...prev,
        [round?.value || 0]: {
          ...prev?.[round?.value || 0],
          [round?.stage?.value || 0]: {
            round,
            result,
          },
        },
      }));
    }
  };

  const isAllPlayersPresent =
    desk?.players?.players?.length === desk?.players?.max;

  return (
    <div className="game">
      <span
        className={`game__start ${
          isAllPlayersPresent ? "" : "game__start--disabled"
        }`}
        onClick={isAllPlayersPresent ? () => onGameStarted() : () => {}}
      >
        Start game
      </span>
      {conclusion && (
        <Conclusion
          update={update}
          setUpdate={setUpdate}
          conclusion={conclusion}
          setIsClearOnEnd={setIsGameEnd}
          toggleHistoryOpen={handleToggleHistory}
        />
      )}
      <History
        history={history}
        isOpen={isHistoryOpen}
        toggleHistory={handleToggleHistory}
      />
      <Desk
        update={update}
        isGameEnd={isGameEnd}
        setIsGameEnd={setIsGameEnd}
        setHistory={handleSetHistory}
        setConclusion={handleSetConclusion}
        toggleHistory={handleToggleHistory}
      />
    </div>
  );
};
