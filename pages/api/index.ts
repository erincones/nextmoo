import { NextApiRequest, NextApiResponse } from "next";

import { moo } from "../../lib/moo";
import { parseOptions, Options } from "../../utils/parse-options";


/**
 * Default api endpoint
 *
 * @param req Request
 * @param res Response
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
  // Default headers
  res.setHeader(`Access-Control-Allow-Methods`, `HEAD,OPTIONS,GET,POST`);
  res.setHeader(`Access-Control-Allow-Origin`, `*`);


  // Moo options
  let options: Options;

  // Check method
  switch (req.method) {
    // Default methods
    case `HEAD`:
    case `OPTIONS`: res.end(); return;

    // Allowed methods
    case `GET`: options = parseOptions(req.query); break;
    case `POST`: options = parseOptions(req.body); break;

    // Unknown methods
    default: res.status(405).send(moo(`405: Method not allowed`)); return;
  }

  // Send cow
  res.setHeader(`Content-Type`, `text/plain`);
  res.send(moo(options.message, options.options));
};
