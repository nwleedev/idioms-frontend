import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useCreateIdiomInputs from "~/hooks/useCreateIdiomInputs";
import useModalContext from "~/hooks/useModalContext";
import { IdiomInput } from "~/types/idiom";
import { GuardV3 } from "../Guard";

interface IdiomInputsModalProps {
  isOpen: boolean;
  onClick?: () => unknown;
  onClose?: () => unknown;
}

const IdiomInputsModal = () => {
  const { state, onChange } = useModalContext({ key: "idiomInputs" });

  return (
    <GuardV3 when={state?.isOpen}>
      {({ when }) => {
        return (
          <InnerModal
            isOpen={when}
            onClick={() => onChange({ isOpen: false })}
            onClose={() => onChange({ isOpen: false })}
          />
        );
      }}
    </GuardV3>
  );
};

const InnerModal = (props: IdiomInputsModalProps) => {
  const { isOpen, onClick, onClose } = props;
  const [textInput, setTextInput] = useState("");
  const { mutateAsync } = useCreateIdiomInputs();
  const input = useMemo(() => {
    try {
      const parsed = JSON.parse(textInput) as IdiomInput[];
      return {
        idioms: parsed,
        isValid: true,
      };
    } catch (error) {
      return {
        idioms: undefined,
        isValid: false,
      };
    }
  }, [textInput]);
  const portalRef = useRef(null as HTMLElement | null);
  const modalRef = useRef(null as HTMLElement | null);
  const textareaRef = useRef(null as HTMLTextAreaElement | null);
  const buttonRef = useRef(null as HTMLButtonElement | null);

  useEffect(() => {
    const onClickAway = function (event: MouseEvent) {
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (modalRef.current?.contains(target)) {
        return;
      }
      if (isOpen) {
        onClose?.();
      }
    };
    portalRef.current?.addEventListener("click", onClickAway);
    return () => {
      portalRef.current?.removeEventListener("click", onClickAway);
    };
  }, [onClose, isOpen]);

  useEffect(() => {
    const onInputFormat = function (event: MouseEvent) {
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (
        target.isSameNode(buttonRef.current) ||
        target.isSameNode(textareaRef.current)
      ) {
        return;
      }
      try {
        const textContent = textareaRef.current?.textContent ?? "";
        const formatted = JSON.stringify(JSON.parse(textContent), null, 4);
        setTextInput(formatted);
      } catch (error) {
        return;
      }
    };
    modalRef.current?.addEventListener("click", onInputFormat);
    return () => {
      modalRef.current?.removeEventListener("click", onInputFormat);
    };
  }, []);

  return createPortal(
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-60 flex justify-center items-center overflow-hidden"
      ref={(element) => {
        portalRef.current = element;
      }}
    >
      <article
        className="flex flex-col max-w-[720px] w-full max-h-[320px] h-full bg-white rounded-xl p-4 gap-y-2 m-4"
        ref={(element) => {
          modalRef.current = element;
        }}
      >
        <h2 className="text-center text-base font-semibold">New Thumbnail</h2>
        <p className="text-center text-sm">
          Put a url of image matches the idiom.
        </p>
        <textarea
          id={`idiomInputs`}
          className="w-full h-full border rounded mt-4 mb-1"
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
          ref={(element) => (textareaRef.current = element)}
        />
        <div className="flex w-full gap-x-1">
          <p className="text-xs">Input should be JSON format like</p>
          <pre className="text-xs">
            {`[{"idiom": "A Idiom", "meaning": "A Meaning of the idiom"}]`}
          </pre>
        </div>
        <button
          onClick={async () => {
            if (input.idioms) {
              await mutateAsync(input.idioms);
            }
            onClick?.();
          }}
          className="mt-auto"
          disabled={!input.isValid}
          ref={(element) => (buttonRef.current = element)}
        >
          Upload
        </button>
      </article>
    </div>,
    document.getElementById("modal")!
  );
};

export default IdiomInputsModal;
