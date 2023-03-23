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

interface DeskContext {
  desk: DeskType | null;
  setDesk: (desk: DeskType | null) => void;
}

const DEFAULT_VALUES = {
  desk: null,
  setDesk: () => {},
};

export const DeskContext = createContext<DeskContext>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

export const DeskProvider: FC<Props> = ({ children }) => {
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
    <DeskContext.Provider value={{ desk, setDesk }}>
      {desk && children}
    </DeskContext.Provider>
  );
};

export const useDesk = () => useContext(DeskContext);
