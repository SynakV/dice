import Head from "next/head";
import { Game } from "@src/components/Game/Game";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Desk</title>
      </Head>
      <Game />
    </>
  );
}
