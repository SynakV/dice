import React, { useState } from "react";
import { Desk } from "@components/Main/Game/Desk/Desk";
import {
  DiceType,
  RoundType,
  HistoryType,
  ConclusionType,
  UpdateType,
} from "@src/utils/types";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { History } from "@components/Main/Game/History/History";
import { Conclusion } from "@components/Main/Game/Conclusion/Conclusion";

export const Game = () => {
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
          [round?.stage?.value || 0]: result,
        },
      }));
    }
  };

  return (
    <div className="game">
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
