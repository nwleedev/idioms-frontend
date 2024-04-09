import { isNil } from "ramda";
import { GuardV3 } from "../Guard";

export interface SelectInputProps<O> {
  label: string;
  value: O;
  options: O[];
  disabled: boolean;
  onChange: (value: O) => unknown;

  children: (value?: O, index?: number) => string | undefined;
  errorMessage?: string;
}

export default function SelectInput<O>(props: SelectInputProps<O>) {
  const { label, value, options, disabled, onChange, children, errorMessage } =
    props;

  return (
    <section className="RangeInput flex flex-col justify-between w-full gap-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="font-light">{label}</h3>
        <select
          value={children(value)}
          onChange={(event) => {
            const nextValue = options.find(
              (option) => children(option) === event.target.value
            );
            if (isNil(nextValue)) {
              console.warn("No options");
            } else {
              onChange(nextValue);
            }
          }}
          disabled={disabled}
          className="px-2 py-1 font-light border border-gray-300 rounded-lg"
        >
          {options.map((option, index) => {
            return (
              <option
                className="text-sm"
                key={`${label}:${children(option, index)}:${index}`}
                value={children(option, index)}
              >
                {children(option, index)}
              </option>
            );
          })}
        </select>
      </div>
      <GuardV3 data={{ errorMessage }} when={!!errorMessage}>
        {({ data: { errorMessage } }) => {
          return (
            <p className="text-xs font-light text-red-500">{errorMessage}</p>
          );
        }}
      </GuardV3>
    </section>
  );
}
