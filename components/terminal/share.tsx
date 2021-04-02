import { useMemo } from "react";

import { CowParsedData } from "../../utils/parse";

import { faceMode } from "cowsayjs/lib/mode";
import { line, url } from "./utils";


/**
 * Share props
 */
interface ShareProps {
  readonly data: CowParsedData;
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
  const { web, get, json } = useMemo(() => {
    const face = faceMode({ eyes: data.eyes, tongue: data.tongue });
    const mode = face.id !== `u` ? face.id : undefined;
    const custom = mode === `c`;

    const options = {
      cow: data.cow !== `default` ? data.cow : undefined,
      mode: custom ? mode : undefined,
      eyes: custom && (data.eyes !== `oo`) ? data.eyes : undefined,
      tongue: custom && data.tongue ? data.tongue : undefined,
      wrap: `${data.wrap}` !== `40` ? data.wrap : undefined,
      action: data.action === `think` ? `think` : undefined
    };

    // Build query string
    const message = data.message ? data.message : undefined;
    const wrap = `wrap=${encodeURIComponent(data.wrap !== false && data.wrap !== null && data.wrap !== undefined ? data.wrap : ``)}`;

    const query = Object.entries({ message, ...options, wrap: undefined })
      .reduce<string[]>((query, [ key, value ]) =>
        query.concat(value !== undefined ? `${key}=${encodeURIComponent(value).replaceAll(`%20`, `+`)}` : ``)
      , [])
      .filter(param => param.length > 0)
      .join(`&`);

    // Append wrap parameter
    const sep = query.length > 0 ? `&` : ``;
    const webParams = `${query}${data.wrap !== 30 ? `${sep}${wrap}` : ``}`;
    const getParams = `${query}${data.wrap !== 40 ? `${sep}${wrap}` : ``}`;

    // JSON POST
    const post = { message, ...options };

    // Return share options
    return {
      web: `${url}${webParams.length > 0 ? `?${webParams}` : ``}`,
      get: `${api}${getParams.length > 0 ? `?${getParams}` : ``}`,
      json: JSON.stringify(post)
    };
  }, [ data ]);


  // Return share component
  return (
    <pre className={line}>
      &nbsp;Web: <span className="select-all"><a href={web} target="noopener noreferrer" className="underline focus:outline-none">{web}</a></span>{`\n`}
      &nbsp;GET: <span className="select-all">curl &apos;<a href={get} target="noopener noreferrer" className="underline focus:outline-none">{get}</a>&apos;</span>{`\n`}
      &nbsp;POST: <span className="select-all">curl <a href={api} target="noopener noreferrer" className="underline focus:outline-none">{api}</a> -X POST -d &apos;{json}&apos;</span>
    </pre>
  );
};
