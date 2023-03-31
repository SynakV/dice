import { playAudio } from "../helpers/audio.helper";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface GameContextType {
  isHistoryOpen: boolean;
  refreshGame: () => void;
  onRefreshGame: {} | null;
  toggleHistoryOpen: () => void;
}

const DEFAULT_VALUES = {
  onRefreshGame: null,
  isHistoryOpen: false,
  refreshGame: () => {},
  toggleHistoryOpen: () => {},
};

export const GameContext = createContext<GameContextType>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

export const GameProvider: FC<Props> = ({ children }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [refreshGame, setRefreshGame] = useState<{} | null>(null);

  const toggleHistoryOpen = () => {
    playAudio("hover");
    setIsHistoryOpen((prev) => !prev);
  };

  const handleRefreshGame = () => {
    setRefreshGame({});
  };

  return (
    <GameContext.Provider
      value={{
        isHistoryOpen,
        toggleHistoryOpen,
        onRefreshGame: refreshGame,
        refreshGame: handleRefreshGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
