import Head from "next/head";
import { Offline } from "@src/components/Mode/Offline/Offline";
import { DeskOfflineProvider } from "@src/utils/contexts/DeskContext";

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
