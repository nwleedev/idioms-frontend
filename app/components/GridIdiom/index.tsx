import { Link } from "@remix-run/react";
import { CSSProperties } from "react";
import { Idiom } from "~/types/idiom";
import { GuardV3 } from "../Guard";

interface GridIdiomProps {
  idiom?: Idiom;
  columnIndex: number;
  columns: number;
  style: CSSProperties;
}

const GridIdiom = (props: GridIdiomProps) => {
  const { idiom, columnIndex, columns, style } = props;
  const classNames = [
    columnIndex === 0
      ? "pr-2 pl-1"
      : columnIndex === columns - 1
      ? "pl-2 pr-2"
      : "px-2",
    "py-2",
    "w-full max-w-full h-full mx-auto",
  ];

  return (
    <GuardV3 data={{ idiom }} when={!!idiom}>
      {({ data: { idiom } }) => (
        <div className={classNames.join(" ")} style={{ ...style }}>
          <Link
            key={"idiom:" + idiom.id}
            to={`/${idiom.id}`}
            className="w-full h-full max-w-full mx-auto"
          >
            <section className="flex flex-col w-full h-full px-4 pt-6 pb-4 rounded shadow cursor-pointer gap-y-2 bg-slate-50 hover:shadow-lg">
              <div
                style={{
                  backgroundImage: `url("https://static.useidioms.com/${idiom.thumbnail}")`,
                }}
                className="bg-center"
              >
                <div className="backdrop-blur-[50px] h-full">
                  <img
                    src={`https://static.useidioms.com/${idiom.thumbnail}`}
                    alt={idiom.idiom}
                    className="max-w-[190px] w-full object-cover mx-auto h-auto"
                    onLoad={() => {}}
                  />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <h2 className="mt-1 text-lg font-semibold leading-tight font-Work_Sans line-clamp-2">
                  {idiom.idiom}
                </h2>
                <div className="mt-auto mb-2">
                  <p className="text-xs font-normal line-clamp-2">
                    {idiom.meaningBrief}
                  </p>
                </div>
              </div>
            </section>
          </Link>
        </div>
      )}
    </GuardV3>
  );
};

export default GridIdiom;
