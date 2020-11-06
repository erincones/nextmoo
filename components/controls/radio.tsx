import { useMemo, useCallback, Dispatch, SetStateAction } from "react";


/**
 * Radio component properties
 */
interface RadioProps {
  readonly children?: string;
  readonly id: string;
  readonly name: string;
  readonly checked: boolean;
  readonly onChange: Dispatch<SetStateAction<string>>;
  readonly className?: string;
}


/**
 * Radio component
 *
 * @param props Radio component properties
 */
export const Radio = ({ children, id, name, checked, onChange, className }: RadioProps): JSX.Element => {
  // Button id
  const buttonId = useMemo(() =>
    `${name}-${id}`
  , [ name, id ]);


  // Handle label click
  const handleLabelClick = useCallback(() => {
    document.getElementById(buttonId).focus();
  }, [ buttonId ]);

  // Handle click and change
  const handleClickChange = useCallback(() => {
    onChange(id);
  }, [ id, onChange ]);


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
