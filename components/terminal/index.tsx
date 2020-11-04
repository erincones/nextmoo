import { useState, useCallback, KeyboardEvent, ClipboardEvent, MouseEvent } from "react";

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
  const [ output, setOutput ] = useState<JSX.Element[]>([]);


  // Terminal click handler
  const handleTerminalClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      document.getElementById(`command`).focus();
    }
  }, []);


  // Command key down handler
  const handleCommandKeyDown = useCallback((e: KeyboardEvent<HTMLPreElement>) => {
    if (e.key === `Enter`) {
      e.preventDefault();

      // Get command and update output
      const command = e.currentTarget.textContent;

      setOutput(output => output.concat(
        <Prompt key={output.length} className="break-all whitespace-pre-wrap">
          {command}
        </Prompt>
      ));

      // Clean command
      e.currentTarget.textContent = ``;
      e.currentTarget.scrollIntoView(true);
    }
  }, []);

  // Command paste handler
  const handleCommandPaste = useCallback((e: ClipboardEvent<HTMLPreElement>) => {
    console.log(e.clipboardData.getData(`text/plain`));
  }, []);


  // Return terminal component
  return (
    <div className="flex flex-col flex-grow cursor-text px-px w-full md:w-7/12">
      {/* Cow */}
      <pre className="md:flex-shrink-0 select-all whitespace-pre overflow-x-auto overflow-y-visible">
        {cow}
      </pre>

      {/* Output and input */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        {output}

        <div onClick={handleTerminalClick} className="flex-grow">
          <Prompt className="inline break-all whitespace-pre-wrap" />
          <pre id="command" autoCapitalize="none" spellCheck={false} contentEditable tabIndex={0} onKeyDown={handleCommandKeyDown} onPaste={handleCommandPaste} className="inline bg-black text-white break-all whitespace-pre-wrap focus:outline-none w-full" />
        </div>
      </div>
    </div>
  );
};
