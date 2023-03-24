import useSWRImmutable from "swr/immutable";
import { DeskType } from "../common/types";
import {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";
import { getRequest } from "../api/api";
import { useRouter } from "next/router";
import { GameProvider } from "./GameContext";
import { SocketProvider } from "./WebsocketContext";

interface DeskContext {
  desk: DeskType | null;
  setDesk: (desk: DeskType | null) => void;
}

const DEFAULT_VALUES = {
  desk: null,
  setDesk: () => {},
};

export const DeskContext = createContext<DeskContext>(DEFAULT_VALUES);

interface DeskCommonProps {
  children: ReactNode;
}

export const DeskOnlineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType | null>(null);
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

  return (
    <SocketProvider>
      <DeskProvider desk={desk} setDesk={setDesk} children={children} />
    </SocketProvider>
  );
};

export const DeskOfflineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType | null>({
    players: {
      max: 2,
      players: [],
    },
    gameplay: {
      round: null,
      result: null,
      history: null,
    },
  });

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
