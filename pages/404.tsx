import { SEO } from "../components/seo";

import { cowsay } from "../lib/moo";


/**
 * Error 404 page
 */
const Error404 = (): JSX.Element => {
  return (
    <>
      <SEO title="Moo! - Not found" />

      <pre className="whitespace-pre overflow-x-auto ">
        {cowsay(`404: Not found`, { mode: `d` })}
      </pre>
    </>
  );
};

export default Error404;
