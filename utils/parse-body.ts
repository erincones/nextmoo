import { NextApiRequest } from "next";


/**
 * Parse body to JSON
 *
 * @param req Request
 */
export const parseBody = (req: NextApiRequest): Promise<{ [key: string]: unknown }> => (
  new Promise<{ [key: string]: unknown }>(resolve => {
    // Data stream
    req.body = [];

    req.once(`data`, chunk => {
      // Accumulate data
      req.body.push(chunk);
    }).once(`end`, () => {
      // Parse data to string
      const body = Buffer.concat(req.body).toString();

      // Try to parse data to JSON and resolve
      try { req.body = JSON.parse(body); }
      catch { req.body = { message: body }; }
      finally { resolve(req.body); }
    });
  })
);
