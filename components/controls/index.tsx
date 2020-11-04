import { useState, useCallback, ChangeEvent, WheelEvent, useEffect } from "react";


/**
 * Controls component properties
 */
interface ControlsProps {
  readonly handleCow?: (cow: string) => void;
}

/**
 * Action type
 */
type action = `say` | `think`;


/**
 * Clap string to the last two chars
 *
 * @param str String to clamp
 */
const clamp = (str: string, last = false) => {
  if (str.length < 3) {
    return str;
  }

  return last ? str.slice(str.length - 2, str.length) : str.slice(0, 2);
};


/**
 * Controls component
 *
 * @param props Controls component properties
 */
export const Controls = ({ handleCow = () => { return; } }: ControlsProps): JSX.Element => {
  const [ action, setAction ] = useState<action>(`say`);
  const [ eyes, setEyes ] = useState(`oo`);
  const [ tongue, setTongue ] = useState(``);
  const [ wrapColumn, setWrapColumn ] = useState(30);
  const [ noWrap, setNoWrap ] = useState(false);
  const [ message, setMessage ] = useState(``);


  // Action change handler
  const handleActionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      setAction(e.currentTarget.value === `say` ? `say` : `think`);
    }
  }, []);


  // Say label click
  const handleSayLabelClick = useCallback(() => {
    document.getElementById(`sayButton`).focus();
  }, []);

  // Say click handler
  const handleSayClick = useCallback(() => {
    setAction(`say`);
  }, []);


  // Think label click
  const handleThinkLabelClick = useCallback(() => {
    document.getElementById(`thinkButton`).focus();
  }, []);

  // Think click handler
  const handleThinkClick = useCallback(() => {
    setAction(`think`);
  }, []);


  // Tongue change handler
  const handleEyesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEyes(clamp(e.currentTarget.value, e.currentTarget.selectionStart > 2));
  }, []);

  // Tongue change handler
  const handleTongueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTongue(clamp(e.currentTarget.value, e.currentTarget.selectionStart > 2));
  }, []);


  // Wrap column change handler
  const handleWrapColumnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$|^0x[\dA-Fa-f]+$/.test(e.currentTarget.value)) {
      const value = parseInt(e.currentTarget.value);

      if (value >= 0) {
        setWrapColumn(value);
      }
      else if (e.currentTarget.value.length === 0) {
        setWrapColumn(0);
      }
    }
  }, []);

  // Wrap column scroll handler
  const handleWrapColumnScroll = useCallback((e: WheelEvent<HTMLInputElement>) => {
    if (e.deltaY > 0) {
      setWrapColumn(wrapColumn => wrapColumn > 0 ? wrapColumn - 1 : wrapColumn);
    }
    else {
      setWrapColumn(wrapColumn => wrapColumn + 1);
    }
  }, []);


  // No wrap change handler
  const handleNoWrapChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNoWrap(e.currentTarget.checked);
  }, []);

  // No wrap label click
  const handleNoWrapLabelClick = useCallback(() => {
    document.getElementById(`noWrapButton`).focus();
  }, []);

  // No wrap click handler
  const handleNoWrapClick = useCallback(() => {
    setNoWrap(noWrap => !noWrap);
  }, []);


  // Message change handler
  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }, []);


  // Initialize and focus message
  useEffect(() => {
    setMessage(`moo!`);
    document.getElementById(`message`).focus();
  }, []);

  // Update cow
  useEffect(() => {
    const cow = JSON.stringify({ action, eyes, tongue, wrapColumn, noWrap, message }, null, 2);
    handleCow(cow);
  }, [ action, eyes, tongue, wrapColumn, noWrap, message, handleCow ]);


  // Return controls component
  return (
    <div className="flex flex-col p-2 w-full md:w-5/12 min-h-full">
      {/* Options */}
      <div className="leading-none">
        <div className="flex mb-2">
          {/* Cow */}
          <fieldset className="border border-white px-2 pb-2 w-5/12">
            <legend className="cursor-default px-1">
              <label htmlFor="cow">Cow</label>
            </legend>
            <select id="cow" className="bg-transparent text-white align-middle focus:bg-white focus:text-black focus:outline-none appearance-none w-full">
              <option>Default</option>
            </select>
          </fieldset>

          {/* Action */}
          <fieldset className="border border-white px-2 pb-2 ml-4 w-7/12">
            <legend className="cursor-default px-1">Action</legend>
            <div className="flex">
              <div className="bg-transparent pr-2 w-3/7">
                <input id="say" type="radio" name="action" value="say" checked={action === `say`} onChange={handleActionChange} className="hidden" />
                <label htmlFor="say" onClick={handleSayLabelClick}>
                  <span className="cursor-pointer">(<button id="sayButton" type="button" tabIndex={0} onClick={handleSayClick} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{action === `say` ? `*` : ` `}</button>)</span>Say
                </label>
              </div>
              <div className="bg-transparent ml-4 w-4/7">
                <input id="think" type="radio" name="action" value="think" checked={action === `think`} onChange={handleActionChange} className="hidden" />
                <label htmlFor="think" onClick={handleThinkLabelClick}>
                  <span className="cursor-pointer">(<button id="thinkButton" type="button" tabIndex={0} onClick={handleThinkClick} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{action === `think` ? `*` : ` `}</button>)</span>Think
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="flex mb-2">
          {/* Mode */}
          <fieldset className="border border-white px-2 pb-2 w-5/12">
            <legend className="cursor-default px-1">
              <label htmlFor="mode">Mode</label>
            </legend>
            <select id="mode" className="bg-transparent text-white align-middle focus:bg-white focus:text-black focus:outline-none appearance-none w-full">
              <option>Default</option>
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

            {/* Eyes */}
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
              <input id="wrap-col" type="text" inputMode="numeric" value={wrapColumn} min={0} step={0} onChange={handleWrapColumnChange} onWheel={handleWrapColumnScroll} className="bg-transparent text-white focus:outline-none pr-2 w-5/12" />
              <div className="bg-transparent pl-2 ml-4 w-7/12">
                <input id="no-wrap" type="checkbox" checked={noWrap} onChange={handleNoWrapChange} className="hidden" />
                <label htmlFor="no-wrap" onClick={handleNoWrapLabelClick}>
                  <span className="cursor-pointer">[<button id="noWrapButton" tabIndex={0} onClick={handleNoWrapClick} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{noWrap ? `x` : ` `}</button>]</span>No wrap
                </label>
              </div>
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
    </div>
  );
};
