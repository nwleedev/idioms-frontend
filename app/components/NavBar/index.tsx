import { Bars3Icon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import useGridColumns from "~/hooks/useGridColumns";
import { cs } from "~/lib/classnames";
import { GuardV3 } from "../Guard";
import IdiomSearch from "../IdiomSearch";
import Logo from "../Logo";

export interface NavBarProps {
  className?: string;
}

const NavBar = (props: NavBarProps) => {
  const { className = "" } = props;
  const [isInputClicked, setIsInputClicked] = useState(false);
  const { columns } = useGridColumns();
  const hasLabel = columns !== 1;
  const hasLogo = !isInputClicked || columns !== 1;
  const location = useLocation();
  const [isMenuPressed, setIsPressed] = useState(false);
  const menuRef = useRef(null as HTMLDivElement | null);
  const buttonRef = useRef(null as HTMLButtonElement | null);

  useEffect(() => {
    if (isMenuPressed) {
      setIsInputClicked(false);
    }
    document.body.style.overflowY = isMenuPressed ? "hidden" : "auto";
  }, [isMenuPressed]);

  useEffect(() => {
    const onClickOutside = function (event: MouseEvent | TouchEvent) {
      if (
        event.target instanceof Node &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsPressed(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [isMenuPressed]);

  return (
    <>
      <div
        className={cs(
          "flex items-center justify-between column200:pr-2 py-4 px-5 h-16 relative z-30 bg-white",
          className
        )}
      >
        {hasLogo && (
          <Logo className="min-w-[135px] max-w-[165px] w-full h-auto flex" />
        )}
        <div className="flex w-full max-w-full column200:ml-4 gap-x-3">
          <IdiomSearch
            isInputClicked={isInputClicked}
            onInputClick={() => setIsInputClicked(true)}
            onInputClickAway={() => setIsInputClicked(false)}
          />
          <GuardV3 when={columns !== 1 && location.pathname !== "/settings"}>
            {() => (
              <Link to={"/settings"} className="flex items-center gap-x-0.5">
                <Cog8ToothIcon className="w-6" />
                {hasLabel && <span className="text-sm">Setting</span>}
              </Link>
            )}
          </GuardV3>
          <div
            className="relative flex items-center transition-all"
            ref={(element) => (menuRef.current = element)}
          >
            <button
              onMouseDown={() => {
                setIsPressed((isPressed) => !isPressed);
              }}
              ref={(element) => (buttonRef.current = element)}
            >
              <Bars3Icon className="w-6 h-6 min-w-6" />
            </button>
            <GuardV3 when={columns !== 1 && isMenuPressed}>
              {() => (
                <div
                  className={cs(
                    "absolute inline-flex flex-col w-48 px-4 py-2 text-sm transition-all bg-white border rounded gap-y-2 whitespace-nowrap mt-9"
                  )}
                  style={{
                    inset: "0px 0px auto auto",
                  }}
                >
                  <Link to={"/privacy-policy"}>
                    <p>Privacy Policy</p>
                  </Link>
                  <hr className="bg-black" />
                  <Link to={"/terms-and-conditions"}>
                    <p>Terms and Conditions</p>
                  </Link>
                </div>
              )}
            </GuardV3>
          </div>
        </div>
      </div>
      <GuardV3 when={columns === 1 && isMenuPressed}>
        {() => (
          <>
            <div
              className={cs(
                "fixed top-14 left-0 right-0 flex flex-col w-full px-4 py-2 pb-3 bg-white h-full max-h-40 gap-y-2 transition-all z-20"
              )}
              ref={(element) => (menuRef.current = element)}
            >
              <Link
                to={"/settings"}
                className="flex items-center mt-auto gap-x-1"
              >
                <Cog8ToothIcon className="w-6" />
                {<span className="text-sm">Setting</span>}
              </Link>
              <div className="flex flex-col px-1 mt-auto gap-y-4">
                <hr className="w-full bg-black" />
                <div className="flex flex-col w-full text-sm gap-y-1">
                  <Link to={"/privacy-policy"}>
                    <p>Privacy Policy</p>
                  </Link>
                  <Link to={"/terms-and-conditions"}>
                    <p>Terms and Conditions</p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="fixed top-0 left-0 right-0 z-10 w-full h-full bg-gray-800 opacity-60"></div>
          </>
        )}
      </GuardV3>
    </>
  );
};

export default NavBar;
