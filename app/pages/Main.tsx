import { useEffect } from "react";
import IdiomsGrid, { css as idiomsGridCss } from "~/components/IdiomsGrid";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import useIdioms from "~/hooks/useIdioms";
import style from "./Main.css?url";

export const css = [{ rel: "stylesheet", href: style }, ...idiomsGridCss];

function Main() {
  const { data, isFetching, isFetched, hasNextPage, fetchNextPage } = useIdioms(
    {
      count: 20,
      hasThumbnail: true,
    }
  );
  const idioms = data?.pages.map((page) => page.idioms).flat(1);
  const { maxWidth } = useGridColumns();
  useEffect(() => {
    document.title = "Use Idioms";
  }, []);

  return (
    <div className={["px-4 w-full mx-auto h-full", maxWidth].join(" ")}>
      <main className="flex flex-col w-full h-full py-4 gap-y-2 sm:gap-y-4">
        <NavBar />
        <IdiomsGrid
          idioms={idioms}
          isFetched={isFetched}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </main>
    </div>
  );
}

export default Main;