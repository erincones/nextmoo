import { useContext, useMemo, useCallback, useEffect, ChangeEvent, FormEvent } from "react";

import { CowContext } from "../../contexts/cow";

import { corral } from "cowsayjs/cows";
import { modes } from "cowsayjs/lib/mode";
import { CowAction } from "cowsayjs/lib/box";

import { Radio } from "./radio";
import { Spinbox } from "./spinbox";
import { Checkbox } from "./checkbox";


/**
 * Controls component
 *
 * @param props Controls component properties
 */
export const Controls = (): JSX.Element => {
  const [ cowData, dispatch ] = useContext(CowContext);
  const { message, cow, mode, eyes, tongue, wrap, noWrap, action } = cowData;


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
    dispatch({ type: `SET_ACTION`, action });
  }, [ dispatch ]);

  // Cow change handler
  const handleCowChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    dispatch({ type: `SET_COW`, cow: e.currentTarget.value });
  }, [ dispatch ]);

  // Mode change handler
  const handleModeChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    dispatch({ type: `SET_MODE`, mode: e.currentTarget.value });
  }, [ dispatch ]);

  // Tongue change handler
  const handleEyesChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { value, selectionStart } = e.currentTarget;
    dispatch({ type: `SET_EYES`, eyes: value, cursor: selectionStart });
  }, [ dispatch ]);

  // Tongue change handler
  const handleTongueChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { value, selectionStart } = e.currentTarget;
    dispatch({ type: `SET_TONGUE`, tongue: value, cursor: selectionStart });
  }, [ dispatch ]);

  // Wrap change handler
  const handleWrapChange = useCallback((value: number): void => {
    dispatch({ type: `SET_WRAP`, wrap: value });
  }, [ dispatch ]);

  // No wrap change handler
  const handleNoWrapClick = useCallback((value: boolean): void => {
    dispatch({ type: `SET_NO_WRAP`, noWrap: !value });
  }, [ dispatch ]);

  // No wrap change handler
  const handleNoWrapChange = useCallback((value: boolean): void => {
    dispatch({ type: `SET_NO_WRAP`, noWrap: value });
  }, [ dispatch ]);

  // Message change handler
  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch({ type: `SET_MESSAGE`, message: e.currentTarget.value });
  }, [ dispatch ]);


  // Focus the message text area
  useEffect((): void => {
    document.getElementById(`message`)?.focus();
  }, []);


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
              <Checkbox id="no-wrap" checked={noWrap} onClick={handleNoWrapClick} onChange={handleNoWrapChange} className="pl-2 ml-4 w-7/12">
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
