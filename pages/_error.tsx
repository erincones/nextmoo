import { SEO } from "../components/seo";

import { cowsay } from "../lib/moo";


/**
 * Error 500 page properties
 */
interface Error500Props {
  readonly status: number;
}


/**
 * Parse HTTP status codes
 *
 * @param status HTTP status code
 */
const parseStatus = (status: number) => {
  switch (status) {
    case 500: return `500: Internal server error`;
    case 501: return `501: Not implemented`;
    case 502: return `502: Bad gateway`;
    case 503: return `503: Service unavailable`;
    case 504: return `504: Gateway timeout`;
    case 505: return `505: HTTP version not supported`;
    case 506: return `506: Variant also negotiates`;
    case 507: return `507: Insufficient storage`;
    case 508: return `508: Loop detected`;
    case 509: return `509: Bandwidth limit exceeded`;
    case 510: return `510: Not extended`;
    case 511: return `511: Network authentication required`;
    case 598: return `598: Network read timeout error`;
    case 599: return `599: Network connect timeout error`;
    default: `${status}: Unknown error`;
  }
};


/**
 * Error 500 page
 *
 * @param props Error 500 page properties
 */
const Error500 = ({ status }: Error500Props): JSX.Element => {
  return (
    <>
      <SEO title="Moo! - Server error" />

      <pre className="whitespace-pre overflow-x-auto ">
        {cowsay(parseStatus(status), { mode: `d` })}
      </pre>
    </>
  );
};

export default Error500;
