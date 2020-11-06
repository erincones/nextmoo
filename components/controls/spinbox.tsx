import { useCallback, Dispatch, SetStateAction, ChangeEvent, WheelEvent } from "react";


/**
 * Spinbox component properties
 */
interface SpinboxProps {
  readonly value: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly onChange?: Dispatch<SetStateAction<number>>;
  readonly className?: string;
}


/**
 * Input limit
 */
const limit = 999999999999999;


/**
 * Spinbox component
 *
 * @param param0 Spinbox component properties
 */
export const Spinbox = ({ value, min = -limit, max = limit, step = 1, disabled, onChange = () => { return; }, className }: SpinboxProps): JSX.Element => {
  // Value handler
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Empty string
    if (e.currentTarget.value.length === 0) {
      onChange(0);
    }

    // Parse string and check range
    else if (/^\d*$|^0x[\dA-Fa-f]+$/.test(e.currentTarget.value)) {
      const value = parseInt(e.currentTarget.value);

      if ((value >= min) && (value <= max)) {
        onChange(value);
      }
    }
  }, [ min, max, onChange ]);

  // Wheel handler
  const handleWheel = useCallback((e: WheelEvent<HTMLInputElement>) => {
    if (disabled === false) {
      if (e.deltaY > 0) {
        onChange(value => (value - step) >= min ? value - step : value);
      }
      else {
        onChange(value => (value + step) <= max ? value + step : value);
      }
    }
  }, [ disabled, min, max, step, onChange ]);

  // Up click handler
  const handleUpClick = useCallback(() => {
    onChange(value => value < max ? value + 1 : value);
  }, [ max, onChange ]);

  // Down click handler
  const handleDownClick = useCallback(() => {
    onChange(value => value > min ? value - 1 : value);
  }, [ min, onChange ]);


  // Return Spinbox
  return (
    <div className={`flex ${className}`}>
      <input id="wrap-col" type="text" inputMode="numeric" value={value} min={min} max={max} disabled={disabled} onChange={handleChange} onWheel={handleWheel} className="bg-transparent text-white disabled:text-gray-light bg-right bg-no-repeat focus:outline-none w-full-3" />

      {/* Spin buttons */}
      <div className="flex flex-col w-3">
        <button disabled={disabled} onClick={handleUpClick} className="focus:bg-white arrow-up-white focus:arrow-up-black disabled:arrow-up-gray-light bg-no-repeat bg-center focus:outline-none disabled:cursor-default -ml-px h-2" />
        <button disabled={disabled} onClick={handleDownClick} className="focus:bg-white arrow-down-white focus:arrow-down-black disabled:arrow-down-gray-light bg-no-repeat bg-center focus:outline-none disabled:cursor-default -ml-px h-2" />
      </div>
    </div>
  );
};
