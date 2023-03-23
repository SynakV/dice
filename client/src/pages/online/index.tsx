import Head from "next/head";
import { Desks } from "@src/components/Desks/Desks";

export default function Page() {
  return (
    <>
      <Head>
        <title>Dice | Online</title>
      </Head>
      <Desks />
    </>
  );
}
