import { useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGridColumns from "~/hooks/useGridColumns";
import { GuardV3 } from "../Guard";

export interface IdiomSearchProps {
  isInputClicked?: boolean;
  onInputClick?: () => unknown;
  onInputClickAway?: () => unknown;
}

const IdiomSearch = (props: IdiomSearchProps) => {
  const { isInputClicked, onInputClick, onInputClickAway } = props;
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const refCopy = inputRef.current;
    if (!refCopy || !isInputClicked) {
      return;
    }
    const onClickAway = function (event: MouseEvent) {
      const { target } = event;
      if (target instanceof HTMLElement && !refCopy.contains(target)) {
        setKeyword("");
        onInputClickAway?.();
      }
    };
    window.addEventListener("click", onClickAway);
    return () => {
      window.removeEventListener("click", onClickAway);
    };
  }, [isInputClicked, onInputClickAway]);
  useEffect(() => {
    if (isInputClicked) {
      setTimeout(() => {
        inputRef.current?.querySelector("input")?.focus();
      }, 0);
    }
  }, [isInputClicked]);
  const navigate = useNavigate();
  const { columns } = useGridColumns();
  const hasLabel = columns !== 1;

  return (
    <div className="flex gap-x-3 py-0.5 max-w-[405px] w-full h-full justify-end pl-2">
      <GuardV3 when={isInputClicked}>
        {() => {
          return (
            <>
              <div
                className="flex w-full h-full px-2 border-2 border-gray-300 rounded gap-x-2"
                ref={(element) => {
                  inputRef.current = element;
                }}
              >
                <MagnifyingGlassIcon className="w-6" />
                <form
                  method="get"
                  className="flex items-center w-full h-full"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (keyword.length < 2) {
                      return;
                    }
                    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
                    setKeyword("");
                    onInputClickAway?.();
                  }}
                >
                  <input
                    type="text"
                    name="idiom-search"
                    className="w-full rounded my-[1px] outline-none text-sm font-light"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                </form>
                <button
                  onClick={() => {
                    setKeyword("");
                  }}
                >
                  <XMarkIcon className="w-6" strokeWidth={1} />
                </button>
              </div>
              <div className="flex items-center gap-x-0.5">
                <Cog8ToothIcon className="w-6" />
                {hasLabel && <span className="text-sm">Setting</span>}
              </div>
            </>
          );
        }}
      </GuardV3>
      <GuardV3 when={!isInputClicked}>
        {() => {
          return (
            <>
              <button
                className="flex items-center gap-x-0.5 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onInputClick?.();
                }}
              >
                <MagnifyingGlassIcon className="w-6" />
                {hasLabel && <span className="text-sm">Search</span>}
              </button>
              <div className="flex items-center gap-x-0.5">
                <Cog8ToothIcon className="w-6" />
                {hasLabel && <span className="text-sm">Setting</span>}
              </div>
            </>
          );
        }}
      </GuardV3>
    </div>
  );
};

export default IdiomSearch;
