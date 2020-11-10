import { line, ul, item, repo } from "./utils";


/**
 * License URL
 */
const license = `${repo}/blob/master/LICENSE`;

/**
 * README URL
 */
const readme = `${repo}#readme`;


/**
 * Help component
 */
export const Help = (): JSX.Element => {
  return (
    <pre className={line}>
      Moo! Developed by Erick Rincones.{`\n`}
      Special thanks to Aury Rincones.{`\n`}
      Licensed under the <a href={license} target="noopener noreferrer" className="underline focus:outline-none">MIT license</a>.{`\n`}
      For more details visit: <a href={readme} target="noopener noreferrer" className="underline focus:outline-none">{readme}</a>{`\n`}
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
