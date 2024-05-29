export interface IdiomTableHeadProps {
  className?: string;
  absolute?: boolean;
  sticky?: boolean;
}

const IdiomTableHead = (props: IdiomTableHeadProps) => {
  const { absolute = false, sticky = false, className = "" } = props;
  return (
    <>
      <thead
        className={`bg-gray-50 dark:bg-slate-800 ${
          absolute ? "absolute" : ""
        } ${className ?? ""} ${sticky ? "sticky" : ""}`}
      >
        <tr>
          <th
            scope="col"
            className="px-3 py-3 text-start whitespace-nowrap min-w-64"
          >
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200">
              Idiom
            </span>
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-start whitespace-nowrap min-w-[345px] max-w-full"
          >
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200">
              Meaning
            </span>
          </th>
          <th
            scope="col"
            className="px-3 py-3 size-px text-start whitespace-nowrap"
          >
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200"></span>
          </th>
          <th scope="col" className="px-6 py-3 text-start whitespace-nowrap">
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200">
              Thumbnail
            </span>
          </th>
          <th scope="col" className="px-3 py-3 text-start whitespace-nowrap">
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200">
              Created At
            </span>
          </th>
          <th scope="col" className="py-3 text-start whitespace-nowrap">
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-200">
              Upload
            </span>
          </th>
        </tr>
      </thead>
    </>
  );
};

export default IdiomTableHead;
