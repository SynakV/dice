import { playAudio } from "../helpers/audio.helper";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface GameContextType {
  isHistoryOpen: boolean;
  toggleHistoryOpen: () => void;
}

const DEFAULT_VALUES = {
  isHistoryOpen: false,
  toggleHistoryOpen: () => {},
};

export const GameContext = createContext<GameContextType>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

export const GameProvider: FC<Props> = ({ children }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const toggleHistoryOpen = () => {
    playAudio("hover");
    setIsHistoryOpen((prev) => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        isHistoryOpen,
        toggleHistoryOpen,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
