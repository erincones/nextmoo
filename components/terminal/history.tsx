import { Stack } from "../../hooks/history";

import { line } from "./utils";


/**
 * History component properties
 */
interface HistoryProps {
  stack: Stack;
}


/**
 * History component
 *
 * @param props History component properties
 */
export const History = ({ stack }: HistoryProps): JSX.Element => {
  const min = stack.stack.length.toString().length;
  const padding = min < 5 ? 5 : min;

  // Return history component
  return (
    <>
      {(stack.stack.length === 0) && stack.stack.map((command, i) => (
        <pre key={i} className={line}>
          {(i + 1).toString().padStart(padding)}  {command}
        </pre>
      ))}
    </>
  );
};
