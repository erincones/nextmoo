import { ReactNode } from "react";
import { AppProps } from "next/app";

import "../styles/index.scss";


/**
 * Application component
 *
 * @param props application properties
 */
const App = ({ Component, pageProps }: AppProps): ReactNode => {
  return <Component {...pageProps} />;
};

export default App;
