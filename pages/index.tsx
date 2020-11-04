import { useState } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ cow, setCow ] = useState(``);


  // Return the home component
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse md:min-h-screen">
        <Controls handleCow={setCow} />
        <Terminal cow={cow} />
      </div>
    </>
  );
};

export default Home;
