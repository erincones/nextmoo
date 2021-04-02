import { useState, useMemo, useCallback, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

import { CowAction } from "cowsayjs/lib/box";
import { MooOptions } from "../../types";

import { corral } from "cowsayjs/cows";
import { modes, modeFace, faceMode } from "cowsayjs/lib/mode";


import { Radio } from "./radio";
import { Spinbox } from "./spinbox";
import { Checkbox } from "./checkbox";

import { parseOptions } from "../../utils/parse-options";


/**
 * Controls component properties
 */
interface ControlsProps {
  readonly onChange?: (data: MooOptions) => void;
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
  const [ action, setAction ] = useState<CowAction>(`say`);
  const [ cow, setCow ] = useState(`default`);
  const [ mode, setMode ] = useState(`u`);
  const [ eyes, setEyes ] = useState(`oo`);
  const [ tongue, setTongue ] = useState(``);
  const [ wrapColumn, setWrapColumn ] = useState(30);
  const [ noWrap, setNoWrap ] = useState(false);
  const [ message, setMessage ] = useState(``);


  // Cows options
  const cowsOptions = useMemo(() =>
    corral.map(({ name }, i) => (
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

    const face = modeFace(e.currentTarget.value);
    setEyes(face.eyes || ``);
    setTongue(face.tongue || ``);
  }, []);

  // Tongue change handler
  const handleEyesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.currentTarget;
    const eyes = clamp(value, selectionStart !== null ? selectionStart > 2 : false);
    const mode = faceMode({ eyes, tongue });

    setEyes(eyes);
    setMode((mode.eyes === eyes) && (mode.tongue) === tongue ? mode.id : `c`);
  }, [ tongue ]);

  // Tongue change handler
  const handleTongueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.currentTarget;
    const tongue = clamp(value, selectionStart !== null ? selectionStart > 2 : false);
    const mode = faceMode({ eyes, tongue });

    setTongue(tongue);
    setMode((mode.eyes === eyes) && (mode.tongue) === tongue ? mode.id : `c`);
  }, [ eyes ]);

  // Message change handler
  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }, []);


  // Initialize values from query string
  useEffect(() => {
    // Parse query string options
    const { message, options } = parseOptions(router.query);
    const opts = options || {};

    // Set given values
    setMessage(message === undefined ? `moo!` : message);

    if (opts.action === `think`) {
      setAction(`think`);
    }

    if (corral.some(({ name }) => name === opts.cow)) {
      setCow(opts.cow || `default`);
    }

    if (opts.wrap !== undefined) {
      if ((opts.wrap === false) || (opts.wrap === null)) {
        setNoWrap(true);
      }
      else {
        const wrap = typeof opts.wrap === `string` ? parseInt(opts.wrap) : opts.wrap;
        const column = wrap === true || isNaN(wrap) ? 40 : wrap;
        setWrapColumn(column < 0 ? 0 : column);
      }
    }

    if ((opts.eyes !== undefined) || (opts.tongue !== undefined)) {
      const eyes = opts.eyes === undefined ? `oo` : opts.eyes.slice(0, 2);
      const tongue = opts.tongue === undefined ? `` : opts.tongue.slice(0, 2);
      const mode = faceMode({ eyes, tongue });

      setMode((mode.eyes === eyes) && (mode.tongue) === tongue ? mode.id : `c`);
      setEyes(eyes);
      setTongue(tongue);
    }
    else if (modes.some(({ id }) => id === opts.mode)) {
      const { eyes, tongue } = modeFace(opts.mode);

      setMode(opts.mode || `d`);
      setEyes(eyes || `oo`);
      setTongue(tongue || ``);
    }


    // Focus message
    document.getElementById(`message`)?.focus();
  }, [ router ]);

  // Update cow
  useEffect(() => {
    onChange({ message, options: { action, cow, eyes, tongue, wrap: noWrap ? false : wrapColumn } });
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
              <Radio name="action" id="say" value={`say` as CowAction} checked={action === `say`} onChange={setAction} className="w-3/7">
                Say
              </Radio>
              <Radio name="action" id="think" value={`think` as CowAction} checked={action === `think`} onChange={setAction} className="pl-2 w-4/7">
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
          <textarea id="message" value={message} rows={1} autoCapitalize="none" spellCheck={false} autoFocus onChange={handleMessageChange} className="bg-black text-white focus:outline-none w-full min-h-20 md:min-h-full resize-y md:resize-none" />
        </fieldset>
      </div>
    </form>
  );
};
