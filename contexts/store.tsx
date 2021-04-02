import { createContext, useReducer, Dispatch, ReactNode } from "react";
import { parse, ParsedUrlQuery } from "querystring";

import { modeFace, faceMode, CowModeData } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";
import { parseData, CowParsedData } from "../utils/parse";

import { useLayoutEffect } from "../hooks/effect";


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
 * Initializser action
 */
interface InitializerAction extends BaseAction {
  readonly type: `INITIALIZE`;
  readonly payload: ParsedUrlQuery;
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
type Action = InitializerAction | StringAction | FaceAction | NumberAction | BooleanAction;



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
  const { message: imsg, cow: f, mode: m, eyes: e, tongue: t, wrap: w, action: a } = initialState;
  let { message, cow, mode, eyes, tongue, wrap, action } = {} as Partial<CowParsedData>;
  let data: CowParsedData;

  const spaces = /^\s*$/;
  let prop: string;
  let len: number;
  let shift: boolean;
  let face: Partial<CowModeData>;
  let noWrap: boolean;


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
      ({ eyes = ``, tongue = `` } = modeFace(payload as string));
      return {
        ...state,
        mode: payload as string,
        eyes,
        tongue
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
      face = faceMode({ eyes, tongue });
      face.eyes = face.eyes || e;
      tongue = spaces.test(tongue) ? undefined : tongue;

      if ((face.eyes !== eyes) || (face.tongue !== tongue)) {
        face.id = `c`;
      }

      // Update mode and face
      return {
        ...state,
        mode: face.id as string,
        [type === `SET_EYES` ? `eyes` : `tongue`]: prop
      };

    // Initialize
    case `INITIALIZE`:
      // Parse query string
      data = parseData(payload as ParsedUrlQuery);

      ({ message = imsg, cow = f, action = a } = data);
      ({ mode = m, eyes = e, tongue, wrap = w } = data);


      // Setup face and mode
      face = modeFace(mode);
      face.eyes = face.eyes || e;

      if ((eyes !== face.eyes) || (tongue !== face.tongue)) {
        mode = `c`;
        eyes = face.eyes !== undefined ? face.eyes : eyes;
        tongue = face.tongue !== undefined ? face.tongue : tongue;
      }

      // Setup wrap
      noWrap = false;

      switch (typeof wrap) {
        case `number`: break;
        case `string`: wrap = parseInt(wrap); break;
        default:
          noWrap = wrap !== true;
          wrap = w;
      }

      // Invalid wrap
      if (isNaN(wrap)) {
        wrap = w;
        noWrap = true;
      }

      // Return initial state
      return {
        message,
        cow,
        mode,
        eyes: eyes.slice(0, 2),
        tongue: (tongue || t).slice(0, 2),
        wrap,
        action,
        noWrap
      };

    // Unknown
    default: return initialState;
  }
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
  const [ state, dispatch ] = useReducer(reducer, initialState);


  // Setup state from query
  useLayoutEffect(() => {
    dispatch({
      type: `INITIALIZE`,
      payload: typeof window !== `undefined` ?
        parse(window.location.search.slice(1)) : {}
    });
  }, []);


  // Return store provider
  return (
    <store.Provider value={{ state, dispatch }}>
      {children}
    </store.Provider>
  );
};

