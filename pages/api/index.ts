import { NextApiRequest, NextApiResponse } from "next";

import { moo } from "cowsayjs";
import { parseBody } from "../../utils/parse-body";
import { parseOptions } from "../../utils/parse-options";


/**
 * Default api endpoint
 *
 * @param req Request
 * @param res Response
 */
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // Default headers
  res.setHeader(`Access-Control-Allow-Headers`, `X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version`);
  res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, HEAD, OPTIONS`);
  res.setHeader(`Access-Control-Allow-Origin`, `*`);


  // Moo options
  let options;

  // Check method
  switch (req.method) {
    // Default methods
    case `HEAD`:
    case `OPTIONS`: res.end(); return;

    // Allowed methods
    case `GET`: options = parseOptions(req.query); break;
    case `POST`: options = parseOptions(await parseBody(req)); break;

    // Unknown methods
    default: res.status(405).send(moo(`405: Method not allowed`)); return;
  }

  // Send cow
  res.setHeader(`Content-Type`, `text/plain`);
  res.send(moo(options.message, options.options));
};


/**
 * API configuration
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
