import Document, { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Document class
 */
class CustomDocument extends Document {
  /**
   * Render component
   */
  render = (): JSX.Element => (
    <Html lang="en">
      <Head>
        {/* Meta tags */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <meta name="application-name" content="NextMoo!" />
        <meta name="author" content="Erick Rincones" />
        <meta
          name="description"
          content="Another web version of cowsay powered by Next.js"
        />
        <meta name="generator" content="Next.js" />
        <meta
          name="keywords"
          content="cowsay, cowthing, moo, web, online, custom"
        />
        <meta name="theme-color" content="#000000" />

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          sizes="16x16"
          href="/favicon.ico"
        />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default CustomDocument;
