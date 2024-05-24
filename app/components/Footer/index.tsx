import { Link } from "@remix-run/react";
import useGridColumns from "~/hooks/useGridColumns";
import { cs } from "~/lib/classnames";

export interface FooterProps {
  className?: string;
}

export default function Footer(props: FooterProps) {
  const { maxWidth } = useGridColumns();
  const { className = "" } = props;

  return (
    <footer
      className={cs("w-full flex text-white bg-primary py-0.5 px-4", className)}
    >
      <div className="flex flex-col items-center justify-between w-full column200:flex-row">
        <div className="flex text-base font-semibold">
          <p>useidioms.com</p>
        </div>
        <div
          className={cs(
            "flex items-center gap-x-2.5 text-xs h-full py-0.5",
            maxWidth
          )}
        >
          <Link to={"/about"}>
            <p>About</p>
          </Link>
          <p className="w-px h-full text-white bg-white" />
          <Link to={"/privacy-policy"}>
            <p>Privacy Policy</p>
          </Link>
          <p className="w-px h-full text-white bg-white" />
          <Link to={"/terms-and-conditions"}>
            <p>Terms and Conditions</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
