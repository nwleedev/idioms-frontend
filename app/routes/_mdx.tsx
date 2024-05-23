import { Outlet } from "@remix-run/react";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import { cs } from "~/lib/classnames";

export default function MDXPage() {
  const { maxWidth } = useGridColumns();
  return (
    <div className={cs("w-full mx-auto min-h-full flex flex-col relative")}>
      <NavBar className="sticky top-0 z-10 bg-white" />
      <article className={cs("p-4 pb-12 w-full prose mx-auto", maxWidth)}>
        <Outlet />
      </article>
    </div>
  );
}
