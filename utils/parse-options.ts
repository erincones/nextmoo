import { MooOptions } from "../lib/moo";


/**
 * Moo options
 */
export interface Options {
  readonly message: string;
  readonly options: MooOptions;
}


/**
 * Parse cow options
 *
 * @param opts Options
 */
export const parseOptions = (opts: {[key: string]: unknown}): Options => {
  const wrap = opts.wrap === undefined ? 40 : typeof opts.wrap === `number` ? opts.wrap : typeof opts.wrap === `string` ? parseInt(opts.wrap) : NaN;

  return {
    message: typeof opts.message === `string` ? opts.message : undefined,
    options: {
      action: opts?.action === `think` ? `think` : `say`,
      cow: typeof opts.cow === `string` ? opts.cow : undefined,
      mode:typeof opts.mode === `string` ? opts.mode as MooOptions["mode"] : undefined,
      eyes: typeof opts.eyes === `string` ? opts.eyes : undefined,
      tongue: typeof opts.tongue === `string` ? opts.tongue : undefined,
      wrap: isNaN(wrap) ? false : wrap < 0 ? 0 : wrap
    }
  };
};
