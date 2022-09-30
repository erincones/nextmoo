import {
  useState,
  useCallback,
  ChangeEvent,
  WheelEvent,
  useEffect,
} from "react";

/**
 * Spinbox component properties
 */
interface SpinboxProps {
  readonly id?: string;
  readonly value?: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly onChange?: (value: number) => unknown;
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
export const Spinbox = ({
  id,
  value = 40,
  min = -limit,
  max = limit,
  step = 1,
  disabled,
  onChange,
  className,
}: SpinboxProps): JSX.Element => {
  const [state, setState] = useState(value);

  // Value handler
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Empty string
      if (e.currentTarget.value.length === 0) {
        setState(0);
      }

      // Parse string and check range
      else if (/^\d*$|^0x[\dA-Fa-f]+$/.test(e.currentTarget.value)) {
        const parsed = parseInt(e.currentTarget.value);

        if (parsed >= min && parsed <= max) {
          setState(parsed);
        }
      }
    },
    [min, max]
  );

  // Wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent<HTMLInputElement>) => {
      if (disabled === false) {
        if (e.deltaY > 0) {
          setState((state) => (state - step >= min ? state - step : state));
        } else {
          setState((state) => (state + step <= max ? state + step : state));
        }
      }
    },
    [disabled, min, max, step]
  );

  // Up click handler
  const handleUpClick = useCallback(() => {
    setState((state) => (state < max ? state + 1 : state));
  }, [max]);

  // Down click handler
  const handleDownClick = useCallback(() => {
    setState((state) => (state > min ? state - 1 : state));
  }, [min]);

  // Update value
  useEffect(() => {
    onChange?.(state);
  }, [onChange, state]);

  // Return Spinbox
  return (
    <div className={`flex ${className}`}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={state}
        min={min}
        max={max}
        disabled={disabled}
        onChange={handleChange}
        onWheel={handleWheel}
        className="bg-transparent text-white disabled:text-gray-light bg-right bg-no-repeat focus:outline-none w-full-3"
      />

      {/* Spin buttons */}
      <div className="flex flex-col w-3">
        <button
          type="button"
          disabled={disabled}
          onClick={handleUpClick}
          aria-label="increment"
          className="focus:bg-white arrow-up-white focus:arrow-up-black disabled:arrow-up-gray-light bg-no-repeat bg-center focus:outline-none disabled:cursor-default -ml-px h-2"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={handleDownClick}
          aria-label="decrement"
          className="focus:bg-white arrow-down-white focus:arrow-down-black disabled:arrow-down-gray-light bg-no-repeat bg-center focus:outline-none disabled:cursor-default -ml-px h-2"
        />
      </div>
    </div>
  );
};
