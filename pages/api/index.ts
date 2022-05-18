import { NextApiRequest, NextApiResponse } from "next";

import { moo } from "cowsayjs";
import { parseBody, normalizeAPICowData } from "../../utils/parse";


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


  // Moo data
  let data;

  // Check method
  switch (req.method) {
    // Default methods
    case `HEAD`:
    case `OPTIONS`: res.end(); return;

    // Allowed methods
    case `GET`: data = normalizeAPICowData(req.query); break;
    case `POST`: data = normalizeAPICowData(await parseBody(req)); break;

    // Unknown methods
    default:
      res.setHeader(`Content-Type`, `text/plain; charset=utf-8`);
      res.status(405).send(moo(`405: Method not allowed`, { mode: `s` }));
      return;
  }


  // Prepare options
  const { message, json, ...options } = data;

  // Send cow
  if (json) {
    res.setHeader(`Content-Type`, `application/json; charset=utf-8`);
    res.send({ res: moo(message, options), req: data });
  }
  else {
    res.setHeader(`Content-Type`, `text/plain; charset=utf-8`);
    res.send(`${moo(message, options)}\n`);
  }
};


/**
 * API configuration
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
