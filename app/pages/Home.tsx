import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import GridIdiom from "~/components/GridIdiom";
import { css as idiomsGridCss } from "~/components/IdiomsGrid";
import NavBar from "~/components/NavBar";
import useGridColumns from "~/hooks/useGridColumns";
import { Idiom } from "~/types/idiom";

import Button from "~/components/Button";
import Footer from "~/components/Footer";
import { cs } from "~/lib/classnames";
import style from "./Home.css?url";

export const css = [{ rel: "stylesheet", href: style }, ...idiomsGridCss];

interface HomeProps {
  idioms: Idiom[];
}

function Home(props: HomeProps) {
  const { idioms } = props;
  const { maxWidth, columns } = useGridColumns();

  return (
    <>
      <div className="relative flex flex-col w-full min-h-full mx-auto">
        <NavBar className="sticky top-0 bg-white" />
        <div className="flex items-center justify-center w-full px-4 py-4 mx-auto min-h-56 gap-y-2 bg-primary bg-opacity-5">
          <div className="flex flex-col w-full max-w-xl mx-auto gap-y-2">
            <p className="text-2xl font-semibold">
              Studying idioms, Streamlined.
            </p>
            <p className="text-lg font-light text-gray-700">
              Be courageous and keep studying English idioms. Learn with
              practical examples to make what you have learned more memorable.
            </p>
            <Link to={"/about"}>
              <Button action="primary" className="self-start mt-2">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <main
          className={cs(
            "px-4 flex flex-col w-full h-full min-h-0 pb-4 mt-4 gap-y-1 sm:gap-y-2 mx-auto",
            maxWidth
          )}
        >
          <div className="flex justify-between w-full gap-x-2">
            <p className="px-2 text-2xl font-bold font-Work_Sans">
              Explore Idioms
            </p>
            <div className="flex items-end">
              <Link to={"/idioms"} className="flex whitespace-nowrap">
                <span className="text-sm font-light text-gray-600 sm:text-base hover:border-b">
                  View Idioms
                </span>
                <ChevronRightIcon width={columns === 1 ? 16 : 24} />
              </Link>
            </div>
          </div>
          <article className="homeGrid">
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
      <Footer className="" />
    </>
  );
}

export default Home;
