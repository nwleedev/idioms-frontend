import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useIsHydrated from "~/hooks/useIsHydrated";
import Button from "../Button";

interface ModalProps extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  labels: {
    click: string | undefined;
    close: string | undefined;
  };
  onClose?: () => unknown;
  onClick?: () => unknown;
  onHydrated?: () => unknown;
}

const Modal = (props: ModalProps) => {
  const { title, isOpen, labels, children, onClick, onClose, onHydrated } =
    props;

  const portalRef = useRef(null as HTMLElement | null);
  const modalRef = useRef(null as HTMLElement | null);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated || !onHydrated) {
      return;
    }
    onHydrated();
  }, [isHydrated, onHydrated]);

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
    portalRef.current?.addEventListener("mousedown", onClickAway);
    return () => {
      portalRef.current?.removeEventListener("mousedown", onClickAway);
    };
  }, [onClose, isOpen]);

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
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        {children}
        <div className="flex justify-center mt-auto gap-x-2">
          <Button onClick={() => onClick?.()} className="" fontSize="sm">
            {labels.click}
          </Button>
          <Button
            onClick={async () => {
              onClose?.();
            }}
            className="bg-orange-500"
            fontSize="sm"
            action="success"
          >
            {labels.close}
          </Button>
        </div>
      </article>
    </div>,
    document.getElementById("modal")!
  );
};

export default Modal;
