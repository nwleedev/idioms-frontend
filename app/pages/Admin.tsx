import {
  Dispatch,
  Fragment,
  HTMLProps,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
} from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Button from "~/components/Button";
import CreateModal from "~/components/CreateModal";
import IdiomInputsModal from "~/components/IdiomInputsModal";
import IdiomTableHead from "~/components/IdiomTableHead";
import IdiomTableRow from "~/components/IdiomTableRow";
import IdiomUpdateModal from "~/components/IdiomUpdateModal";
import UploadModal from "~/components/UploadModal";
import useIdioms from "~/hooks/useIdioms";
import useModalContext from "~/hooks/useModalContext";
import style from "./Admin.css?url";

export const css = [{ rel: "stylesheet", href: style }];

export interface AdminProps {}

const AdminTableContext = createContext({
  top: 0,
  setTop: null! as Dispatch<SetStateAction<number>>,
});

const AdminTable = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  function AdminTable({ children, ...props }, ref) {
    const { top } = useContext(AdminTableContext);

    return (
      <div className="h-full pb-2 dark:bg-slate-900" {...props} ref={ref}>
        <table
          className="w-full py-2"
          style={{ position: "absolute", width: "100%", top }}
        >
          <IdiomTableHead className="sticky top-0 left-0 right-0" />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:bg-slate-900">
            {children}
          </tbody>
        </table>
      </div>
    );
  }
);

const Admin = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useIdioms({});
  const idioms = data?.pages.map((page) => page.idioms).flat(1);
  const { onChange } = useModalContext({ key: "idiomInputs" });
  const itemCount = idioms ? idioms.length + 1 : 0;
  const listRef = useRef(null as FixedSizeList | null);
  const [top, setTop] = useState(0);

  return (
    <div className="w-full p-4">
      <main className="inline-flex flex-col w-full mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 font-Work_Sans">
          Idiom Panel
        </h2>
        <article className="relative">
          <AdminTableContext.Provider value={{ top, setTop }}>
            <InfiniteLoader
              isItemLoaded={(index) => !!(idioms && idioms.at(index))}
              itemCount={itemCount}
              loadMoreItems={() => {
                if (!isFetching && hasNextPage) {
                  fetchNextPage();
                }
              }}
            >
              {({ onItemsRendered, ref: loaderRef }) => {
                return (
                  <FixedSizeList
                    height={600}
                    itemCount={itemCount}
                    itemSize={55}
                    width={"100%"}
                    ref={(ref) => {
                      loaderRef(ref);
                      listRef.current = ref;
                    }}
                    onItemsRendered={(props) => {
                      // @ts-expect-error Style for rendering items on table.
                      const style = listRef.current?._getItemStyle(
                        props.overscanStartIndex
                      );
                      setTop(style?.top ?? 0);

                      return onItemsRendered(props);
                    }}
                    innerElementType={AdminTable}
                  >
                    {({ index }) => {
                      const idiom = idioms?.at(index);
                      if (!idiom) {
                        return <Fragment key={"fragment"} />;
                      }
                      return <IdiomTableRow idiom={idiom} />;
                    }}
                  </FixedSizeList>
                );
              }}
            </InfiniteLoader>
          </AdminTableContext.Provider>
        </article>
        <div className="inline-flex my-2 gap-x-1 ">
          <Button
            action="info"
            onClick={() => {
              onChange({ isOpen: true });
            }}
            className="px-4 py-1 text-sm text-white bg-red-500 rounded-lg"
          >
            Add Inputs
          </Button>
        </div>
      </main>
      <IdiomInputsModal />
      <IdiomUpdateModal />
      <UploadModal />
      <CreateModal />
    </div>
  );
};

export default Admin;
