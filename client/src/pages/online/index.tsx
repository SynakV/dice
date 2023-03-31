import Head from "next/head";
import { Desks } from "@components/Desks/Desks";
import { Navigator } from "@components/Shared/Navigator/Navigator";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online</title>
      </Head>
      <Desks />
      <Navigator text="Home" />
    </>
  );
}
