import { line } from "./utils";

/**
 * Bad component properties
 */
interface BadProps {
  readonly shell?: string;
  readonly command: string;
  readonly message: string;
}


/**
 * Bad component
 *
 * @param props Bad component properties
 */
export const Bad = ({ shell = `bash`, command, message }: BadProps): JSX.Element => {
  return <pre className={line}>{`${shell}: ${command}: ${message}`}</pre>;
};
