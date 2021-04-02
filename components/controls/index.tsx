import { useReducer, useMemo, useCallback, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, NextRouter } from "next/router";

import { corral } from "cowsayjs/cows";
import { modes, modeFace, faceMode, CowModeData } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";

import { Radio } from "./radio";
import { Spinbox } from "./spinbox";
import { Checkbox } from "./checkbox";

import { parseData, CowParsedData } from "../../utils/parse";


/**
 * Controls component properties
 */
interface ControlsProps {
  readonly onChange?: (data: Required<CowParsedData>) => void;
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
        eyes: (eyes || ``).padEnd(2),
        tongue: (tongue || ``).padEnd(2)
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
const initializer = (query: NextRouter["query"]): State => {
  const data = parseData(query);
  const { message, cow = `default`, action = `say` } = data;
  let { mode = `u`, eyes = `oo`, tongue, wrap = 40 } = data;

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
    default: switch (wrap) {
      case false:
      case null: noWrap = true;

      // eslint-disable-next-line no-fallthrough
      default: wrap = 40;
    }
  }

  // Invalid wrap
  if (isNaN(wrap)) {
    wrap = 40;
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
 * Controls component
 *
 * @param props Controls component properties
 */
export const Controls = ({ onChange }: ControlsProps): JSX.Element => {
  const { query } = useRouter();
  const [ { message, cow, mode, eyes, tongue, wrap, noWrap, action }, dispatch ] = useReducer(reducer, query, initializer);


  // Cow options
  const cowOptions = useMemo(() =>
    corral.map(({ name }, i) => (
      <option key={i} value={name}>
        {`${name[0].toUpperCase()}${name.slice(1).replace(/[.-]/g, ` `)}`}
      </option>
    ))
  , []);

  // Modes options
  const modeOptions = useMemo(() =>
    [
      <option key={-1} value="c" hidden>Custom</option>,
      ...modes.map(({ id, name }, i) => (
        <option key={i} value={id}>
          {`${name[0].toUpperCase()}${name.slice(1)}`}
        </option>
      ))
    ]
  , []);


  // Submit handler
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  }, []);

  // Action change handler
  const handleActionChange = useCallback((action: CowAction): void => {
    dispatch({ type: `SET_ACTION`, payload: action });
  }, []);

  // Cow change handler
  const handleCowChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    dispatch({ type: `SET_COW`, payload: e.currentTarget.value });
  }, []);

  // Mode change handler
  const handleModeChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    dispatch({ type: `SET_MODE`, payload: e.currentTarget.value });
  }, []);

  // Tongue change handler
  const handleEyesChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { value, selectionStart } = e.currentTarget;
    dispatch({ type: `SET_EYES`, payload: value, meta: selectionStart });
  }, []);

  // Tongue change handler
  const handleTongueChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { value, selectionStart } = e.currentTarget;
    dispatch({ type: `SET_TONGUE`, payload: value, meta: selectionStart });
  }, []);

  // Wrap change handler
  const handleWrapChange = useCallback((value: number): void => {
    dispatch({ type: `SET_WRAP`, payload: value });
  }, []);

  // No wrap change handler
  const handleNoWrapChange = useCallback((value: boolean): void => {
    dispatch({ type: `SET_NO_WRAP`, payload: value });
  }, []);

  // Message change handler
  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch({ type: `SET_MESSAGE`, payload: e.currentTarget.value });
  }, []);


  // Focus the message text area
  useEffect((): void => {
    document.getElementById(`message`)?.focus();
  }, []);


  // Update cow
  useEffect((): void => {
    onChange?.({ message, action, mode: `u`, cow, eyes, tongue, wrap: noWrap ? false : wrap });
  }, [ message, cow, eyes, tongue, wrap, noWrap, action, onChange ]);


  // Return controls component
  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col p-2 w-full md:w-5/12 min-h-full">
      {/* Options */}
      <div className="leading-none">
        <div className="flex mb-2">
          {/* Cow */}
          <fieldset className="border border-white px-2 pb-2 w-5/12">
            <legend className="cursor-default px-1">
              <label htmlFor="cow">Cow</label>
            </legend>
            <select id="cow" value={cow} title={cow} onChange={handleCowChange} className="bg-transparent focus:bg-white text-white focus:text-black align-middle arrow-down-white focus:arrow-down-black bg-right bg-no-repeat focus:outline-none appearance-none pr-3 w-full">
              {cowOptions}
            </select>
          </fieldset>

          {/* Action */}
          <fieldset className="border border-white px-2 pb-2 ml-4 w-7/12">
            <legend className="cursor-default px-1">Action</legend>
            <div className="flex">
              <Radio name="action" id="say" value="say" checked={action === `say`} onChange={handleActionChange} className="w-3/7">
                Say
              </Radio>
              <Radio name="action" id="think" value="think" checked={action === `think`} onChange={handleActionChange} className="pl-2 w-4/7">
                Think
              </Radio>
            </div>
          </fieldset>
        </div>

        <div className="flex mb-2">
          {/* Mode */}
          <fieldset className="border border-white px-2 pb-2 w-5/12">
            <legend className="cursor-default px-1">
              <label htmlFor="mode">Mode</label>
            </legend>
            <select id="mode" value={mode} title={mode} onChange={handleModeChange} className="bg-transparent focus:bg-white text-white focus:text-black align-middle arrow-down-white focus:arrow-down-black bg-right bg-no-repeat focus:outline-none appearance-none pr-3 w-full">
              {modeOptions}
            </select>
          </fieldset>

          <div className="flex ml-4 w-7/12">
            {/* Eyes */}
            <fieldset className="border border-white px-2 pb-2 w-3/7">
              <legend className="cursor-default px-1">
                <label htmlFor="eyes">Eyes</label>
              </legend>
              <input id="eyes" type="text" value={eyes} autoCapitalize="none" spellCheck={false} onChange={handleEyesChange} className="bg-transparent text-white focus:outline-none w-full" />
            </fieldset>

            {/* Tongue */}
            <fieldset className="border border-white px-2 pb-2 ml-4 w-4/7">
              <legend className="cursor-default px-1">
                <label htmlFor="tongue">Tongue</label>
              </legend>
              <input id="tongue" type="text" value={tongue} autoCapitalize="none" spellCheck={false} onChange={handleTongueChange} className="bg-transparent text-white focus:outline-none w-full" />
            </fieldset>
          </div>
        </div>

        <div className="flex mb-2">
          {/* Wrap column */}
          <fieldset className="border border-white px-2 pb-2 w-full">
            <legend className="cursor-default px-1">
              <label htmlFor="wrap-col">Wrap column</label>
            </legend>
            <div className="flex">
              <Spinbox value={wrap} min={0} disabled={noWrap} onChange={handleWrapChange} className="pr-2 w-5/12" />
              <Checkbox id="no-wrap" checked={noWrap} onChange={handleNoWrapChange} className="pl-2 ml-4 w-7/12">
                No wrap
              </Checkbox>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Message */}
      <div className="md:flex-grow">
        <fieldset className="border border-white px-2 pb-2 mb-2 w-full md:h-full">
          <legend className="cursor-default px-1">
            <label htmlFor="message">Message</label>
          </legend>
          <textarea id="message" value={message} rows={1} autoCapitalize="none" spellCheck={false} autoFocus onChange={handleMessageChange} className="bg-black text-white focus:outline-none w-full min-h-20 md:min-h-full resize-y md:resize-none" />
        </fieldset>
      </div>
    </form>
  );
};
