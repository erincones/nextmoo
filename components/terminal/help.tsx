import { line, ul, item, repo } from "./utils";


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
      Next Moo! Developed by Erick Rincones. Special thanks to Aury Rincones.{`\n`}
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
