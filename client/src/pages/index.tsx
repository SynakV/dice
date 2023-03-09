import Head from "next/head";
import { Layout } from "@src/components/Layout/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dice</title>
        <meta name="description" content="Dice game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout />
    </>
  );
}
