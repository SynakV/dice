import Head from "next/head";
import { Desks } from "@src/components/Desks/Desks";
import {
  socket,
  WebsocketProvider,
} from "@src/utils/contexts/WebsocketContext";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online</title>
      </Head>
      <WebsocketProvider value={socket}>
        <Desks />
      </WebsocketProvider>
    </>
  );
}
