import { line } from "./utils";

/**
 * Bad component properties
 */
interface BadProps {
  readonly shell?: string;
  readonly command: string;
  readonly locked?: boolean;
}


/**
 * Bad component
 *
 * @param props Bad component properties
 */
export const Bad = ({ shell = `shell`, command, locked = false }: BadProps): JSX.Element => {
  return locked === true ?
    <pre className={line}>{shell}: {command}: Operation not permitted</pre> :
    <pre className={line}>{shell}: {command}: Command not found</pre>;
};
