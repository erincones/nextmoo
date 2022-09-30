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
        <main className="flex flex-col md:flex-row-reverse md:overflow-hidden min-h-screen md:max-h-screen w-full h-full">
          <Controls />
          <Terminal />
        </main>
      </CowProvider>
    </>
  );
};

export default Home;
