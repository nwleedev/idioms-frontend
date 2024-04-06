import { useMemo } from "react";
import useMediaQuery from "./useMediaQuery";

const useGridColumns = () => {
  const hasColumn100 = useMediaQuery({
    query: "(max-width: 495px)",
  });
  const hasColumn200 = useMediaQuery({
    query: "(min-width: 495px) and (max-width: 735px)",
  });
  const hasColumn300 = useMediaQuery({
    query: "(min-width: 735px) and (max-width: 975px)",
  });
  const hasColumn400 = useMediaQuery({
    query: "(min-width: 975px)",
  });

  const columns = useMemo(() => {
    if (hasColumn400) {
      return 4;
    } else if (hasColumn300) {
      return 3;
    } else if (hasColumn200) {
      return 2;
    }
    return 1;
  }, [hasColumn200, hasColumn300, hasColumn400]);

  const maxWidth = useMemo(() => {
    if (hasColumn100) {
      return "max-w-[355px]";
    }
    return "max-w-[1080px]";
  }, [hasColumn100]);

  return { columns, maxWidth };
};

export default useGridColumns;
