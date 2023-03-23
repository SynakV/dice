import Head from "next/head";
import { Online } from "@src/components/Online/Online";
import { DeskProvider } from "@src/utils/contexts/DeskContext";
import { WebsocketProvider } from "@src/utils/contexts/WebsocketContext";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online | Desk</title>
      </Head>
      <WebsocketProvider>
        <DeskProvider>
          <Online />
        </DeskProvider>
      </WebsocketProvider>
    </>
  );
}
