import { useCallback, useSyncExternalStore } from "react";

export interface UseMediaQueryProps {
  query?: string;
}

const onServerSnapshot = () => {
  return null;
};

const useMediaQuery = (props: UseMediaQueryProps) => {
  const { query } = props;

  const onSubscribe = useCallback(
    (onStoreChange: () => unknown) => {
      if (!query) {
        return () => {};
      }
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", onStoreChange);
      return () => {
        matchMedia.removeEventListener("change", onStoreChange);
      };
    },
    [query]
  );

  const onSnapshot = useCallback(() => {
    if (!query) {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(onSubscribe, onSnapshot, onServerSnapshot);
};

export default useMediaQuery;
