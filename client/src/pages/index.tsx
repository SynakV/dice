import Head from "next/head";
import { Selector } from "@src/components/Selector/Selector";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dice</title>
      </Head>
      <Selector />
    </>
  );
}
