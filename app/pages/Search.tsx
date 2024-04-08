import { useSearchParams } from "@remix-run/react";
import IdiomsGrid, { css as idiomsGridCss } from "~/components/IdiomsGrid";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import useSearchIdioms from "~/hooks/useSearchIdioms";
import style from "./Search.css?url";

export const css = [{ rel: "stylesheet", href: style }, ...idiomsGridCss];

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { data, isFetching, isFetched, hasNextPage, fetchNextPage } =
    useSearchIdioms({
      count: 20,
      keyword: keyword ?? undefined,
    });
  const idioms = data?.pages.map((page) => (page ? page.idioms : [])).flat(1);
  const { maxWidth } = useGridColumns();

  return (
    <div className={["px-4 w-full mx-auto h-full", maxWidth].join(" ")}>
      <NavBar />
      <main className="flex flex-col w-full h-[calc(100vh-4rem)] gap-y-2 sm:gap-y-4">
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

export default Search;
