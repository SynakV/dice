import {
  FC,
  useState,
  Dispatch,
  ReactNode,
  useEffect,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import { getRequest } from "../api/api";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import { GameProvider } from "./GameContext";
import { deepClone } from "../helpers/common.helper";
import { STORAGE_ITEMS } from "../helpers/storage/constants";
import { DeskType, RoundType, StageType } from "../common/types";
import { getStorageObjectItem } from "../helpers/storage/storage.helper";

interface DeskContext {
  desk: DeskType;
  setDesk: Dispatch<SetStateAction<DeskType>>;
}

export const DEFAULT_STAGE: StageType = {
  rankings: [],
  isStarted: false,
  isCompleted: false,
};

export const DEFAULT_ROUND: RoundType = {
  isCompleted: false,
  stages: [deepClone(DEFAULT_STAGE)],
};

export const DEFAULT_CURRENT = {
  round: 0,
  stage: 0,
  player: {},
};

const DEFAULT_DESK: DeskType = {
  gameplay: {
    players: [],
    isGameEnded: false,
    isGameStarted: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    max: {
      wins: 2,
      stages: 2,
      players: 2,
    },
    current: deepClone(DEFAULT_CURRENT),
  },
};

const DEFAULT_VALUES = {
  desk: DEFAULT_DESK,
  setDesk: () => {},
};

export const DeskContext = createContext<DeskContext>(DEFAULT_VALUES);

interface DeskCommonProps {
  children: ReactNode;
}

export const DeskOnlineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);
  const { query } = useRouter();
  const { data } = useSWRImmutable(
    () => (query.id ? `desk/${query.id}` : null),
    getRequest<DeskType>
  );

  useEffect(() => {
    if (data) {
      setDesk(data);
    }
  }, [data]);

  return <DeskProvider desk={desk} setDesk={setDesk} children={children} />;
};

export const DeskOfflineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);

  useEffect(() => {
    setDesk((prev) => ({
      ...prev,
      gameplay: {
        ...prev.gameplay,
        current: {
          ...prev.gameplay.current,
          player: {
            name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
          },
        },
      },
    }));
  }, []);

  return <DeskProvider desk={desk} setDesk={setDesk} children={children} />;
};

export const DeskProvider: FC<DeskCommonProps & DeskContext> = ({
  desk,
  setDesk,
  children,
}) => (
  <DeskContext.Provider value={{ desk, setDesk }}>
    <GameProvider>{desk && children}</GameProvider>
  </DeskContext.Provider>
);

export const useDesk = () => useContext(DeskContext);
