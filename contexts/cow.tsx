import { createContext, useReducer, Dispatch, ReactNode } from "react";
import { parse } from "querystring";

import { modeFace, faceMode, CowFace } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";

import { parseData, Data, CowParsedData } from "../utils/parse";


/**
 * Cow provider properties
 */
interface CowProviderProps {
  readonly children: ReactNode;
}


/**
 * State
 */
 interface CowOptions extends Required<CowParsedData> {
  readonly wrap: number;
  readonly noWrap: boolean;
}


/** Message action */
interface MessageAction {
  readonly type: `SET_MESSAGE`;
  readonly message: string;
}

/** Cow name action */
interface CowNameAction {
  readonly type: `SET_COW`;
  readonly cow: string;
}

/** Mode action */
interface ModeAction {
  readonly type: `SET_MODE`;
  readonly mode: string;
}

/** Eyes action */
interface EyesAction {
  readonly type: `SET_EYES`;
  readonly eyes: string;
  readonly cursor: number | null;
}

/** Tongue action */
interface TongueAction {
  readonly type: `SET_TONGUE`;
  readonly tongue: string;
  readonly cursor: number | null;
}

/** Wrap action */
interface WrapAction {
  readonly type: `SET_WRAP`;
  readonly wrap: number;
}

/** Action action */
interface ActionAction {
  readonly type: `SET_ACTION`;
  readonly action: CowAction;
}

/** No wrap action */
interface NoWrapAction {
  readonly type: `SET_NO_WRAP`;
  readonly noWrap: boolean;
}

/** Options action */
interface OptionsAction {
  readonly type: `SET_OPTIONS`;
  readonly options: Data;
}

/** Action */
type Action = MessageAction | CowNameAction | ModeAction | EyesAction | TongueAction | WrapAction | ActionAction | NoWrapAction | OptionsAction;


/**
 * Initial cow
 */
const initial: CowOptions = {
  message: `moo!`,
  cow: `default`,
  mode: `u`,
  eyes: `oo`,
  tongue: ``,
  wrap: 30,
  action: `say`,
  noWrap: false
};


/**
 * Set the cow face and mode
 *
 * @param cow Current cow
 * @param mode Cow mode
 */
const setMode = (cow: CowOptions, mode: string): CowOptions => {
  const { eyes, tongue } = modeFace(mode);

  return {
    ...cow,
    mode,
    eyes: eyes || initial.eyes,
    tongue: tongue || initial.tongue
  };
};

/**
 * Set the cow face and mode
 *
 * @param cow Current cow
 * @param face Face data
 */
const setFace = (cow: CowOptions, { type, cursor, ...data }: EyesAction | TongueAction): CowOptions => {
  // Select property
  const { eyes = cow.eyes, tongue = cow.tongue } = data as Required<CowFace>;
  let prop = type === `SET_EYES` ? eyes : tongue;

  if (prop.length > 2) {
    prop = (cursor !== null) && (cursor > 2) ?
      prop.slice(prop.length - 2, prop.length) :
      prop.slice(0, 2);
  }

  const face = type === `SET_EYES` ?
    { eyes: prop, tongue: cow.tongue } :
    { eyes: cow.eyes, tongue: prop };


  // Check mode
  const t = /^\s*$/.test(face.tongue) ? undefined : face.tongue.padEnd(2);
  const mode = faceMode({ eyes: face.eyes, tongue: t });

  if ((mode.id === `u`) && ((initial.eyes !== face.eyes) || (initial.tongue === face.tongue.trimStart()))) {
    mode.id = `c`;
  }

  // Update mode and face
  return { ...cow, ...face, mode: mode.id };
};

/**
 * Set the given options to the cow
 *
 * @param opts Cow options data
 */
const setOptions = (data: Data): CowOptions => {
  // Parse query string
  const options = parseData(data);
  const { message = initial.message, cow = initial.cow, action } = options;
  let { mode = initial.mode, eyes = initial.eyes, tongue, wrap } = options;


  // Setup face and mode
  const face = modeFace(mode);
  face.eyes = face.eyes || initial.eyes;

  if ((eyes !== face.eyes) || (tongue !== face.tongue)) {
    mode = `c`;
    eyes = face.eyes !== undefined ? face.eyes : eyes;
    tongue = face.tongue !== undefined ? face.tongue : tongue;
  }

  // Setup wrap
  let noWrap = false;

  switch (typeof wrap) {
    case `number`: break;
    case `string`: wrap = parseInt(wrap); break;
    default:
      noWrap = wrap !== true;
      wrap = initial.wrap;
  }

  // Invalid wrap
  if (isNaN(wrap)) {
    wrap = initial.wrap;
    noWrap = true;
  }

  // Return initial state
  return {
    message,
    cow,
    mode,
    eyes: eyes.slice(0, 2),
    tongue: (tongue || initial.tongue).slice(0, 2),
    wrap,
    action: action || initial.action,
    noWrap
  };
};


/**
 * Cow reducer function
 *
 * @param state Current cow options
 * @param action Action
 * @returns New cow
 */
const reducer = (state: CowOptions, action: Action): CowOptions => {
  // Apply
  switch (action.type) {
    case `SET_MESSAGE`: return { ...state, message: action.message };
    case `SET_COW`:     return { ...state, cow:     action.cow };
    case `SET_WRAP`:    return { ...state, wrap:    action.wrap };
    case `SET_NO_WRAP`: return { ...state, noWrap:  action.noWrap };
    case `SET_ACTION`:  return { ...state, action:  action.action };
    case `SET_MODE`:    return setMode(state, action.mode);
    case `SET_EYES`:    return setFace(state, action);
    case `SET_TONGUE`:  return setFace(state, action);
    case `SET_OPTIONS`: return setOptions(action.options);
  }
};

/**
 * Initialize the cow options with the givin data
 */
const initializer = (): CowOptions => {
  const data = typeof window !== `undefined` ?
    parse(window.location.search.slice(1)) :
    {};

  return setOptions(data);
};


/**
 * Cow context
 */
export const CowContext = createContext<[ CowOptions, Dispatch<Action> ]>([ initial, () => { return; } ]);

/**
 * Cow provider
 *
 * @param props Cow provider properties
 */
export const CowProvider = ({ children }: CowProviderProps): JSX.Element => {
  const [ cowOptions, dispatch ] = useReducer(reducer, undefined, initializer);

  // Return the cow provider
  return (
    <CowContext.Provider value={[ cowOptions, dispatch ]}>
      {children}
    </CowContext.Provider>
  );
};

