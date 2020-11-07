import { useState, useCallback, ChangeEvent, useEffect, SyntheticEvent } from "react";

import { Prompt } from "./prompt";


/**
 * Terminal component properties
 */
interface TerminalProps {
  readonly cow?: string;
}


/**
 * Terminal component
 *
 * @param props Terminal component properties
 */
export const Terminal = ({ cow }: TerminalProps): JSX.Element => {
  const [ height, setHeight ] = useState<number>();
  const [ padding, setPadding ] = useState(``);
  const [ command, setCommand ] = useState(``);
  const [ output, setOutput ] = useState<JSX.Element[]>([]);


  // ChangeHandler
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    // Update command
    if (!/\r\n|[\n\r\f\v\u2028\u2029\u0085]/.test(e.currentTarget.value)) {
      const value = e.currentTarget.value;
      setCommand(command => value.startsWith(padding) ? value : command);
    }

    // Process command
    else {
      const command = e.currentTarget.value.slice(padding.length);

      setOutput(output => output.concat(
        <Prompt key={output.length} path="moo" className="break-all whitespace-pre-wrap">
          {command}
        </Prompt>
      ));

      setCommand(``);
      setHeight(undefined);
    }
  }, [ padding ]);

  // Select handler
  const handleSelect = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.selectionStart < padding.length) {
      e.currentTarget.selectionStart = padding.length;
    }
  }, [ padding ]);


  // Update command padding
  useEffect(() => {
    const padding = ` `.repeat(document.getElementById(`prompt`).innerText.length);

    setPadding(padding);
    setCommand(padding);
    document.getElementById(`command`).scrollIntoView(true);
  }, [ output ]);

  // Adjust the command height
  useEffect(() => {
    const { clientHeight, scrollHeight } = document.getElementById(`command`);
    setHeight(height => (height !== undefined) || (clientHeight < scrollHeight) ? scrollHeight : height);
  }, [ command ]);


  // Return terminal component
  return (
    <div className="flex flex-col flex-grow cursor-text px-px w-full md:w-7/12">
      {/* Cow */}
      <pre className="md:flex-shrink-0 select-all whitespace-pre overflow-x-auto overflow-y-visible">
        {cow}
      </pre>

      {/* Output and input */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Prompt path="moo" className="break-all whitespace-pre-wrap">help</Prompt>
        <pre className="break-all whitespace-pre-wrap">Moo! Developed by Erick Rincones.</pre>
        <pre className="break-all whitespace-pre-wrap">Special thanks to Aury Rincones.</pre>
        <pre className="break-all whitespace-pre-wrap">Licensed under the <a href="#" className="underline focus:outline-none">MIT license</a>.</pre>
        {output}

        <div className="relative flex flex-grow">
          <Prompt id="prompt" path="moo" className="absolute top-0 left-0 break-all whitespace-pre-wrap" />
          <textarea id="command" value={command} rows={1} autoCapitalize="none" spellCheck={false} onChange={handleChange} onSelect={handleSelect} className="flex-grow bg-black text-white break-all whitespace-pre-wrap focus:outline-none resize-none w-full" style={{ height }} />
        </div>
      </div>
    </div>
  );
};
