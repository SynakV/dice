import Head from "next/head";
import { io } from "socket.io-client";
import { server } from "@utils/api/api";
import { Online } from "@components/Mode/Online/Online";
import { GameProvider } from "@utils/contexts/GameContext";
import { DeskOnlineProvider } from "@utils/contexts/DeskOnlineProvider";

const socket = io(server);

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online | Desk</title>
      </Head>
      <GameProvider>
        <DeskOnlineProvider socket={socket}>
          <Online />
        </DeskOnlineProvider>
      </GameProvider>
    </>
  );
}
