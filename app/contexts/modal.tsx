import { Dispatch, PropsWithChildren, createContext, useReducer } from "react";
import { Idiom } from "~/types/idiom";

export interface AppModal {
  upload: {
    isOpen: boolean;
    idiom?: Idiom;
  };
  idiomInputs: {
    isOpen: boolean;
  };
  create: {
    isOpen: boolean;
    idiom?: Idiom;
  };
}

export interface ModalAction<K extends keyof AppModal = keyof AppModal> {
  payload: {
    key: K;
    value: AppModal[K];
  };
}

export const ModalContext = createContext({
  store: undefined! as AppModal,
  dispatch: undefined! as Dispatch<ModalAction<keyof AppModal>>,
});

const modalReducer = (state: AppModal, action: ModalAction) => {
  const {
    payload: { key, value },
  } = action;
  switch (key) {
    case "upload":
    case "create": {
      state = {
        ...state,
        [key]: value as AppModal["upload"],
      };
      break;
    }
    case "idiomInputs": {
      state = {
        ...state,
        [key]: value as AppModal["idiomInputs"],
      };
      break;
    }
  }
  return state;
};

export const ModalsProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [store, dispatch] = useReducer(modalReducer, {
    create: { isOpen: false, idiom: undefined },
    upload: { isOpen: false, idiom: undefined },
    idiomInputs: { isOpen: false },
  } satisfies AppModal);

  return (
    <ModalContext.Provider value={{ store, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
