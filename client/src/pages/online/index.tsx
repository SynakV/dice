import Head from "next/head";
import { Desks } from "@src/components/Desks/Desks";
import { Navigator } from "@src/components/Shared/Navigator/Navigator";

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
