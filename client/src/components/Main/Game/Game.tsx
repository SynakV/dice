import React, { useState } from "react";
import { Desk } from "@components/Main/Game/Desk/Desk";
import {
  DiceType,
  RoundType,
  HistoryType,
  ConclusionType,
} from "@src/utils/types";
import { History } from "@components/Main/Game/History/History";
import { Conclusion } from "@components/Main/Game/Conclusion/Conclusion";

export const Game = () => {
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryType | null>(null);
  const [conclusion, setConclusion] = useState<ConclusionType | null>(null);

  const handleSetConclusion = (conclusion: ConclusionType) => {
    setConclusion((prev) => ({
      ...prev,
      ...conclusion,
    }));
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
        [round?.value!]: {
          ...prev?.[round?.value!],
          [round?.stage!]: result,
        },
      }));
    }
  };

  const handleToggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  return (
    <div className="game">
      {conclusion && (
        <Conclusion conclusion={conclusion} setIsClearOnEnd={setIsGameEnd} />
      )}
      <History
        history={history}
        isOpen={isHistoryOpen}
        toggleHistory={handleToggleHistory}
      />
      <Desk
        isGameEnd={isGameEnd}
        setHistory={handleSetHistory}
        setConclusion={handleSetConclusion}
        toggleHistory={handleToggleHistory}
      />
    </div>
  );
};
