import Head from 'next/head'
import '../styles/globals.css'
import "../styles/game.scss"

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
        <title>2048</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
