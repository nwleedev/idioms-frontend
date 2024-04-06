import { useState } from "react";

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
        className="toggle w-10 h-6 flex items-center relative cursor-pointer"
        onClick={() => {
          setIsInnerChecked((checked) => !checked);
          onClick();
        }}
      >
        <input
          type="checkbox"
          className="toggle invisible absolute"
          checked={isFullChecked}
          onChange={(event) => {
            event.preventDefault();
            setIsInnerChecked((checked) => !checked);
            onClick();
          }}
        />
        <span
          className={[
            className,
            "toggleHandler rounded-full shadow-sm w-5 h-5 transition-all",
            isFullChecked ? `bg-red-500` : "bg-gray-500",
          ].join(" ")}
          style={{
            transform: isFullChecked ? "translateX(100%)" : "translateX(0%)",
          }}
        ></span>
      </div>
    </div>
  );
};

export default Toggle;
