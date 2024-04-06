import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

const onSubscribe = (onStoreChange: () => unknown) => {
  const onStorage = function () {
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
  };
};

const onServerSnapshot = () => {
  return null;
};

const updateLocalStorage = <K extends string, V>(key: K, value: V) => {
  const formatted = JSON.stringify(value);
  window.localStorage.setItem(key, formatted);
  window.dispatchEvent(
    new StorageEvent("storage", { key, newValue: formatted })
  );
};

const useLocalStorage = <K extends string, V>(key: K, initialValue?: V) => {
  const onSnapshot = useCallback(() => {
    return window.localStorage.getItem(key);
  }, [key]);

  const store = useSyncExternalStore(onSubscribe, onSnapshot, onServerSnapshot);

  const setState = useCallback(
    (action: V | ((next: V) => V)) => {
      if (!(action instanceof Function)) {
        updateLocalStorage(key, action);
        return;
      }
      let parsed = null as V | null;
      try {
        parsed = store ? JSON.parse(store) : null;
      } catch (error) {
        console.warn(error);
      }
      if (parsed !== null) {
        const nextValue = action(parsed);
        updateLocalStorage(key, nextValue);
      }
    },
    [key, store]
  );

  const removeState = useCallback(() => {
    window.localStorage.removeItem(key);
  }, [key]);

  useEffect(() => {
    if (
      window.localStorage.getItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      updateLocalStorage(key, initialValue);
    }
  }, [key, initialValue]);

  const parsed = useMemo(() => {
    try {
      if (store) {
        return JSON.parse(store) as V;
      }
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  }, [store]);

  return { state: parsed, setState, removeState };
};

export default useLocalStorage;
