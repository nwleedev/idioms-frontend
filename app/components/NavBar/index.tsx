import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import useGridColumns from "~/hooks/useGridColumns";
import IdiomSearch from "../IdiomSearch";
import Logo from "../Logo";

const NavBar = () => {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const { columns } = useGridColumns();
  const hasLogo = !isInputClicked || columns !== 1;
  return (
    <div className="flex justify-between h-11">
      {hasLogo && (
        <Logo className="min-w-[135px] max-w-[165px] w-full h-auto flex" />
      )}
      <IdiomSearch
        isInputClicked={isInputClicked}
        onInputClick={() => setIsInputClicked(true)}
        onInputClickAway={() => setIsInputClicked(false)}
      />
    </div>
  );
};

export default NavBar;
