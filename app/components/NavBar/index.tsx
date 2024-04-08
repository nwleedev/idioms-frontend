import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import useGridColumns from "~/hooks/useGridColumns";
import IdiomSearch from "../IdiomSearch";
import Logo from "../Logo";

const NavBar = () => {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const { columns } = useGridColumns();
  const hasLabel = columns !== 1;
  const hasLogo = !isInputClicked || columns !== 1;
  const location = useLocation();
  return (
    <div className="flex items-center justify-between px-0.5 column200:pr-2 py-4 h-16">
      {hasLogo && (
        <Logo className="min-w-[135px] max-w-[165px] w-full h-auto flex" />
      )}
      <div className="flex w-full max-w-full column200:ml-4 gap-x-2.5">
        <IdiomSearch
          isInputClicked={isInputClicked}
          onInputClick={() => setIsInputClicked(true)}
          onInputClickAway={() => setIsInputClicked(false)}
        />
        {location.pathname !== "/settings" && (
          <Link to={"/settings"} className="flex items-center">
            <Cog8ToothIcon className="w-6" />
            {hasLabel && <span className="text-sm">Setting</span>}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
