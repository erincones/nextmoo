import { NextApiRequest } from "next";
import { CowFullOptions } from "cowsayjs";
import { stringify } from "querystring";

import { CowData } from "../contexts/cow";


/**
 * Data
 */
export interface Data {
  [key: string]: unknown;
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
export const parseBody = (req: NextApiRequest): Promise<Readonly<Data>> => (
  new Promise<Readonly<Data>>(resolve => {
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
export const normalizeCowData = ({ message, cow = `default`, mode = `u`, eyes = `oo`, tongue, wrap, action = `say` }: Data): CowParsedData => ({
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


/**
 * Remove default cow values
 *
 * @param cowData Cow data
 * @param defWrap Default wrap
 */
export const purgeCowData = ({ message, cow, mode, eyes, tongue, wrap, action, noWrap }: CowData, defWrap = 40): CowParsedData => {
  const data: CowParsedData = {};

  if (message !== `moo!`) data.message = message;
  if (cow !== `default`)  data.cow = cow;

  if ((mode !== `c`) && (mode !== `u`)) data.mode = mode;
  else {
    if ((eyes.length !== 0) && (eyes !== `oo`)) data.eyes = eyes.padEnd(2);
    if (tongue.length !== 0) data.tongue = tongue.padEnd(2);
  }

  if (noWrap) data.wrap = ``;
  else if (wrap !== defWrap) data.wrap = wrap;

  if (action !== `say`) data.action = action;

  return data;
};

/**
 * Parse cow data object to query string
 *
 * @param data Cow data
 */
export const stringifyCowData = (cow: CowParsedData, browser = true): string => {
  // Stringify
  const query = stringify(cow as never);

  if (query.length === 0) {
    return ``;
  }

  // Adjust
  return browser ?
    `?${query}`.replaceAll(`%20`, `+`).replaceAll(`.`, `%2E`) :
    `?${query}`;
};
