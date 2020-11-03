import { SEO } from "../components/seo";


/**
 * Home component
 */
const Home = (): JSX.Element => {
  return (
    <>
      <SEO title="Moo!" />

      <div className="flex flex-col md:flex-row-reverse w-screen">
        {/* Controls */}
        <div className="flex flex-col p-2 w-full md:w-5/12 md:h-screen">
          {/* Options */}
          <div className="leading-none">
            <div className="flex mb-2">
              {/* Cow */}
              <fieldset className="border border-white px-2 pb-2 w-5/12">
                <legend className="cursor-default px-1">
                  <label htmlFor="cow">Cow</label>
                </legend>
                <select id="cow" className="bg-transparent text-white align-middle focus:bg-white focus:text-black focus:outline-none appearance-none w-full">
                  <option>Default</option>
                </select>
              </fieldset>

              {/* Action */}
              <fieldset className="border border-white px-2 pb-2 ml-4 w-7/12">
                <legend className="cursor-default px-1">Action</legend>
                <div className="flex">
                  <div className="bg-transparent pr-2 w-3/7">
                    <input id="say" type="radio" checked={true} className="hidden" />
                    <label htmlFor="say">
                      <span className="cursor-pointer">(<span tabIndex={0} className="whitespace-pre focus:bg-white focus:text-black">{`*`}</span>)</span>Say
                    </label>
                  </div>
                  <div className="bg-transparent ml-4 w-4/7">
                    <input id="think" type="radio" checked={false} className="hidden" />
                    <label htmlFor="think">
                      <span className="cursor-pointer">(<span tabIndex={0} className="whitespace-pre focus:bg-white focus:text-black">{` `}</span>)</span>Think
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex mb-2">
              {/* Mode */}
              <fieldset className="border border-white px-2 pb-2 w-5/12">
                <legend className="cursor-default px-1">
                  <label htmlFor="mode">Mode</label>
                </legend>
                <select id="mode" className="bg-transparent text-white align-middle focus:bg-white focus:text-black focus:outline-none appearance-none w-full">
                  <option>Default</option>
                </select>
              </fieldset>

              <div className="flex ml-4 w-7/12">
                {/* Eyes */}
                <fieldset className="border border-white px-2 pb-2 w-3/7">
                  <legend className="cursor-default px-1">
                    <label htmlFor="eyes">Eyes</label>
                  </legend>
                  <input id="eyes" type="text" value="oo" maxLength={2} autoCapitalize="off" spellCheck={false} className="bg-transparent text-white focus:outline-none w-full" />
                </fieldset>

                {/* Eyes */}
                <fieldset className="border border-white px-2 pb-2 ml-4 w-4/7">
                  <legend className="cursor-default px-1">
                    <label htmlFor="tongue">Tongue</label>
                  </legend>
                  <input id="tongue" type="text" value="" maxLength={2} autoCapitalize="off" spellCheck={false} className="bg-transparent text-white focus:outline-none w-full" />
                </fieldset>
              </div>
            </div>

            <div className="flex mb-2">
              {/* Wrap column */}
              <fieldset className="border border-white px-2 pb-2 w-full">
                <legend className="cursor-default px-1">
                  <label htmlFor="wrap-col">Wrap column</label>
                </legend>
                <div className="flex">
                  <input id="wrap-col" type="number" inputMode="numeric" value={30} min={0} step={0} className="bg-transparent text-white focus:outline-none appearance-none pr-2 w-5/12" />
                  <div className="bg-transparent pl-2 ml-4 w-7/12">
                    <input id="no-wrap" type="checkbox" checked={false} className="hidden" />
                    <label htmlFor="no-wrap">
                      <span className="cursor-pointer">[<span tabIndex={0} className="whitespace-pre focus:bg-white focus:text-black">{` `}</span>]</span>No wrap
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Message */}
          <div className="md:flex-grow">
            <fieldset className="border border-white px-2 pb-2 mb-2 w-full md:h-full">
              <legend className="cursor-default px-1">
                <label htmlFor="message">Message</label>
              </legend>
              <textarea id="message" value="moo!" autoCapitalize="off" spellCheck={false} className="bg-black text-white focus:outline-none w-full min-h-10 md:min-h-full resize-y md:resize-none" />
            </fieldset>
          </div>
        </div>

        {/* Terminal */}
        <div className="break-all whitespace-pre-wrap cursor-text px-px w-full md:w-7/12">
          <pre className="overflow-x-auto">{` ______\n< moo! >\n ------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n`}</pre>
          <div>
            <pre><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>help</pre>
            <pre>Moo! Developed by Erick Rincones.</pre>
            <pre>Special thanks to Aury Rincones.</pre>
            <pre>Licensed under the <a href="#" className="underline">MIT license</a>.</pre>
            <pre>{`\n`}</pre>
            <pre>These shell commands are defined internally. Type `help&apos; to see this list.</pre>
            <pre>{`\n`}</pre>
            <pre>
              <ul className="columns-2 gap-0 w-max-content max-w-full">
                <li className="pl-ch">clear</li>
                <li className="pl-ch">echo [STRING]</li>
                <li className="pl-ch">help</li>
                <li className="pl-ch">history [-c]</li>
                <li className="pl-ch">ls</li>
                <li className="pl-ch">sudo [COMMAND]</li>
              </ul>
            </pre>

            <pre><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>sudo su</pre>

            <pre><strong><span className="text-red-light">[localhost</span><span className="text-cyan-light"> moo</span><span className="text-red-light">]#</span> </strong>exit</pre>
            <pre>exit</pre>

            <pre><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong>cd here</pre>
            <pre>moo!: cd: command not found</pre>

            <pre><strong><span className="text-green-light">[user@localhost</span> moo<span className="text-green-light">]$</span> </strong></pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
