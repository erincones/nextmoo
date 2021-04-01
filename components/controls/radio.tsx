import { useMemo, useCallback, InputHTMLAttributes } from "react";


/**
 * Radio component
 *
 * @param props Radio component properties
 */
export const Radio = ({ children, id, name, checked, onChange, className }: InputHTMLAttributes<HTMLInputElement>): JSX.Element => {
  // Button id
  const buttonId = useMemo(() =>
    `${name}-${id}`
  , [ name, id ]);


  // Handle label click
  const handleLabelClick = useCallback(() => {
    document.getElementById(buttonId)?.focus();
  }, [ buttonId ]);

  // Handle click and change
  const handleClickChange = useCallback(e => {
    onChange!(e);
  }, [ onChange ]);


  // Return radio
  return (
    <div className={className}>
      <input id={id} type="radio" name={name} value={id} checked={checked} onChange={handleClickChange} className="hidden" />
      <label htmlFor={id} onClick={handleLabelClick}>
        <span className="cursor-pointer">
          (<button id={buttonId} type="button" tabIndex={0} onClick={handleClickChange} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{checked ? `*` : ` `}</button>)
        </span>
        {children}
      </label>
    </div>
  );
};
