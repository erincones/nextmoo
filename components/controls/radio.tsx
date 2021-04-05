import { useRef, useCallback, InputHTMLAttributes } from "react";
import { CheckableProps } from "./checkable";


/**
 * Input value type
 */
type V = InputHTMLAttributes<HTMLInputElement>["value"];


/**
 * Radio component uncontrolled properties
 */
interface RadioUncontrolledProps extends CheckableProps {
  readonly value?: undefined;
  readonly onChange?: undefined;
}

/**
 * Radio component controlled properties
 */
interface RadioControlledProps<T> extends CheckableProps {
  readonly value: T;
  readonly onChange: (value: T) => unknown;
}

/**
 * Radio component properties
 */
type RadioProps<T extends V> = RadioUncontrolledProps | RadioControlledProps<T>;


/**
 * Radio component
 *
 * @param props Radio component properties
 */
export const Radio = <T extends V>({ children, id, name, value, checked, onChange, className }: RadioProps<T>): JSX.Element => {
  // Button
  const button = useRef<HTMLButtonElement>(null);


  // Handle label click
  const handleLabelClick = useCallback((): void => {
    button.current?.focus();
  }, []);

  // Handle click and change
  const handleChange = useCallback((): void => {
    onChange?.(value as T);
  }, [ onChange, value ]);


  // Return radio
  return (
    <div className={className}>
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={handleChange} className="hidden" />
      <label htmlFor={id} onClick={handleLabelClick}>
        <span className="cursor-pointer">
          (<button ref={button} type="button" tabIndex={0} onClick={handleChange} role="radio" aria-checked={checked ? `true` : `false`} aria-label={children} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{checked ? `*` : ` `}</button>)
        </span>
        {children}
      </label>
    </div>
  );
};
