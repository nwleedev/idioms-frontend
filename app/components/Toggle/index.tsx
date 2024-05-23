import { useState } from "react";
import { cs } from "~/lib/classnames";

export interface ToggleProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  isChecked?: boolean;

  onClick?: () => unknown;
}

const Toggle = (props: ToggleProps) => {
  const { className, isChecked, onClick = () => {} } = props;
  const [isInnerChecked, setIsInnerChecked] = useState(false);
  const isFullChecked = isChecked ?? isInnerChecked;

  return (
    <div className="border px-[2px] rounded-full bg-white">
      <div
        className="relative flex items-center w-10 h-6 cursor-pointer toggle"
        onClick={() => {
          setIsInnerChecked((checked) => !checked);
          onClick();
        }}
      >
        <input
          type="checkbox"
          className="absolute invisible toggle"
          checked={isFullChecked}
          onChange={(event) => {
            event.preventDefault();
            setIsInnerChecked((checked) => !checked);
            onClick();
          }}
        />
        <span
          className={cs(
            className,
            "toggleHandler rounded-full shadow-sm w-5 h-5 transition-all",
            isFullChecked ? `bg-red-500` : "bg-gray-500"
          )}
          style={{
            transform: isFullChecked ? "translateX(100%)" : "translateX(0%)",
          }}
        ></span>
      </div>
    </div>
  );
};

export default Toggle;
