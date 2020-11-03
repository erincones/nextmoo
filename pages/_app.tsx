import { ReactNode } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

import "../styles/index.scss";


/**
 * Application component
 *
 * @param props application properties
 */
const App = ({ Component, pageProps }: AppProps): ReactNode => {
  return (
    <>
      <Head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />

        <meta name="application-name" content="Moo!" />
        <meta name="author" content="Erick Rincones" />
        <meta name="description" content="Another web version of cowsay powered by Next.js" />
        <meta name="generator" content="Next.js" />
        <meta name="keywords" content="cowsay, cowthing, moo, web, online, custom" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" type="image/x-icon" sizes="16x16" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
