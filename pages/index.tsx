import { useState, useCallback } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";

import { MooData } from "../lib/moo";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ mooData, setMooData ] = useState<MooData>({ message: `` });


  // Options change handler
  const handleOptionsHandler = useCallback((mooData: MooData) => {
    setMooData(mooData);
  }, []);


  // Return the home component
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
        <Controls onChange={handleOptionsHandler} />
        <Terminal data={mooData} />
      </div>
    </>
  );
};

export default Home;
