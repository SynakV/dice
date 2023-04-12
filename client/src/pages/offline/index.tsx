import Head from "next/head";
import { Offline } from "@components/Mode/Offline/Offline";
import { GameProvider } from "@utils/contexts/GameContext";
import { DeskOfflineProvider } from "@utils/contexts/DeskOfflineProvider";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Offline</title>
      </Head>
      <GameProvider>
        <DeskOfflineProvider>
          <Offline />
        </DeskOfflineProvider>
      </GameProvider>
    </>
  );
}
