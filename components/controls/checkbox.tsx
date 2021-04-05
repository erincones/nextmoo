import { useRef, useCallback, ChangeEvent } from "react";
import { CheckableProps } from "./checkable";


/**
 * Checkbox controlled component properties
 */
interface CheckboxControlledProps {
  readonly checked?: boolean;
  readonly onClick?: (value: boolean) => unknown;
  readonly onChange?: (value: boolean) => unknown;
}

/**
 * Checkbox controlled properties
 */
type CheckboxProps = CheckableProps & CheckboxControlledProps;


/**
 * Checkbox component
 *
 * @param props Checkbox component properties
 */
export const Checkbox = ({ children, id, checked, onClick, onChange, className }: CheckboxProps): JSX.Element => {
  // Button
  const button = useRef<HTMLButtonElement>(null);


  // Handle label click
  const handleLabelClick = useCallback(() => {
    button.current?.focus();
  }, []);

  // Handle change
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.checked);
  }, [ onChange ]);

  // Handle click
  const handleClick = useCallback(() => {
    onClick?.(checked as boolean);
  }, [ onClick, checked ]);


  // Return checkbox
  return (
    <div className={className}>
      <input id={id} type="checkbox" value={id} checked={checked} onChange={handleChange} className="hidden" />
      <label htmlFor={id} onClick={handleLabelClick}>
        <span className="cursor-pointer">
          [<button ref={button} type="button" tabIndex={0} onClick={handleClick} aria-label="checkbox" className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{checked ? `x` : ` `}</button>]
        </span>
        {children}
      </label>
    </div>
  );
};
