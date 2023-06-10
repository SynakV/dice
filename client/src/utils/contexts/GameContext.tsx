import { useRouter } from "next/router";
import {
  FC,
  Dispatch,
  useState,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import { PlayerType } from "@utils/common/types";
import { playSound } from "@utils/contexts/MediaProvider";

export enum GAME_OPEN {
  HISTORY,
  SETTINGS,
  CONCLUSION,
}

interface GameContextType {
  isOnline?: boolean;
  gameOpen: GameOpenType;
  isInitSettings: boolean;
  isControlsLoading: boolean;
  player: PlayerType | null;
  setPlayer: (player: PlayerType) => void;
  toggleGameOpen: (key: GAME_OPEN) => void;
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
  player: null,
  isInitSettings: true,
  isControlsLoading: false,
  setPlayer: () => {},
  toggleGameOpen: () => {},
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

  const [player, setPlayer] = useState<PlayerType | null>(null);

  const isOnline = route.includes("online");

  const toggleGameOpen = (key: GAME_OPEN) => {
    if (!isInitSettings || isOnline) {
      playSound("hover");
    }
    setGameOpen((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleSetPlayer = (player: PlayerType) => {
    setPlayer((prev) => ({
      ...prev,
      ...player,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        player,
        gameOpen,
        isOnline,
        isInitSettings,
        isControlsLoading,
        toggleGameOpen,
        setIsInitSettings,
        setIsControlsLoading,
        setPlayer: handleSetPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
