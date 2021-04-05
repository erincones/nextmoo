import Head from "next/head";

import { OpenGraph } from "./open-graph";
import { TwitterCard } from "./twitter";


/**
 * SEO properties
 */
interface SEOProps {
  readonly title: string,
  readonly twitterCard?: boolean,
  readonly openGraph?: boolean
}


/**
 * SEO component
 *
 * @param props SEO component properties
 */
export const SEO = ({ title, twitterCard = true, openGraph = true }: SEOProps): JSX.Element => {
  return (
    <Head>
      {/* Twitter card and Open graph */}
      {twitterCard && <TwitterCard />}
      {openGraph && <OpenGraph />}

      {/* Title and manifest */}
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};
