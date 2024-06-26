import { Link } from "@remix-run/react";
import { isNil } from "ramda";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { cs } from "~/lib/classnames";
import { Idiom } from "~/types/idiom";
import { GuardV3 } from "../Guard";

interface GridIdiomProps {
  idiom?: Idiom;
  columnIndex: number;
  columns: number;
  style?: CSSProperties;
}

const GridIdiom = (props: GridIdiomProps) => {
  const { idiom, style } = props;
  const classNames = ["px-2", "py-2", "w-full max-w-full h-full mx-auto"];
  const cardImageRef = useRef(null as HTMLDivElement | null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const thumbnail = useMemo(() => {
    if (isNil(idiom) || isNil(idiom.thumbnails)) {
      return idiom?.thumbnail;
    }
    for (const thumbnail of idiom.thumbnails) {
      if (thumbnail.includes("400x400")) {
        return thumbnail;
      }
      if (thumbnail.includes("720x720")) {
        return thumbnail;
      }
    }
    return idiom.thumbnail;
  }, [idiom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    if (cardImageRef.current) {
      observer.observe(cardImageRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <GuardV3 data={{ idiom }} when={!!idiom}>
      {({ data: { idiom } }) => (
        <div className={cs(...classNames)} style={{ ...style }}>
          <Link
            key={"idiom:" + idiom.id}
            to={`/${idiom.id}`}
            className="w-full h-full max-w-full mx-auto"
          >
            <section className="flex flex-col w-full h-full p-1 rounded cursor-pointer gap-y-2">
              <div
                className="transition-all bg-center hover:scale-105 min-h-[240px] h-auto"
                style={{
                  backgroundImage: `url("https://static.useidioms.com/${thumbnail}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div
                  className="backdrop-blur-[50px] h-full"
                  ref={(element) => {
                    cardImageRef.current = element;
                  }}
                >
                  <GuardV3 when={isLoaded}>
                    {() => (
                      <img
                        src={`https://static.useidioms.com/${thumbnail}`}
                        alt={idiom.idiom}
                        className={cs(
                          "object-cover max-w-[240px] w-full min-h-[240px] h-auto mx-auto rounded",
                          isImageLoaded ? "visible" : "invisible"
                        )}
                        width={240}
                        height={240}
                        onLoad={function () {
                          setIsImageLoaded(true);
                        }}
                      />
                    )}
                  </GuardV3>
                </div>
              </div>
              <div className="flex flex-col h-24 pl-0.5 pr-2">
                <h2 className="mt-1 text-lg font-semibold leading-tight line-clamp-2 font-Work_Sans">
                  {idiom.idiom}
                </h2>
                <div className="mt-auto">
                  <p className="text-sm font-light line-clamp-2">
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
