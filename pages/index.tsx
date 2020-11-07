import { useState, useCallback, useEffect } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";

import { moo, MooOptions } from "../lib/moo";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ cow, setCow ] = useState(``);


  // Options change handler
  const handleOptionsHandler = useCallback((message: string, options: MooOptions) => {
    setCow(moo(message, options));
  }, []);


  // Scroll to top
  useEffect(() => {
    document.scrollingElement.scrollTop = 0;
  }, []);


  // Return the home component
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
        <Controls onChange={handleOptionsHandler} />
        <Terminal header={cow} />
      </div>
    </>
  );
};

export default Home;
