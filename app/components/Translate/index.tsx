import {
  HTMLAttributes,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cs } from "~/lib/classnames";

type TextElement = HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement;

export interface TranslateProps extends HTMLAttributes<TextElement> {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  children?: string;
}

const Translate = (props: TranslateProps) => {
  const { children = "", tag = "span", className, ...attributes } = props;
  const ref = useRef(null as HTMLElement | null);
  const [isTranslated, setIsTranslated] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        const isEqual = entry.target.isSameNode(ref.current);
        if (!isEqual) {
          return;
        }
        const isTranslated = entry.target.textContent !== children;
        setIsTranslated(isTranslated);
      });
    });
    observer.observe(ref.current, { attributes: true, childList: true });
    return () => {
      observer.disconnect();
    };
  }, [children]);

  const classNames = useMemo(() => {
    if (isTranslated) {
      return [className].concat("visible");
    } else {
      return [className].concat("invisible h-[1px]");
    }
  }, [className, isTranslated]);

  const node = createElement(
    tag,
    {
      ...attributes,
      ref: (element) => (ref.current = element),
      className: cs(...classNames),
      translate: "yes",
    },
    children
  );

  return node;
};

export default Translate;
