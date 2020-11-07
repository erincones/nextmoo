import { line } from "./utils";


/**
 * Line classes
 */
const item = `truncate pl-ch`;


/**
 * Help component
 */
export const Help = (): JSX.Element => (
  <>
    <pre className={line}>Moo! Developed by Erick Rincones.</pre>
    <pre className={line}>Special thanks to Aury Rincones.</pre>
    <pre className={line}>Licensed under the <a href="https://github.com/erincones/nextmoo/blob/master/LICENSE" target="noopener noreferrer" className="underline focus:outline-none">MIT license</a>.</pre>
    <pre className={line}>{`\n`}</pre>
    <pre className={line}>These shell commands are defined internally. Type `help&apos; to see this list.</pre>
    <pre className={line}>{`\n`}</pre>
    <pre className={line}>
      <ul className="columns-2 gap-0 w-max-content max-w-full">
        <li className={item}>clear</li>
        <li className={item}>echo [STRING]</li>
        <li className={item}>help</li>
        <li className={item}>history [-c]</li>
        <li className={item}>ls</li>
        <li className={item}>sudo [COMMAND]</li>
      </ul>
    </pre>
  </>
);
