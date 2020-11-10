import { line, ul, item } from "./utils";


/**
 * License URL
 */
const url = `https://github.com/erincones/nextmoo/blob/master/LICENSE`;


/**
 * Help component
 */
export const Help = (): JSX.Element => {
  return (
    <pre className={line}>
      Moo! Developed by Erick Rincones.{`\n`}
      Special thanks to Aury Rincones.{`\n`}
      Licensed under the <a href={url} target="noopener noreferrer" className="underline focus:outline-none">MIT license</a>.{`\n`}
      {`\n`}
      These shell commands are defined internally. Type `help&apos; to see this list.{`\n`}
      {`\n`}
      <ul className={ul}>
        <li className={item}>clear</li>
        <li className={item}>echo [STRING]</li>
        <li className={item}>help</li>
        <li className={item}>history [-c]</li>
        <li className={item}>ls</li>
        <li className={item}>share</li>
        <li className={item}>sudo [COMMAND]</li>
      </ul>
    </pre>
  );
};
