import Head from "next/head";
import "../styles/globals.css";
import "../styles/game.scss";
import "../styles/game_mobile.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>2048</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
