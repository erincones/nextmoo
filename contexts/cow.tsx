import { createContext, useRef, useReducer, useEffect, Dispatch, ReactNode } from "react";
import { parse } from "querystring";

import { CowAllOptions } from "cowsayjs";
import { modeFace, faceMode, CowFace } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";

import { normalizeCowData, purgeCowData, stringifyCowData, Data } from "../utils/parse";

import { Splash } from "../components/seo/splash";


/**
 * State
 */
export interface CowData extends Required<CowAllOptions> {
  readonly wrap: number;
  readonly noWrap: boolean;
}


/**
 * Cow provider properties
 */
interface CowProviderProps {
  readonly children: ReactNode;
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

/** Data action */
interface DataAction {
  readonly type: `SET_DATA`;
  readonly data: Readonly<Data | CowData>;
}

/** Action */
type Action = MessageAction | CowNameAction | ModeAction | EyesAction | TongueAction | WrapAction | ActionAction | NoWrapAction | DataAction;


/**
 * Initial cow
 */
const initial: CowData = {
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
const setMode = (cow: CowData, mode: string): CowData => {
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
const setFace = (cow: CowData, { type, cursor, ...data }: EyesAction | TongueAction): CowData => {
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
 * Set the given data to the cow
 *
 * @param data Cow data data
 */
const setData = (data: Readonly<Data>): CowData => {
  // Parse query string
  const cowData = normalizeCowData(data);
  const { message = initial.message, cow = initial.cow, action } = cowData;
  let { mode = initial.mode, eyes = initial.eyes, tongue, wrap } = cowData;


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
      noWrap = wrap === true;
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
 * @param state Current cow data
 * @param action Action
 * @returns New cow
 */
const reducer = (state: CowData, action: Action): CowData => {
  switch (action.type) {
    case `SET_MESSAGE`: return action.message !== state.message ? { ...state, message: action.message } : state;
    case `SET_COW`:     return action.cow     !== state.cow     ? { ...state, cow:     action.cow }     : state;
    case `SET_WRAP`:    return action.wrap    !== state.wrap    ? { ...state, wrap:    action.wrap }    : state;
    case `SET_NO_WRAP`: return action.noWrap  !== state.noWrap  ? { ...state, noWrap:  action.noWrap }  : state;
    case `SET_ACTION`:  return action.action  !== state.action  ? { ...state, action:  action.action }  : state;
    case `SET_MODE`:    return action.mode    !== state.mode    ? setMode(state, action.mode) : state;
    case `SET_EYES`:    return action.eyes    !== state.eyes    ? setFace(state, action) : state;
    case `SET_TONGUE`:  return action.tongue  !== state.tongue  ? setFace(state, action) : state;
    case `SET_DATA`:    return setData(action.data);
  }
};


/**
 * Cow context
 */
export const CowContext = createContext<[ CowData, Dispatch<Action> ]>([ initial, () => { return; } ]);

/**
 * Cow provider
 *
 * @param props Cow provider properties
 */
export const CowProvider = ({ children }: CowProviderProps): JSX.Element => {
  const first = useRef(true);
  const [ cowData, dispatch ] = useReducer(reducer, undefined as never);


  // Query string management
  useEffect(() => {
    // Get options from query string on first render
    if (first.current) {
      first.current = false;
      const query = location.search.slice(1);

      dispatch({ type: `SET_DATA`, data: query.length !== 0 ? parse(query) : initial });
    }

    // Update the query string with the current cow
    else {
      const data = purgeCowData(cowData, 30);

      if (data.message === undefined) data.message = ``;
      else if (data.message === `moo!`) delete data.message;

      history.replaceState(``, ``, `${location.origin}/${stringifyCowData(data)}`);
    }
  }, [ cowData ]);


  // Return the cow provider
  return (
    <CowContext.Provider value={[ cowData, dispatch ]}>
      {cowData !== undefined ? children : <Splash />}
    </CowContext.Provider>
  );
};
