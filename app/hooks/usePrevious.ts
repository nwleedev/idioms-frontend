import { useEffect, useRef } from "react";

interface UsePreviousProps<U> {
  value: U;
  isEqual?: (current?: U, value?: U) => unknown;
}

const usePrevious = <U>({ value, isEqual }: UsePreviousProps<U>) => {
  const previousRef = useRef<U>();

  useEffect(() => {
    const refCopy = previousRef.current;
    if (isEqual && !isEqual(value, refCopy)) {
      previousRef.current = value;
    } else if (value !== refCopy) {
      previousRef.current = value;
    }
  }, [value, isEqual]);

  return previousRef.current;
};

export default usePrevious;
