import cows from "./cows";
import { balloon } from "./balloon";
import { getFace } from "./modes";

export { default as cows } from "./cows";
export { modes, getFace, getMode } from "./modes";


/**
 * @typedef CowOptions cowsay and cowthink options
 * @property {string} [cow] Cow name
 * @property {`u` | `b` | `d` | `g` | `p` | `s` | `t` | `w` | `y`} [mode] Cowsay face mode
 * @property {string} [eyes] Cow eyes
 * @property {string} [tongue] Cow tongue
 * @property {number | false} [wrap] Wrap column
 */

/**
 * @typedef Actions Moo actions
 * @property {`say` | `think`} [action] Cow action
 *
 * @typedef {CowOptions & Actions} MooOptions cowsay and cowthink options
 */


/**
 * Default cow
 */
const defaultCow = cows.find(cow => cow.name === `default`);


/**
 * Create cow
 *
 * @param {string} message Cow message
 * @param {MooOptions} [options] Cow options
 *
 * @returns {string} Cow
 */
export const moo = (message, { action = `say`, cow, mode, eyes = `oo`, tongue = ``, wrap = 40 } = {}) => {
  // Get cow and face
  const { cow: moo } = cows.find(({ name }) => name === cow) || defaultCow;
  let { eyes: e, tongue: t } = getFace(mode);

  // Override default properties
  e = mode === undefined ? eyes : e;
  t = t.length === 0 ? tongue : t;

  // Truncate and pad face properties
  e = e.slice(0, 2).padEnd(2);
  t = t.slice(0, 2).padEnd(2);

  // Return cow
  return `${balloon(action, message, wrap)}\n${moo(action === `think` ? `o` : `\\`, e, t)}`;
};

/**
 * Create saying cow
 *
 * @param {string} message Cow message
 * @param {CowOptions} [options] Cow options
 *
 * @returns {string} Cow
 */
export const cowsay = (message, options) => moo(message, options);

/**
 * Create thinking cow
 *
 * @param {string} message Cow message
 * @param {CowOptions} [options] Cow options
 *
 * @returns {string} Cow
 */
export const cowthink = (message, options = {}) => moo(message, { action: `think`, ...options });
