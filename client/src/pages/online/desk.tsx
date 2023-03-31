import Head from "next/head";
import { Online } from "@components/Mode/Online/Online";
import { DeskOnlineProvider } from "@utils/contexts/DeskContext";

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
