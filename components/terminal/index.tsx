import { useState, useCallback, KeyboardEvent, ClipboardEvent } from "react";
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
  const handleTerminalClick = useCallback(() => {
    document.getElementById(`command`).focus();
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


  // Return terminal
  return (
    <div className="flex flex-col cursor-text px-px w-full md:w-7/12">
      <pre className="select-all whitespace-pre overflow-x-auto">{cow}</pre>
      <div onClick={handleTerminalClick} className="flex flex-col flex-grow">
        {output}
        <div className="flex-grow">
          <Prompt className="inline break-all whitespace-pre-wrap" />
          <pre id="command" autoCapitalize="none" spellCheck={false} contentEditable tabIndex={0} onKeyDown={handleCommandKeyDown} onPaste={handleCommandPaste} className="inline bg-black text-white break-all whitespace-pre-wrap focus:outline-none w-full" />
        </div>
      </div>
    </div>
  );
};
