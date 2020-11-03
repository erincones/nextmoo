import Head from "next/head";


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
 * @param props SEO properties
 */
export const SEO = ({ title, twitterCard = true, openGraph = true }: SEOProps): JSX.Element => {
  return (
    <Head>
      {twitterCard &&
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Moo!" />
          <meta name="twitter:description" content="Another web version of cowsay powered by Next.js" />
          <meta name="twitter:creator" content="@ErickRincones" />
          <meta name="twitter:image" content="" />
        </>
      }

      {openGraph &&
        <>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Moo!" />
          <meta property="og:description" content="Another web version of cowsay powered by Next.js" />
          <meta property="og:url" content="" />
          <meta property="og:image" content="" />
          <meta property="og:image:width" content="1920" />
          <meta property="og:image:height" content="1080" />
        </>
      }

      <title>{title}</title>

      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};
