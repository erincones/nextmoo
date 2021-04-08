/**
 * Open graph component
 */
export const OpenGraph = (): JSX.Element => {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:title" content="NextMoo!" />
      <meta property="og:description" content="Another web version of cowsay powered by Next.js" />
      <meta property="og:url" content="https://nextmoo.vercel.app" />
      <meta property="og:image" content="https://nextmoo.vercel.app/cover.png" />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
    </>
  );
};
