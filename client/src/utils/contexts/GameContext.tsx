import { useRouter } from "next/router";
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

export enum GAME_OPEN {
  HISTORY,
  SETTINGS,
  CONCLUSION,
}

interface GameContextType {
  gameOpen: GameOpenType;
  isInitSettings: boolean;
  isControlsLoading: boolean;
  toggleGameOpen: (key: GAME_OPEN) => void;
  handleGameOpen: (key: GAME_OPEN, value: boolean) => void;
  setIsInitSettings: Dispatch<SetStateAction<boolean>>;
  setIsControlsLoading: Dispatch<SetStateAction<boolean>>;
}

type GameOpenType = {
  [key in GAME_OPEN]: boolean;
};

const DEFAULT_GAME_OPEN = {
  [GAME_OPEN.HISTORY]: false,
  [GAME_OPEN.SETTINGS]: false,
  [GAME_OPEN.CONCLUSION]: false,
};

const DEFAULT_VALUES: GameContextType = {
  isInitSettings: true,
  isControlsLoading: false,
  toggleGameOpen: () => {},
  handleGameOpen: () => {},
  setIsInitSettings: () => {},
  setIsControlsLoading: () => {},
  gameOpen: DEFAULT_GAME_OPEN,
};

export const GameContext = createContext<GameContextType>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

export const GameProvider: FC<Props> = ({ children }) => {
  const { route } = useRouter();
  const [gameOpen, setGameOpen] = useState<GameOpenType>(DEFAULT_GAME_OPEN);
  const [isControlsLoading, setIsControlsLoading] = useState(
    DEFAULT_VALUES.isControlsLoading
  );
  const [isInitSettings, setIsInitSettings] = useState(
    DEFAULT_VALUES.isInitSettings
  );

  const isOnline = route.includes("online");

  const toggleGameOpen = (key: GAME_OPEN) => {
    if (!isInitSettings) {
      playAudio("hover");
    }
    setGameOpen((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleGameOpen = (key: GAME_OPEN, value: boolean) => {
    if (!isInitSettings) {
      playAudio("hover");
    }
    setGameOpen((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!isOnline) {
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameOpen,
        isInitSettings,
        isControlsLoading,
        toggleGameOpen,
        handleGameOpen,
        setIsInitSettings,
        setIsControlsLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
