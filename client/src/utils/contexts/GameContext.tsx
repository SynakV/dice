import { playAudio } from "../helpers/audio.helper";
import {
  FC,
  Dispatch,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import { useDesk } from "./DeskContext";
import { afterEndGame } from "@utils/helpers/gameplay/gameplay.helper";

export enum GAME_OPEN {
  HISTORY,
  SETTINGS,
}

interface GameContextType {
  gameOpen: GameOpenType;
  isInitSettings: boolean;
  refreshGame: () => void;
  onRefreshGame: {} | null;
  toggleGameOpen: (key: GAME_OPEN) => void;
  setIsInitSettings: Dispatch<SetStateAction<boolean>>;
}

type GameOpenType = {
  [key in GAME_OPEN]: boolean;
};

const DEFAULT_GAME_OPEN = {
  [GAME_OPEN.HISTORY]: false,
  [GAME_OPEN.SETTINGS]: false,
};

const DEFAULT_VALUES: GameContextType = {
  isInitSettings: true,
  onRefreshGame: null,
  refreshGame: () => {},
  toggleGameOpen: () => {},
  setIsInitSettings: () => {},
  gameOpen: DEFAULT_GAME_OPEN,
};

export const GameContext = createContext<GameContextType>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

export const GameProvider: FC<Props> = ({ children }) => {
  const { socket, setDesk } = useDesk();
  const [gameOpen, setGameOpen] = useState<GameOpenType>(DEFAULT_GAME_OPEN);
  const [isInitSettings, setIsInitSettings] = useState(
    DEFAULT_VALUES.isInitSettings
  );
  const [refreshGame, setRefreshGame] = useState<{} | null>(
    DEFAULT_VALUES.onRefreshGame
  );

  const toggleGameOpen = (key: GAME_OPEN) => {
    if (!isInitSettings) {
      playAudio("hover");
    }
    setGameOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRefreshGame = () => {
    setRefreshGame({});
    setDesk(afterEndGame);
  };

  useEffect(() => {
    if (!socket) {
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameOpen,
        isInitSettings,
        toggleGameOpen,
        setIsInitSettings,
        onRefreshGame: refreshGame,
        refreshGame: handleRefreshGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
