import { HTMLAttributes, ReactNode, useMemo } from "react";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  fontSize?: "xs" | "sm" | "base";
}

const Button = (props: ButtonProps) => {
  const { children, className = "", fontSize, ...others } = props;
  const fontSizeStyle = useMemo(() => {
    switch (fontSize) {
      case "xs": {
        return "text-xs";
      }
      case "sm": {
        return "text-sm";
      }
      case "base": {
        return "text-base";
      }
      default:
        return "text-sm";
    }
  }, [fontSize]);
  const classNames = [
    fontSizeStyle,
    "inline-flex rounded-lg gap-x-0.5 font-semibold bg-red-500 text-white py-1 px-3",
    className,
  ];
  return (
    <button className={classNames.join(" ")} {...others}>
      {children}
    </button>
  );
};

export default Button;
