import { MooOptions } from "../types";


/**
 * Parse cow options
 *
 * @param opts Options
 */
export const parseOptions = (opts: { [key: string]: unknown }): MooOptions => {
  const { message, action, cow, mode, eyes, tongue, wrap } = opts;

  return {
    message: typeof message === `string` ? message : undefined,
    options: {
      action: action === `think` ? `think` : `say`,
      cow: typeof cow === `string` ? cow : undefined,
      mode:typeof mode === `string` ? mode : undefined,
      eyes: typeof eyes === `string` ? eyes : undefined,
      tongue: typeof tongue === `string` ? tongue : undefined,
      wrap: typeof wrap === `string` ? parseInt(wrap) :
        (typeof wrap === `number`) ||
        (typeof wrap === `boolean`) ||
        (wrap === null) ||
        (wrap === undefined) ? wrap : 40
    }
  };
};
