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
      <Head />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default CustomDocument;
