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
        {/* Meta tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
