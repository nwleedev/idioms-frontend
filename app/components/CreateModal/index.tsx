import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useCreateThumbnail from "~/hooks/useCreateThumbnail";
import useModalContext from "~/hooks/useModalContext";
import useUploadThumbnail from "~/hooks/useUploadThumbnail";
import { Idiom } from "~/types/idiom";
import Button from "../Button";
import { GuardV3 } from "../Guard";

const CreateModal = () => {
  const { state, onChange } = useModalContext({ key: "create" });

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

interface CreateModalProps {
  idiom: Idiom;
  isOpen: boolean;
  onClose?: () => unknown;
  onClick?: () => unknown;
}

const InnerModal = (props: CreateModalProps) => {
  const { idiom, isOpen, onClose } = props;

  const portalRef = useRef(null as HTMLElement | null);
  const modalRef = useRef(null as HTMLElement | null);
  const { data: image, mutateAsync, isPending, reset } = useCreateThumbnail();
  const { mutateAsync: upload } = useUploadThumbnail({ type: "url", idiom });
  const [imagePrompt, setPrompt] = useState(idiom.description);

  useEffect(() => {
    const onClickAway = function (event: MouseEvent) {
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (modalRef.current?.contains(target)) {
        return;
      }
      if (isOpen && !isPending) {
        onClose?.();
      }
    };
    portalRef.current?.addEventListener("click", onClickAway);
    return () => {
      portalRef.current?.removeEventListener("click", onClickAway);
    };
  }, [onClose, isOpen, isPending]);
  const onCreate = useCallback(
    async (imagePrompt: string) => {
      reset();
      await mutateAsync({ prompt: imagePrompt });
    },
    [mutateAsync, reset]
  );
  return createPortal(
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center overflow-hidden bg-gray-500 bg-opacity-60"
      ref={(element) => {
        portalRef.current = element;
      }}
    >
      <article
        className="flex flex-col max-w-[720px] w-full min-h-[240px] bg-white rounded-sm py-4 px-6 gap-y-2 m-4"
        ref={(element) => {
          modalRef.current = element;
        }}
      >
        <h2 className="text-xl font-semibold text-center">New Thumbnail</h2>
        <p className="text-sm text-center">
          Put a url of image matches the idiom.
        </p>
        <input
          type="url"
          id={`thumbnail:url:${idiom.idiom}`}
          className="w-full px-2 mt-6 border rounded"
          value={imagePrompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div
          className="flex w-full h-64 bg-gray-500 bg-center rounded shadow"
          style={{
            backgroundImage:
              image &&
              `url('https://static.useidioms.com/${
                image.source
              }?created_at=${image.createdAt.getTime()}')`,
          }}
        >
          {image && (
            <img
              src={`https://static.useidioms.com/${
                image.source
              }?created_at=${image.createdAt.getTime()}`}
              alt=""
              className="object-contain backdrop-blur-sm"
            />
          )}
        </div>
        <div className="flex justify-center mt-auto gap-x-2">
          <Button
            onClick={() => onCreate(imagePrompt)}
            className=""
            fontSize="sm"
          >
            {isPending ? "Creating" : "Create"}
          </Button>
          <Button
            onClick={() => {
              if (!image) {
                return;
              }
              upload({
                url: `https://static.useidioms.com/${image.source}`,
              });
            }}
            className="bg-orange-500"
            fontSize="sm"
            action="success"
          >
            Upload
          </Button>
        </div>
      </article>
    </div>,
    document.getElementById("modal")!
  );
};

export default CreateModal;
