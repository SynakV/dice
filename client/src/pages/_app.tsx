import Head from "next/head";
import "@styles/styles.scss";
import type { AppProps } from "next/app";
import { Layout } from "@components/Shared/Layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
