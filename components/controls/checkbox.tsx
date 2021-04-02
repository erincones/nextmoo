import { useRef, useCallback, Dispatch, SetStateAction, ChangeEvent } from "react";


/**
 * Checkbox component properties
 */
interface CheckboxProps {
  readonly children?: string;
  readonly id?: string;
  readonly checked: boolean;
  readonly onChange: Dispatch<SetStateAction<boolean>>;
  readonly className?: string;
}


/**
 * Checkbox component
 *
 * @param props Checkbox component properties
 */
export const Checkbox = ({ children, id, checked, onChange, className }: CheckboxProps): JSX.Element => {
  // Button
  const button = useRef<HTMLButtonElement>(null);


  // Handle label click
  const handleLabelClick = useCallback(() => {
    button.current?.focus();
  }, []);

  // Handle change
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.checked);
  }, [ onChange ]);

  // Handle click
  const handleClick = useCallback(() => {
    onChange(value => !value);
  }, [ onChange ]);


  // Return checkbox
  return (
    <div className={className}>
      <input id={id} type="checkbox" value={id} checked={checked} onChange={handleChange} className="hidden" />
      <label htmlFor={id} onClick={handleLabelClick}>
        <span className="cursor-pointer">
          [<button ref={button} type="button" tabIndex={0} onClick={handleClick} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{checked ? `x` : ` `}</button>]
        </span>
        {children}
      </label>
    </div>
  );
};
