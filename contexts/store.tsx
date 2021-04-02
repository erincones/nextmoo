import { createContext, useReducer, Dispatch, ReactNode } from "react";
import { useRouter, NextRouter } from "next/router";

import { modeFace, faceMode, CowModeData } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";
import { parseData, CowParsedData } from "../utils/parse";


/**
 * Store provider properties
 */
interface StoreProps {
  readonly children: ReactNode;
}

/**
 * Store value
 */
 interface StoreValue {
  readonly state: State;
  readonly dispatch: Dispatch<Action>;
}


/**
 * State
 */
 interface State extends Required<CowParsedData> {
  readonly wrap: number;
  readonly noWrap: boolean;
}

/**
 * Base action
 */
interface BaseAction {
  readonly type: string;
  readonly payload?: unknown;
  readonly meta?: unknown;
  readonly error?: boolean;
}

/**
 * String actions
 */
interface StringAction extends BaseAction {
  readonly type: `SET_MESSAGE` | `SET_COW` | `SET_MODE` | `SET_ACTION`;
  readonly payload: string;
}

/**
 * Face actions
 */
interface FaceAction extends BaseAction {
  readonly type: `SET_EYES` | `SET_TONGUE`;
  readonly payload: string;
  readonly meta: number | null;
}

/**
 * Number action
 */
 interface NumberAction extends BaseAction {
  readonly type: `SET_WRAP`;
  readonly payload: number;
}

/**
 * Boolean action
 */
interface BooleanAction extends BaseAction {
  readonly type: `SET_NO_WRAP`;
  readonly payload: boolean;
}

/**
 * Action
 */
type Action = StringAction | FaceAction | NumberAction | BooleanAction;



/**
 * Initial state arguments
 */
const initialState: State = {
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
 * Controller reducer function
 *
 * @param state Current state
 * @param action Action
 * @returns New state
 */
const reducer = (state: State, { type, payload, meta }: Action): State => {
  let eyes: string | undefined;
  let tongue: string | undefined;

  const spaces = /^\s*$/;
  let prop: string;
  let len: number;
  let shift: boolean;
  let mode: CowModeData;


  // Apply
  switch (type) {
    // Simple assignations
    case `SET_MESSAGE`: return { ...state, message: payload as string };
    case `SET_COW`:     return { ...state, cow:     payload as string };
    case `SET_WRAP`:    return { ...state, wrap:    payload as number };
    case `SET_NO_WRAP`: return { ...state, noWrap:  payload as boolean };
    case `SET_ACTION`:  return { ...state, action:  payload as CowAction };

    // Mode
    case `SET_MODE`:
      ({ eyes, tongue } = modeFace(payload as string));
      return {
        ...state,
        mode: payload as string,
        eyes: eyes || ``,
        tongue: tongue || ``
      };

    // Face and mode
    case `SET_EYES`:
    case `SET_TONGUE`:
      prop = payload as string;
      len = prop.length;

      // Clamp property
      if (len > 2) {
        shift = (typeof meta === `number`) && (meta > 2);
        prop = shift ? prop.slice(len - 2, len) : prop.slice(0, 2);
      }

      // Select property and process
      ({ eyes, tongue } = type === `SET_EYES` ?
        { eyes: prop, tongue: state.tongue } :
        { eyes: state.eyes, tongue: prop });


      // Check mode
      mode = faceMode({ eyes, tongue });
      mode.eyes = mode.eyes || `oo`;
      tongue = spaces.test(tongue) ? undefined : tongue;

      if ((mode.eyes !== eyes) || (mode.tongue !== tongue)) {
        mode.id = `c`;
      }

      // Update mode and face
      return {
        ...state,
        mode: mode.id,
        [type === `SET_EYES` ? `eyes` : `tongue`]: prop
      };
  }
};


/**
 *
 * @param param Cow parsed data
 * @returns Initial state
 */
const initializer = ({ query }: NextRouter): State => {
  const data = parseData(query);
  const { message, cow = `default`, action = `say` } = data;
  let { mode = `u`, eyes = `oo`, tongue, wrap = 30 } = data;

  // Setup face and mode
  const face = modeFace(mode);
  face.eyes = face.eyes || `oo`;

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
      wrap = 30;
  }

  // Invalid wrap
  if (isNaN(wrap)) {
    wrap = 30;
    noWrap = true;
  }


  // Return initial state
  return {
    message: message || `moo!`,
    cow: cow || `default`,
    mode,
    eyes: eyes.slice(0, 2),
    tongue: (tongue || ``).slice(0, 2),
    wrap,
    action,
    noWrap
  };
};


/**
 * Store context
 */
export const store = createContext<StoreValue>({
  state: initialState,
  dispatch: () => { return; }
});

/**
 * Store provider
 *
 * @param props Store provider properties
 */
export const Store = ({ children }: StoreProps): JSX.Element => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, router, initializer);

  // Return store provider
  return (
    <store.Provider value={{ state, dispatch }}>
      {children}
    </store.Provider>
  );
};

