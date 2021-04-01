import { useState, useCallback } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";

import { MooOptions } from "../types";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ mooData, setMooData ] = useState<MooOptions>({});


  // Data change handler
  const handleDataChange = useCallback((data: MooOptions) => {
    setMooData(data);
  }, []);


  // Return the home component
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
        <Controls onChange={handleDataChange} />
        <Terminal data={mooData} />
      </div>
    </>
  );
};

export default Home;
