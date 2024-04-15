import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useModalContext from "~/hooks/useModalContext";
import useUploadThumbnail from "~/hooks/useUploadThumbnail";
import { Idiom } from "~/types/idiom";
import { GuardV3 } from "../Guard";

export interface UploadModalProps {
  idiom: Idiom;
  isOpen: boolean;

  onClose?: () => unknown;
  onClick?: () => unknown;
}

const UploadModal = () => {
  const { state, onChange } = useModalContext({ key: "upload" });

  return (
    <GuardV3 data={{ idiom: state?.idiom }} when={state?.isOpen}>
      {({ data: { idiom }, when }) => {
        return (
          <InnerModal
            idiom={idiom}
            isOpen={when}
            onClick={() => onChange({ idiom: undefined, isOpen: false })}
            onClose={() => onChange({ idiom: undefined, isOpen: false })}
          />
        );
      }}
    </GuardV3>
  );
};

const InnerModal = (props: UploadModalProps) => {
  const { idiom, isOpen, onClick, onClose } = props;
  const portalRef = useRef(null as HTMLElement | null);
  const modalRef = useRef(null as HTMLElement | null);
  const { mutateAsync } = useUploadThumbnail({ idiom, type: "url" });
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
  const [url, setUrl] = useState("");
  const onCreate = useCallback(
    async (url: string) => {
      await mutateAsync({ url: btoa(url) });

      onClick?.();
    },
    [mutateAsync, onClick]
  );
  return createPortal(
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center overflow-hidden bg-gray-500 bg-opacity-60"
      ref={(element) => {
        portalRef.current = element;
      }}
    >
      <article
        className="flex flex-col max-w-[720px] w-full h-[240px] bg-white rounded-sm px-4 py-2 gap-y-2 m-4"
        ref={(element) => {
          modalRef.current = element;
        }}
      >
        <h2 className="text-base font-semibold text-center">New Thumbnail</h2>
        <p className="text-sm text-center">
          Put a url of image matches the idiom.
        </p>
        <input
          type="url"
          id={`thumbnail:url:${idiom.idiom}`}
          className="w-full mt-4 border rounded"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button onClick={() => onCreate(url)} className="mt-auto">
          Upload
        </button>
      </article>
    </div>,
    document.getElementById("modal")!
  );
};

export default UploadModal;
