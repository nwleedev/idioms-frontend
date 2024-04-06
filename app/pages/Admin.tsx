import CreateModal from "~/components/CreateModal";
import IdiomInputsModal from "~/components/IdiomInputsModal";
import IdiomTableHead from "~/components/IdiomTableHead";
import IdiomTableRow from "~/components/IdiomTableRow";
import UploadModal from "~/components/UploadModal";
import useIdioms from "~/hooks/useIdioms";
import useModalContext from "~/hooks/useModalContext";
import style from "./Admin.css?url";

export const css = [{ rel: "stylesheet", href: style }];

const Admin = () => {
  const { data } = useIdioms({
    count: 100,
  });
  const idioms = data?.pages.map((page) => page.idioms).flat(1);
  const { onChange } = useModalContext({ key: "idiomInputs" });

  return (
    <div className="w-full p-4">
      <main className="inline-flex flex-col w-full mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 font-Work_Sans">
          Idiom Panel
        </h2>
        <article className="relative">
          <div className="overflow-y-scroll max-h-[600px] h-full pb-2 dark:bg-slate-900">
            <table className="w-full py-2">
              <IdiomTableHead sticky={true} className="top-0 left-0 right-0" />
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:bg-slate-900">
                {idioms?.map((idiom) => {
                  return <IdiomTableRow idiom={idiom} key={idiom.id} />;
                })}
              </tbody>
            </table>
          </div>
        </article>
        <div className="inline-flex gap-x-1">
          <button
            onClick={() => {
              onChange({ isOpen: true });
            }}
            className="px-4 py-1 my-2 text-sm text-white bg-red-500 rounded-lg"
          >
            Add Inputs
          </button>
        </div>
      </main>
      <IdiomInputsModal />
      <UploadModal />
      <CreateModal />
    </div>
  );
};

export default Admin;
