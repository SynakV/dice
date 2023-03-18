import type { AppProps } from "next/app";
import "@src/styles/styles.scss";
import {
  socket,
  WebsocketProvider,
} from "@src/utils/contexts/WebsocketContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WebsocketProvider value={socket}>
      <Component {...pageProps} />
    </WebsocketProvider>
  );
}
