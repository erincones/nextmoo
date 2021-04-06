/**
 * Twitter card component
 */
export const TwitterCard = (): JSX.Element => {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Next Moo!" />
      <meta name="twitter:description" content="Another web version of cowsay powered by Next.js" />
      <meta name="twitter:creator" content="@ErickRincones" />
      <meta name="twitter:image" content="https://nextmoo.vercel.app/cover.png" />
    </>
  );
};
