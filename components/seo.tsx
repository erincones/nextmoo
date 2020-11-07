import { useMemo } from "react";
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
 * @param props SEO component properties
 */
export const SEO = ({ title, twitterCard = true, openGraph = true }: SEOProps): JSX.Element => {
  // Twiter card
  const tw = useMemo(() =>
    twitterCard === undefined ? null : (
      <>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Moo!" />
        <meta name="twitter:description" content="Another web version of cowsay powered by Next.js" />
        <meta name="twitter:creator" content="@ErickRincones" />
        <meta name="twitter:image" content="https://nextmoo.vercel.app/cover.png" />
      </>
    )
  , [ twitterCard ]);

  // Open graph
  const og = useMemo(() =>
    openGraph === undefined ? null : (
      <>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Moo!" />
        <meta property="og:description" content="Another web version of cowsay powered by Next.js" />
        <meta property="og:url" content="https://nextmoo.vercel.app" />
        <meta property="og:image" content="https://nextmoo.vercel.app/cover.png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
      </>
    )
  , [ openGraph ]);


  // Return SEO component
  return (
    <Head>
      {/* Twitter card and Open graph */}
      {tw}
      {og}

      {/* Title and manifest */}
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};
