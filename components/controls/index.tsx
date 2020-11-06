import { useState, useMemo, useCallback, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

import { Radio as Radio } from "./radio";
import { Spinbox } from "./spinbox";

import { cows, modes, getFace, getMode, MooOptions } from "../../lib/moo";
import { parseOptions } from "../../utils/parse-options";
import { Checkbox } from "./checkbox";


/**
 * Controls component properties
 */
interface ControlsProps {
  readonly onChange?: (message: string, options: MooOptions) => void;
}


/**
 * Clap string to the last two chars
 *
 * @param str String to clamp
 */
const clamp = (str: string, last = false) =>
  str.length < 3 ? str : last ? str.slice(str.length - 2, str.length) : str.slice(0, 2);


/**
 * Controls component
 *
 * @param props Controls component properties
 */
export const Controls = ({ onChange = () => { return; } }: ControlsProps): JSX.Element => {
  const router = useRouter();
  const [ action, setAction ] = useState<MooOptions["action"]>(`say`);
  const [ cow, setCow ] = useState(`default`);
  const [ mode, setMode ] = useState(`u`);
  const [ eyes, setEyes ] = useState(`oo`);
  const [ tongue, setTongue ] = useState(``);
  const [ wrapColumn, setWrapColumn ] = useState(30);
  const [ noWrap, setNoWrap ] = useState(false);
  const [ message, setMessage ] = useState(``);


  // Cows options
  const cowsOptions = useMemo(() =>
    cows.map(({ name }, i) => (
      <option key={i} value={name}>
        {`${name[0].toUpperCase()}${name.slice(1).replace(/[.-]/g, ` `)}`}
      </option>
    ))
  , []);

  // Modes options
  const modesOptions = useMemo(() =>
    [ <option key={-1} value="c" hidden>Custom</option> ].concat(modes.map(({ id, name }, i) => (
      <option key={i} value={id}>
        {`${name[0].toUpperCase()}${name.slice(1)}`}
      </option>
    )))
  , []);


  // Submit handler
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  // Cow change handler
  const handleCowChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setCow(e.currentTarget.value);
  }, []);

  // Mode change handler
  const handleModeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setMode(e.currentTarget.value);

    const face = getFace(e.currentTarget.value);
    setEyes(face.eyes);
    setTongue(face.tongue.padEnd(2));
  }, []);

  // Tongue change handler
  const handleEyesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const eyes = clamp(e.currentTarget.value, e.currentTarget.selectionStart > 2);

    setEyes(eyes);
    setMode(getMode(eyes, tongue));
  }, [ tongue ]);

  // Tongue change handler
  const handleTongueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const tongue = clamp(e.currentTarget.value, e.currentTarget.selectionStart > 2);

    setTongue(tongue);
    setMode(getMode(eyes, tongue));
  }, [ eyes ]);

  // Message change handler
  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }, []);


  // Initialize and focus message
  useEffect(() => {
    // Parse query string options
    const { message, options } = parseOptions(router.query);

    // Set given values
    setMessage(message === undefined ? `moo!` : message);

    if (options.action === `think`) {
      setAction(`think`);
    }

    if (cows.some(({ name }) => name === options.cow)) {
      setCow(options.cow);
    }

    if (router.query.wrap !== undefined) {
      if (options.wrap === false) {
        setNoWrap(true);
      }
      else {
        setWrapColumn(options.wrap < 0 ? 0 : options.wrap);
      }
    }

    if ((options.eyes !== undefined) || (options.tongue !== undefined)) {
      const eyes = options.eyes === undefined ? `oo` : options.eyes.slice(0, 2);
      const tongue = options.tongue === undefined ? `` : options.tongue.slice(0, 2);
      const mode = getMode(eyes, tongue);

      setMode(mode);
      setEyes(eyes);
      setTongue(tongue);
    }
    else if (modes.some(({ id }) => id === options.mode)) {
      const { eyes, tongue } = getFace(options.mode);

      setMode(options.mode);
      setEyes(eyes);
      setTongue(tongue);
    }


    // Focus message
    document.getElementById(`message`).focus();
  }, [ router ]);

  // Update cow
  useEffect(() => {
    onChange(message, { action, cow, eyes, tongue, wrap: noWrap ? false : wrapColumn });
  }, [ message, action, cow, eyes, tongue, wrapColumn, noWrap, onChange ]);


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
              {cowsOptions}
            </select>
          </fieldset>

          {/* Action */}
          <fieldset className="border border-white px-2 pb-2 ml-4 w-7/12">
            <legend className="cursor-default px-1">Action</legend>
            <div className="flex">
              <Radio name="action" id="say" checked={action === `say`} onChange={setAction} className="pr-2 w-3/7">
                Say
              </Radio>
              <Radio name="action" id="think" checked={action === `think`} onChange={setAction} className="pr-2 w-4/7">
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
              {modesOptions}
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
              <Spinbox value={wrapColumn} min={0} disabled={noWrap} onChange={setWrapColumn} className="pr-2 w-5/12" />
              <Checkbox id="no-wrap" checked={noWrap} onChange={setNoWrap} className="pl-2 ml-4 w-7/12">
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
          <textarea id="message" value={message} autoCapitalize="none" spellCheck={false} autoFocus onChange={handleMessageChange} className="bg-black text-white focus:outline-none w-full min-h-10 md:min-h-full resize-y md:resize-none" />
        </fieldset>
      </div>
    </form>
  );
};
