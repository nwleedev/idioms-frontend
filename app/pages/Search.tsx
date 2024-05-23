import { useSearchParams } from "@remix-run/react";
import Footer from "~/components/Footer";
import IdiomsGrid, { css as idiomsGridCss } from "~/components/IdiomsGrid";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import useSearchIdioms from "~/hooks/useSearchIdioms";
import { cs } from "~/lib/classnames";
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
    <>
      <div className="flex flex-col w-full h-full mx-auto">
        <NavBar />
        <main
          className={cs(
            "flex flex-col w-full h-full min-h-0 gap-y-2 sm:gap-y-4 mx-auto px-4",
            maxWidth
          )}
        >
          <IdiomsGrid
            idioms={idioms}
            isFetched={isFetched}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Search;
