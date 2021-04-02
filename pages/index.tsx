import { useState, useCallback } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";

import { CowParsedData } from "../utils/parse";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ data, setData ] = useState<Required<CowParsedData>>({ eyes: ``, tongue: `` } as never);


  // Data change handler
  const handleDataChange = useCallback((data: Required<CowParsedData>) => {
    setData(data);
  }, []);


  // Return the home component
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
        <Controls onChange={handleDataChange} />
        <Terminal data={data} />
      </div>
    </>
  );
};

export default Home;
