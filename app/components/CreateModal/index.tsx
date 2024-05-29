import { ArrowPathIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useCreateDescription from "~/hooks/useCreateDescription";
import useCreateThumbnail from "~/hooks/useCreateThumbnail";
import useIsHydrated from "~/hooks/useIsHydrated";
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

function createHash() {
  const rand = (Math.random() * Date.now()).toString(36);
  return rand.split(".")[0].slice(0, 8);
}

const InnerModal = (props: CreateModalProps) => {
  const { idiom, isOpen, onClose } = props;

  const portalRef = useRef(null as HTMLElement | null);
  const modalRef = useRef(null as HTMLElement | null);
  const { data: image, mutateAsync, isPending, reset } = useCreateThumbnail();
  const { mutateAsync: onCreateThumbnail, data: description } =
    useCreateDescription({
      id: idiom.id,
    });
  const isHydrated = useIsHydrated();
  const { mutateAsync: upload } = useUploadThumbnail({ type: "url", idiom });
  const [promptHashes, setHashes] = useState([
    createHash(),
    createHash(),
    createHash(),
    createHash(),
    createHash(),
    createHash(),
    createHash(),
    createHash(),
    createHash(),
  ]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const inputs = modalRef.current?.querySelectorAll("input");
    if (!inputs) {
      console.warn("Input components not rendered");
      return;
    }
    Array.from(inputs).forEach((input, index) => {
      if (index === 0) {
        input.value = "The painting should be high quality.";
      }
      if (index === 1) {
        input.value = "The painting should adapt watercolor art style.";
      }
      if (index === 2) {
        input.value = "The painting should be much clear.";
      }
      if (index === 3) {
        input.value = "The painting should be more detailed.";
      }
      if (index === 4) {
        input.value = "The painting must not include any letters.";
      }
      if (index === 5) {
        input.value = "The painting must not include any text characters.";
      }
      if (index === 6) {
        input.value = "X is male.";
      }
      if (index === 7) {
        input.value = "X is American.";
      }
    });
  }, [isHydrated]);

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
    portalRef.current?.addEventListener("mousedown", onClickAway);
    return () => {
      portalRef.current?.removeEventListener("mousedown", onClickAway);
    };
  }, [onClose, isOpen, isPending]);
  const onCreate = useCallback(async () => {
    const inputs = modalRef.current?.querySelectorAll("input");
    if (!inputs) {
      console.warn("Input components not rendered");
      return;
    }
    const imagePrompt = Array.from(inputs)
      .map((e) => e.value)
      .join("\n");
    reset();
    await mutateAsync({ prompt: imagePrompt });
  }, [mutateAsync, reset]);
  return createPortal(
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center overflow-hidden bg-gray-500 bg-opacity-60"
      ref={(element) => {
        portalRef.current = element;
      }}
    >
      <article
        className="flex flex-col max-w-[840px] w-full min-h-[480px] bg-white rounded-sm py-4 px-6 gap-y-2 m-4"
        ref={(element) => {
          modalRef.current = element;
        }}
      >
        <h2 className="text-xl font-semibold text-center">New Thumbnail</h2>
        <div className="flex flex-col gap-y-1">
          <p className="">Input prompts and create thumbnails.</p>
          <p className="text-sm font-light">
            {description?.description ?? idiom.description}
            <a
              className="inline-flex items-center ml-2 gap-x-1"
              onClick={(event) => {
                event.preventDefault();
                onCreateThumbnail();
              }}
            >
              <span className="text-xs font-light text-gray-600">Refresh</span>
              <ArrowPathIcon className="text-gray-600" width={14} />
            </a>
          </p>
        </div>
        <div className="flex w-full gap-x-2">
          <section className="relative flex flex-col gap-y-1.5 max-w-[360px] w-full h-[320px] overflow-y-auto pr-2">
            <div className="sticky flex items-center justify-between w-full">
              <h2 className="text-lg font-bold">Prompts</h2>
              <Button
                action="danger"
                onClick={() => setHashes((hashes) => [...hashes, createHash()])}
              >
                Add
              </Button>
            </div>
            {promptHashes.map((hash, index) => {
              return (
                <div
                  key={`prompt:${hash}`}
                  className="flex items-center w-full gap-x-1"
                >
                  <input
                    type="text"
                    name={`prompt:${hash}`}
                    className="w-full border-2 rounded-sm font-light px-0.5"
                  />
                  <button
                    className="w-6 h-6 text-white bg-red-500 rounded-full min-w-6"
                    onClick={() =>
                      setHashes((hashes) =>
                        hashes.filter((_, hashIndex) => index !== hashIndex)
                      )
                    }
                  >
                    <MinusIcon className="w-full" />
                  </button>
                </div>
              );
            })}
          </section>
          <div
            className="flex w-full h-64 bg-gray-500 bg-center rounded shadow "
            style={{
              backgroundImage:
                image &&
                `url('https://static.useidioms.com/${
                  image.source
                }?createdAt=${image.createdAt.getTime()}')`,
            }}
          >
            <div className="flex justify-center w-full h-full backdrop-blur-sm">
              {image && (
                <img
                  src={`https://static.useidioms.com/${
                    image.source
                  }?createdAt=${image.createdAt.getTime()}`}
                  alt={`Draft created at ${image.createdAt.toLocaleString()}`}
                  className="object-contain h-full backdrop-blur-sm"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-auto gap-x-2">
          <Button onClick={() => onCreate()} className="" fontSize="sm">
            {isPending ? "Creating" : "Create"}
          </Button>
          <Button
            onClick={async () => {
              if (!image) {
                return;
              }
              await upload({
                url: `https://static.useidioms.com/${image.source}`,
              });
              onClose?.();
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
