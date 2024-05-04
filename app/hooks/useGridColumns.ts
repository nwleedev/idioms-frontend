import { useMemo } from "react";
import useMediaQuery from "./useMediaQuery";

const useGridColumns = () => {
  const hasColumn100 = useMediaQuery({
    query: "(max-width: 575px)",
  });
  const hasColumn200 = useMediaQuery({
    query: "(min-width: 575px) and (max-width: 835px)",
  });
  const hasColumn300 = useMediaQuery({
    query: "(min-width: 835px)",
  });

  const columns = useMemo(() => {
    if (hasColumn300) {
      return 3;
    } else if (hasColumn200) {
      return 2;
    }
    return 1;
  }, [hasColumn200, hasColumn300]);

  const maxWidth = useMemo(() => {
    if (hasColumn100) {
      return "max-w-[435px]";
    }
    return "max-w-[1080px]";
  }, [hasColumn100]);

  return { columns, maxWidth };
};

export default useGridColumns;
