import Head from "next/head";
import { Online } from "@src/components/Mode/Online/Online";
import { DeskOnlineProvider } from "@src/utils/contexts/DeskContext";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online | Desk</title>
      </Head>
      <DeskOnlineProvider>
        <Online />
      </DeskOnlineProvider>
    </>
  );
}
