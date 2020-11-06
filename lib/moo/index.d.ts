/**
 * Cow face interface
 */
export interface Face {
  readonly eyes: string;
  readonly tongue: string;
}

/**
 * cowsay and cowthink options interface
 */
export interface CowOptions extends Partial<Face> {
  readonly cow?: string;
  readonly mode?: `u` | `b` | `d` | `g` | `p` | `s` | `t` | `w` | `y`;
  readonly wrap?: number | false;
}

/**
 * cowsay and cowthink options interface
 */
export interface MooOptions extends CowOptions {
  readonly action?: `say` | `think`;
}

/**
 * Cow interface
 */
export interface Cow {
  readonly name: string;
  readonly cow: (action: MooOptions["action"], eyes?: string, tongue?: string) => string;
}

/**
 * Cow mode interface
 */
interface Mode extends Face {
  readonly id: CowOptions["mode"];
  readonly name: string;
}


/**
 * Cows array
 */
export const cows: Cow[];

/**
 * Cows modes
 */
export const modes: Mode[];


/**
 * Create cow
 *
 * @param message Cow message
 * @param options Cow options
 */
export function moo(message: string, options?: MooOptions): string;

/**
* Create thinkg cow
*
* @param message Cow message
* @param options Cow options
*/
export function cowsay(message: string, options?: CowOptions): string;

/**
 * Create thinkig cow
 *
 * @param message Cow message
 * @param options Cow options
 */
export function cowthink(message: string, options?: CowOptions): string;


/**
* Get mode from face
*
* @param eyes Face eyes
* @param tongue Face tongue
*/
export function getMode(eyes: string, tongue: string): MooOptions["mode"] | `c`;

/**
* Get face from cow mode
*
* @param mode Cow mode
*/
export function getFace(mode: string): Face;
