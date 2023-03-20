import Head from "next/head";
import { Game } from "@src/components/Game/Game";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Offline</title>
      </Head>
      <Game />
    </>
  );
}
