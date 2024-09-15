import type { AppProps } from "next/app";
import Head from "next/head";

/**
 * Import global styles, global css or polyfills here
 * i.e.: import '@/assets/theme/style.scss'
 */
import "../styles/global.css";

/**
 * @link https://nextjs.org/docs/advanced-features/custom-app
 */
const App = (appProps: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, pageProps } = appProps;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
