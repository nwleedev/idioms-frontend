import { useCallback, useContext, useMemo } from "react";
import { AppModal, ModalContext } from "~/contexts/modal";

interface UseModalContextProps<K extends keyof AppModal> {
  key?: K;
}

const useModalContext = <K extends keyof AppModal>(
  props: UseModalContextProps<K>
) => {
  const { key } = props;

  const { store, dispatch } = useContext(ModalContext);

  const state = useMemo(() => {
    if (key === undefined) {
      return;
    }
    return store[key];
  }, [store, key]);

  const onChange = useCallback(
    (value: AppModal[K]) => {
      if (key === undefined) {
        return;
      }
      dispatch({ payload: { key: key, value: value } });
    },
    [dispatch, key]
  );

  return { state, onChange };
};

export default useModalContext;
