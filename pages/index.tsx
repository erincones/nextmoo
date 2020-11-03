import { useState } from "react";

import { SEO } from "../components/seo";
import { Controls } from "../components/controls";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  const [ cow, setCow ] = useState(``);

  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse md:min-h-screen">
        {/* Controls */}
        <Controls handleCow={setCow} />

        {/* Terminal */}
        <div className="flex flex-col cursor-text px-px w-full md:w-7/12">
          <pre className="select-all whitespace-pre overflow-x-auto">{cow}</pre>
          <div className="flex flex-col flex-grow">
            <pre className="break-all whitespace-pre-wrap"><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>help</pre>
            <pre className="break-all whitespace-pre-wrap">Moo! Developed by Erick Rincones.</pre>
            <pre className="break-all whitespace-pre-wrap">Special thanks to Aury Rincones.</pre>
            <pre className="break-all whitespace-pre-wrap">Licensed under the <a href="#" className="underline focus:outline-none">MIT license</a>.</pre>
            <pre className="break-all whitespace-pre-wrap">{`\n`}</pre>
            <pre className="break-all whitespace-pre-wrap">These shell commands are defined internally. Type `help&apos; to see this list.</pre>
            <pre className="break-all whitespace-pre-wrap">{`\n`}</pre>
            <pre className="break-all whitespace-pre-wrap">
              <ul className="columns-2 gap-0 w-max-content max-w-full">
                <li className="truncate pl-ch">clear</li>
                <li className="truncate pl-ch">echo [STRING]</li>
                <li className="truncate pl-ch">help</li>
                <li className="truncate pl-ch">history [-c]</li>
                <li className="truncate pl-ch">ls</li>
                <li className="truncate pl-ch">sudo [COMMAND]</li>
              </ul>
            </pre>

            <pre className="break-all whitespace-pre-wrap"><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>sudo su</pre>

            <pre className="break-all whitespace-pre-wrap"><strong><span className="text-red-light">[localhost</span><span className="text-cyan-light"> moo</span><span className="text-red-light">]#</span> </strong>exit</pre>
            <pre className="break-all whitespace-pre-wrap">exit</pre>

            <pre className="break-all whitespace-pre-wrap"><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>cd here</pre>
            <pre className="break-all whitespace-pre-wrap">moo!: cd: command not found</pre>

            <div className="flex-grow">
              <pre className="inline break-all whitespace-pre-wrap"><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong></pre>
              <pre autoCapitalize="none" spellCheck={false} contentEditable tabIndex={0} className="inline bg-black text-white break-all whitespace-pre-wrap focus:outline-none w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
