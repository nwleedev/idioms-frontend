import { HTMLAttributes, ReactNode, useMemo } from "react";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  fontSize?: "xs" | "sm" | "base";
  action?: "primary" | "secondary" | "info" | "success" | "danger";
}

const Button = (props: ButtonProps) => {
  const {
    children,
    className = "",
    fontSize,
    action = "primary",
    ...others
  } = props;
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
  const background = useMemo(() => {
    switch (action) {
      case "primary":
        return "bg-red-500 text-white";
      case "secondary":
        return "bg-white border-red-500 text-red-500 border";
      case "success":
        return "bg-green-600 text-white";
      case "danger":
        return "bg-black text-white";
      case "info":
        return "bg-sky-500 text-white";
    }
  }, [action]);
  const defaultClassname =
    "inline-flex rounded-lg gap-x-0.5 font-semibold py-1 px-3";
  const classNames = [
    defaultClassname,
    fontSizeStyle,
    background,
    className,
  ].join(" ");
  return (
    <button className={classNames} {...others}>
      {children}
    </button>
  );
};

export default Button;
