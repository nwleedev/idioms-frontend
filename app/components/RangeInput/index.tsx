import { ChangeEvent, useEffect, useRef } from "react";
import style from "./index.css?url";

export const css = [{ rel: "stylesheet", href: style }];

export interface RangeInputProps {
  min: number;
  max: number;
  label: string;
  step: number;

  value: number;
  onChange: (value: number) => unknown;
}

export default function RangeInput(props: RangeInputProps) {
  const { min, max, label, step, value, onChange } = props;
  const inputRef = useRef(null as HTMLInputElement | null);
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    onChange(Number(value));
  };
  useEffect(() => {
    const onClickOutside = function (event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        if (value < min) {
          onChange(min);
          return;
        }
        if (value > max) {
          onChange(max);
          return;
        }
        const formatted = parseFloat(value.toFixed(2));
        onChange(formatted);
      }
    };
    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("click", onClickOutside);
    };
  }, [max, min, value, onChange]);
  return (
    <section className="RangeInput flex flex-col justify-between w-full gap-y-1.5">
      <div className="flex justify-between w-full">
        <h3 className="font-light">{label}</h3>
        <input
          type="number"
          name={`${label}:number`}
          className="w-16 px-1 border border-gray-300"
          value={String(value)}
          onChange={onInputChange}
          step={step}
          ref={(element) => (inputRef.current = element)}
        />
      </div>
      <div className="flex flex-col gap-y-0.5">
        <div className="flex justify-between pr-1">
          <span className="text-sm font-light text-gray-600">{min}</span>
          <span className="text-sm font-light text-gray-600">{max}</span>
        </div>
        <input
          type="range"
          name={`${label}:range`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onInputChange}
        />
      </div>
    </section>
  );
}
