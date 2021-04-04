import { NextApiRequest } from "next";
import { CowFullOptions } from "cowsayjs";


/**
 * Data
 */
export interface Data {
  readonly [key: string]: unknown;
}

/**
 * Cow parsed data
 */
export interface CowParsedData extends CowFullOptions {
  message?: string;
}


/**
 * Parse body to JSON
 *
 * @param req Request
 */
export const parseBody = (req: NextApiRequest): Promise<Data> => (
  new Promise<Data>(resolve => {
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

/**
 * Parse cow options
 *
 * @param opts Options
 */
export const parseData = ({ message, cow = `default`, mode = `u`, eyes = `oo`, tongue, wrap, action = `say` }: Data): CowParsedData => ({
  message: typeof message === `string` ? message : undefined,
  cow: typeof cow === `string` ? cow : `default`,
  mode:typeof mode === `string` ? mode : `u`,
  eyes: typeof eyes === `string` ? eyes : `oo`,
  tongue: typeof tongue === `string` ? tongue : undefined,
  wrap: (typeof wrap === `string`) ||
    (typeof wrap === `number`) ||
    (typeof wrap === `boolean`) ||
    (wrap === null) ||
    (wrap === undefined) ? wrap : false,
  action: action === `think` ? `think` : `say`
});
