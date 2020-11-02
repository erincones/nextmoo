import Head from "next/head";


/**
 * SEO properties
 */
interface SEOProps {
  title: string
}


/**
 * SEO component
 *
 * @param props SEO properties
 */
export const SEO = ({ title }: SEOProps): JSX.Element => (
  <Head>
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />

    <meta name="application-name" content="Moo!" />
    <meta name="author" content="Erick Rincones" />
    <meta name="description" content="Another web version of cowsay powered by Next.js" />
    <meta name="generator" content="Next.js" />
    <meta name="keywords" content="cowsay, cowthing, moo, web, online, custom" />
    <meta name="theme-color" content="#000000" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Moo!" />
    <meta name="twitter:description" content="Another web version of cowsay powered by Next.js" />
    <meta name="twitter:creator" content="@ErickRincones" />
    <meta name="twitter:image" content="" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Moo!" />
    <meta property="og:description" content="Another web version of cowsay powered by Next.js" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="" />
    <meta property="og:image:width" content="1920" />
    <meta property="og:image:height" content="1080" />

    <title>{title}</title>

    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
    <link rel="shortcut icon" type="image/x-icon" sizes="16x16" href="/favicon.ico" />

    <link rel="manifest" href="/manifest.json" />
  </Head>
);
