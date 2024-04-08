import {
  DocumentArrowUpIcon,
  LinkIcon,
  PaperAirplaneIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { format } from "date-fns/format";
import useModalContext from "~/hooks/useModalContext";
import useUploadThumbnail from "~/hooks/useUploadThumbnail";
import { Idiom } from "~/types/idiom";
import Guard from "../Guard";

export interface IdiomTableRowProps {
  idiom: Idiom;
}

const IdiomTableRow = (props: IdiomTableRowProps) => {
  const { idiom } = props;
  const createdAt = format(idiom.createdAt, "MMM dd, yyyy HH:mm:ss");
  const { mutateAsync, reset } = useUploadThumbnail({ idiom, type: "file" });
  const { onChange } = useModalContext({ key: "upload" });
  const { onChange: onCreateChange } = useModalContext({ key: "create" });
  return (
    <>
      <tr>
        <td className="size-px min-w-[120px] whitespace-nowrap px-3 py-3">
          <div className="flex items-center gap-x-3">
            <span className="font-semibold text-sm text-gray-800 dark:text-white">
              {idiom.idiom}
            </span>
          </div>
        </td>
        <td className="size-px min-w-[240px] px-3 py-0.5">
          <span className="text-xs text-gray-800 dark:text-white">
            {idiom.meaningBrief}
          </span>
        </td>
        <Guard when={!!idiom.thumbnail}>
          <td className="size-px min-w-[300px] whitespace-nowrap px-3 py-3">
            <div className="flex items-center gap-x-1">
              <Link
                to={`https://static.useidioms.com/${idiom.thumbnail}`}
                target="_blank"
                rel="noreferrer noopener"
                className=""
              >
                <span className="text-sm text-gray-800 dark:text-white hover:border-b-2 hover:border-gray-700 hover:dark:border-white">
                  {idiom.thumbnail}
                </span>
              </Link>
              <button
                onClick={() => {
                  window.navigator.clipboard.writeText(
                    `https://static.useidioms.com/${idiom.thumbnail}`
                  );
                }}
              >
                <Square2StackIcon
                  className="text-gray-800 dark:text-white hover:bg-gray-100 rounded"
                  width={"20"}
                />
              </button>
            </div>
          </td>
        </Guard>
        <Guard when={!idiom.thumbnail}>
          <td className="size-px min-w-[300px] whitespace-nowrap px-3 py-3 text-center">
            <span className="text-sm text-gray-800 dark:text-white mx-auto">
              -
            </span>
          </td>
        </Guard>

        <td className="size-px min-w-[200px] px-3 py-0.5">
          <span className="text-xs text-gray-800 dark:text-white">
            {idiom.thumbnailPrompt}
          </span>
        </td>
        <td className="size-px whitespace-nowrap px-3 py-3">
          <span className="text-sm text-gray-800 dark:text-white">
            {createdAt}
          </span>
        </td>
        <td className="size-px whitespace-nowrap py-3">
          <section className="flex items-center gap-x-1">
            <label
              htmlFor={`thumbnail:file:${idiom.id}`}
              className="inline-flex rounded-sm text-xs gap-x-0.5 font-semibold bg-slate-600 text-white py-1.5 px-2"
              onClick={() => {
                reset();
              }}
            >
              <span>File</span>
              <DocumentArrowUpIcon className="font-light" width={16} />
              <input
                type="file"
                id={`thumbnail:file:${idiom.id}`}
                className="hidden"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files === null) {
                    console.error("No files");
                    return;
                  }
                  mutateAsync({ file: files[0] });
                }}
              />
            </label>
            <button
              className="inline-flex rounded-sm text-xs gap-x-0.5 font-semibold bg-red-500 text-white py-1.5 px-2"
              onClick={() => {
                onChange({ isOpen: true, idiom: idiom });
              }}
            >
              <span>URL</span>
              <LinkIcon className="font-light" width={16} />
            </button>
            <button
              className="inline-flex rounded-sm text-xs gap-x-0.5 font-semibold bg-orange-500 text-white py-1.5 px-2"
              onClick={() => {
                onCreateChange({ isOpen: true, idiom: idiom });
              }}
            >
              <span>AI</span>
              <PaperAirplaneIcon className="font-light" width={16} />
            </button>
          </section>
        </td>
      </tr>
    </>
  );
};

export default IdiomTableRow;
