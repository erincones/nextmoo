import { line } from "./utils";


/**
 * History component properties
 */
interface HistoryProps {
  readonly workspace: string[];
  readonly history: string[];
}


/**
 * History component
 *
 * @param props History component properties
 */
export const History = ({ workspace, history }: HistoryProps): JSX.Element => {
  const min = workspace.length.toString().length;
  const padding = min < 5 ? 5 : min;

  // Return history component
  return (
    <>
      {workspace.slice(0, -1).map((command, i) => {
        const index = (i + 1).toString().padStart(padding);
        const diff = command !== history[i] ? `* ` : `  `;

        return (
          <pre key={i} className={line}>
            {`${index}${diff}${command}`}
          </pre>
        );
      })}
    </>
  );
};
