import { useRouter } from "next/router";
import { getRequest } from "../api/api";
import useSWRImmutable from "swr/immutable";
import { DeskType } from "@utils/common/types";
import { useSocket } from "./WebsocketContext";
import { FC, useEffect, useState } from "react";
import { DeskCommonProps, DeskProvider } from "./DeskContext";
import { DEFAULT_DESK } from "@utils/common/constants";

export const DeskOnlineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);
  const socket = useSocket();
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

  //   console.log(desk);

  return desk._id ? (
    <DeskProvider
      desk={desk}
      socket={socket}
      setDesk={setDesk}
      children={children}
    />
  ) : null;
};
