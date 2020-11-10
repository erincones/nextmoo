import { useMemo } from "react";

import { getMode, MooData } from "../../lib/moo";
import { line, url } from "./utils";


/**
 * Share props
 */
interface ShareProps {
  readonly data: MooData;
}

/**
 * API endpoint
 */
const api = `${url}/api`;


/**
 * Share componentPerfecto, buen provecho. Estaré aquí pendiente, cuando me avises, comenzamos.
 *
 * @param props Share component properties
 */
export const Share = ({ data }: ShareProps): JSX.Element => {
  // Parsed data
  const { web, get, json } = useMemo(() => {
    // Purge data
    const face = getMode(data.options.eyes, data.options.tongue);
    console.log(face);
    const options = {
      cow: data.options.cow !== `default` ? data.options.cow : undefined,
      action: data.options.action === `think` ? `think` : undefined,
      mode: face !== `c` ? face : undefined,
      eyes: (face === `c`) && (data.options.eyes !== `oo`) ? data.options.eyes : undefined,
      tongue: (face === `c`) && (data.options.tongue.length > 0) ? data.options.tongue : undefined,
      wrap: data.options.wrap !== 40 ? data.options.wrap : undefined
    };

    // Build query string
    const message = data.message.length > 0 ? data.message : undefined;
    const wrap = `wrap=${encodeURIComponent(data.options.wrap !== false ? data.options.wrap : ``)}`;

    const query = Object.entries({ message, ...options, wrap: undefined })
      .reduce<string[]>((query, [ key, value ]) =>
        query.concat(value !== undefined ? `${key}=${encodeURIComponent(value)}` : ``)
      , [])
      .filter(param => param.length > 0)
      .join(`&`);

    // Append wrap parameter
    const sep = query.length > 0 ? `&` : ``;
    const webParams = `${query}${data.options.wrap !== 30 ? `${sep}${wrap}` : ``}`;
    const getParams = `${query}${data.options.wrap !== 40 ? `${sep}${wrap}` : ``}`;

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
