import { useRef, useCallback, Dispatch, SetStateAction, InputHTMLAttributes } from "react";


/**
 * Input value type
 */
type V = InputHTMLAttributes<HTMLInputElement>["value"];


/**
 * Radio component base properties
 */
interface RadioBaseProps {
  readonly children?: string;
  readonly id?: string;
  readonly name?: string;
  readonly checked?: boolean;
  readonly className?: string;
}

/**
 * Radio component uncontrolled properties
 */
interface RadioUncontrolledProps extends RadioBaseProps {
  readonly value?: undefined;
  readonly onChange?: undefined;
}

/**
 * Radio component controlled properties
 */
interface RadioControlledProps<T> extends RadioBaseProps {
  readonly value: T;
  readonly onChange: Dispatch<SetStateAction<T>>;
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
  const handleClickChange = useCallback((): void => {
    onChange?.(value as T);
  }, [ onChange, value ]);


  // Return radio
  return (
    <div className={className}>
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={handleClickChange} className="hidden" />
      <label htmlFor={id} onClick={handleLabelClick}>
        <span className="cursor-pointer">
          (<button ref={button} type="button" tabIndex={0} onClick={handleClickChange} className="whitespace-pre focus:bg-white focus:text-black focus:outline-none">{checked ? `*` : ` `}</button>)
        </span>
        {children}
      </label>
    </div>
  );
};
