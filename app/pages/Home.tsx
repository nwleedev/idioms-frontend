import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { useMemo } from "react";
import GridIdiom from "~/components/GridIdiom";
import { css as idiomsGridCss } from "~/components/IdiomsGrid";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import { Idiom } from "~/types/idiom";
import style from "./Main.css?url";

export const css = [{ rel: "stylesheet", href: style }, ...idiomsGridCss];

interface HomeProps {
  idioms: Idiom[];
}

function Home(props: HomeProps) {
  const { idioms } = props;
  const { maxWidth, columns } = useGridColumns();
  const gridClass = useMemo(() => {
    switch (columns) {
      case 1: {
        return "grid-cols-1";
      }
      case 2: {
        return "grid-cols-2";
      }
    }
    return "grid-cols-3";
  }, [columns]);

  return (
    <div
      className={[
        "px-4 w-full mx-auto min-h-full flex flex-col relative",
        maxWidth,
      ].join(" ")}
    >
      <NavBar className="sticky top-0 z-10 bg-white" />
      <main className="flex flex-col w-full h-full min-h-0 pb-8 mt-2 gap-y-1 sm:gap-y-2">
        <div className="flex justify-between w-full gap-x-2">
          <p className="px-2 text-2xl font-bold font-Work_Sans">
            Learn idioms with practical examples!
          </p>
          <div className="flex items-end">
            <Link to={"/"} className="flex whitespace-nowrap">
              <span className="text-sm font-semibold text-gray-600 sm:text-base">
                View Idioms
              </span>
              <ChevronRightIcon width={columns === 1 ? 16 : 24} />
            </Link>
          </div>
        </div>
        <article className={["grid gap-4", gridClass].join(" ")}>
          {idioms.map((idiom, index) => {
            return (
              <GridIdiom
                idiom={idiom}
                key={idiom.id}
                columnIndex={index % (columns > 3 ? 3 : columns)}
                columns={columns > 3 ? 3 : columns}
              />
            );
          })}
        </article>
      </main>
    </div>
  );
}

export default Home;
