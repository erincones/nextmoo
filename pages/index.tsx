import { Store } from "../contexts/store";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";


/**
 * Home component
 */
const Home = (): JSX.Element => {

  // Return the home component
  return (
    <Store>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
        <Controls/>
        <Terminal/>
      </div>
    </Store>
  );
};

export default Home;
