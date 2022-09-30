import { ul, item } from "./utils";

/**
 * Folder style
 */
const folder = `font-bold text-blue-light ${item}`;

/**
 * Ls component
 */
export const Ls = (): JSX.Element => {
  return (
    <ul className={`-ml-ch ${ul}`}>
      <li className={folder}>.</li>
      <li className={folder}>..</li>
    </ul>
  );
};
