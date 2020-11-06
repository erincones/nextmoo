import { NextApiRequest, NextApiResponse } from "next";

import { moo } from "../../lib/moo";
import { parseOptions } from "../../utils/parse-options";


/**
 * Default api endpoint
 *
 * @param req Request
 * @param res Response
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
  // Default content type
  res.setHeader(`Content-Type`, `text/plain`);

  // Check method
  if ((req.method !== `GET`) && (req.method !== `POST`) && (req.method !== `HEAD`)) {
    res.statusCode = 405;
    res.send(moo(`405: Method Not Allowed`));
  }

  // Send cow
  const { message, options} = parseOptions(req.method === `GET` ? req.query : req.body);
  res.send(moo(message, options));
};
