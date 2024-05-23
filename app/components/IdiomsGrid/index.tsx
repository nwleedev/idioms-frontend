import { useEffect, useRef, useState } from "react";
import { FixedSizeGrid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Idiom } from "~/types/idiom";
import GridIdiom from "../GridIdiom";
import { GuardV3 } from "../Guard";

import useGridColumns from "~/hooks/useGridColumns";
import { cs } from "~/lib/classnames";
import style from "./index.scss?url";

export const css = [{ rel: "stylesheet", href: style }];

export interface IdiomsGridProps {
  idioms?: Idiom[];
  isFetched?: boolean;
  isFetching?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => unknown;
}

const fallback = () => {
  console.warn("The function is not implemented");
};

const IdiomsGrid = (props: IdiomsGridProps) => {
  const {
    idioms,
    isFetched,
    isFetching,
    hasNextPage,
    fetchNextPage = fallback,
  } = props;
  const gridRef = useRef(null as HTMLElement | null);
  const [gridHeight, setGridHeight] = useState(480);
  const [gridWidth, setGridWidth] = useState(0);
  const { columns, maxWidth } = useGridColumns();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.target.isSameNode(document.body)) {
          return;
        }
        if (gridRef.current?.clientHeight !== undefined) {
          const height = gridRef.current?.clientHeight - 1;
          setGridHeight(height);
        }
      });
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const gridCopy = gridRef.current;
    if (!isFetched || !gridCopy) {
      return;
    }
    const initialWidth = gridCopy.clientWidth;
    if (initialWidth) {
      setGridWidth(initialWidth);
    }
    if (gridRef.current?.clientHeight !== undefined) {
      const height = gridRef.current?.clientHeight;
      setGridHeight(height - 1);
    }
  }, [isFetched]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.target.isSameNode(document.body)) {
          return;
        }
        if (!gridRef.current) {
          return;
        }
        setGridWidth(gridRef.current.clientWidth);
      });
    });
    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <GuardV3 data={{ idioms }} when={!!idioms}>
      {({ data: { idioms } }) => {
        return (
          <article
            className={cs("flex w-full h-full min-h-0", maxWidth)}
            ref={(element) => (gridRef.current = element)}
          >
            <InfiniteLoader
              itemCount={idioms.length + 1}
              isItemLoaded={(index) => idioms[index] !== undefined}
              loadMoreItems={() => {
                if (hasNextPage && !isFetching) {
                  fetchNextPage();
                }
              }}
            >
              {({ onItemsRendered, ref }) => {
                return (
                  <FixedSizeGrid
                    onItemsRendered={(renderProps) => {
                      const {
                        visibleRowStartIndex,
                        visibleRowStopIndex,
                        overscanRowStartIndex,
                        overscanRowStopIndex,
                      } = renderProps;
                      return onItemsRendered({
                        visibleStartIndex: visibleRowStartIndex * columns,
                        visibleStopIndex: visibleRowStopIndex * columns,
                        overscanStartIndex: overscanRowStartIndex * columns,
                        overscanStopIndex: overscanRowStopIndex * columns,
                      });
                    }}
                    onScroll={() => {
                      console.log("OK");
                    }}
                    className="!overflow-x-hidden !overflow-y-scroll idiomsGrid"
                    ref={ref}
                    width={gridWidth}
                    height={gridHeight}
                    rowCount={
                      columns !== 0 ? Math.ceil(idioms.length / columns) : 0
                    }
                    rowHeight={360}
                    columnCount={columns}
                    columnWidth={columns !== 0 ? (gridWidth - 8) / columns : 0}
                  >
                    {({ rowIndex, columnIndex, style }) => {
                      const idiomIndex = rowIndex * columns + columnIndex;
                      return (
                        <GridIdiom
                          idiom={idioms[idiomIndex]}
                          columnIndex={columnIndex}
                          columns={columns}
                          style={style}
                        />
                      );
                    }}
                  </FixedSizeGrid>
                );
              }}
            </InfiniteLoader>
          </article>
        );
      }}
    </GuardV3>
  );
};

export default IdiomsGrid;
