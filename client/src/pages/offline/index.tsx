import Head from "next/head";
import { Offline } from "@components/Mode/Offline/Offline";
import { DeskOfflineProvider } from "@utils/contexts/DeskOfflineProvider";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Offline</title>
      </Head>
      <DeskOfflineProvider>
        <Offline />
      </DeskOfflineProvider>
    </>
  );
}
