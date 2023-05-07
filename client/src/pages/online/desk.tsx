import Head from "next/head";
import { Online } from "@components/Mode/Online/Online";
import { SocketProvider } from "@utils/contexts/SocketContext";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online | Desk</title>
      </Head>
      <SocketProvider>
        <Online />
      </SocketProvider>
    </>
  );
}
