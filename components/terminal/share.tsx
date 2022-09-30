import { useMemo } from "react";

import { CowData } from "../../contexts/cow";
import { purgeCowData, stringifyCowData } from "../../utils/parse";

import { line, url } from "./utils";

/**
 * Share props
 */
interface ShareProps {
  readonly data: CowData;
}

/**
 * API endpoint
 */
const api = `${url}/api`;

/**
 * Share component
 *
 * @param props Share component properties
 */
export const Share = ({ data }: ShareProps): JSX.Element => {
  // Parsed data
  const [web, get, post] = useMemo(() => {
    // API data
    const json = purgeCowData(data);
    const post = JSON.stringify(json);
    const get = stringifyCowData(json);

    // Web data
    if (json.message === undefined) json.message = ``;
    else if (json.message === `moo!`) delete json.message;

    if (json.wrap === undefined) json.wrap = 40;
    else if (json.wrap === 30) delete json.wrap;

    const web = stringifyCowData(json);

    // Return share options
    return [`${url}/${web}`, `${api}${get}`, post];
  }, [data]);

  // Return share component
  return (
    <pre className={line}>
      &nbsp;Web:{` `}
      <span className="select-all">
        <a
          href={web}
          target="noopener noreferrer"
          className="underline focus:outline-none"
        >
          {web}
        </a>
      </span>
      {`\n`}
      &nbsp;GET:{` `}
      <span className="select-all">
        curl &apos;
        <a
          href={get}
          target="noopener noreferrer"
          className="underline focus:outline-none"
        >
          {get}
        </a>
        &apos;
      </span>
      {`\n`}
      &nbsp;POST:{` `}
      <span className="select-all">
        curl{` `}
        <a
          href={api}
          target="noopener noreferrer"
          className="underline focus:outline-none"
        >
          {api}
        </a>
        {` -X POST -d '${post}'`}
      </span>
    </pre>
  );
};
