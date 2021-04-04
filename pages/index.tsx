import { CowProvider } from "../contexts/cow";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";
import { Terminal } from "../components/terminal";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  return (
    <>
      <SEO title="NextMoo!" />

      <CowProvider>
        <div className="flex flex-col md:flex-row-reverse min-h-screen md:max-h-screen">
          <Controls/>
          <Terminal/>
        </div>
      </CowProvider>
    </>
  );
};

export default Home;
