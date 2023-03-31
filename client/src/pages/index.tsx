import Head from "next/head";
import { Mode } from "@components/Mode/Mode";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dice</title>
      </Head>
      <Mode />
    </>
  );
}
