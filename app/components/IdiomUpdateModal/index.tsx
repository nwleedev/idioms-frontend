import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FormEvent, useRef } from "react";
import useCreateExamples from "~/hooks/useCreateExamples";
import useIdiom from "~/hooks/useIdiom";
import useModalContext from "~/hooks/useModalContext";
import useUpdateExamples from "~/hooks/useUpdateExamples";
import Button from "../Button";
import { GuardV3 } from "../Guard";
import Modal from "../Modal";

const IdiomUpdateModal = () => {
  const { state, onChange } = useModalContext({ key: "idiomUpdate" });
  const formRef = useRef(null as HTMLFormElement | null);
  const { idiom } = useIdiom({ id: state?.idiom?.id });
  const { mutateAsync: create } = useCreateExamples({ idiom: idiom });
  const { mutateAsync: update } = useUpdateExamples({ idiom: idiom });

  const onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!formRef.current || !idiom) {
      return;
    }
    const textareas = formRef.current.querySelectorAll("textarea");
    let meaningBrief: string = "";
    let meaningFull: string = "";
    const examples: string[] = [];
    for (let index = 0; index < textareas.length; index++) {
      if (index === 0) {
        meaningBrief = textareas[index].value;
      } else if (index === 1) {
        meaningFull = textareas[index].value;
      } else {
        examples.push(textareas[index].value);
      }
    }
    if (!meaningBrief || !meaningFull) {
      return;
    }
    update({
      id: idiom.id,
      idiom: idiom.idiom,
      meaningBrief,
      meaningFull,
      examples,
    });
  };

  return (
    <GuardV3 data={{ idiom: idiom }} when={state?.isOpen}>
      {({ data: { idiom } }) => {
        return (
          <Modal
            title="Idiom Specs"
            isOpen
            onClick={async () => {
              await onSubmit();
            }}
            onClose={() => onChange({ isOpen: false, idiom: undefined })}
            labels={{ click: "Create", close: "Close" }}
          >
            <div className="relative flex flex-col overflow-y-scroll gap-y-1 max-h-96">
              <div className="sticky top-0 flex items-center justify-between py-1 bg-white">
                <div className="flex gap-x-0.5">
                  <h1 className="text-2xl font-bold">{idiom.idiom}</h1>
                  <Button
                    action="info"
                    onClick={() => {
                      const text = `${idiom.idiom}\n\n\n${
                        idiom.meaningBrief
                      }\n\n\n${idiom.meaningFull}\n\n\n${idiom.examples.join(
                        "\n\n"
                      )}`;
                      window.navigator.clipboard.writeText(text);
                    }}
                  >
                    Copy All
                  </Button>
                </div>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    create();
                  }}
                  className="flex text-sm font-light text-gray-600 gap-x-1"
                >
                  <span>Refresh</span>
                  <ArrowPathIcon className="text-gray-600" width={14} />
                </a>
              </div>
              <form
                method="post"
                className="flex flex-col"
                onSubmit={onSubmit}
                ref={(element) => (formRef.current = element)}
              >
                <div className="flex flex-col gap-y-1">
                  <textarea
                    className="text-base font-light resize-none py-0.5 px-1 mx-1 outline-none border-gray-400 border rounded"
                    defaultValue={idiom.meaningBrief}
                  />
                  <textarea
                    className="text-sm font-light resize-none py-0.5 px-1 mx-1 min-h-40 outline-none border-gray-400 border rounded"
                    defaultValue={idiom.meaningFull}
                  />
                </div>
                <div className="flex flex-col mt-1 gap-y-1">
                  {idiom.examples.map((example) => {
                    return (
                      <textarea
                        className="text-sm font-light text-gray-600 px-1 py-0.5 resize-none mx-1"
                        key={example}
                        defaultValue={example}
                      />
                    );
                  })}
                </div>
              </form>
            </div>
          </Modal>
        );
      }}
    </GuardV3>
  );
};

export default IdiomUpdateModal;
