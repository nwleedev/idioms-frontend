import { useQuery } from "@tanstack/react-query";
import { httpMethods } from "~/constants/http";
import { Idiom } from "~/types/idiom";
import useApi from "./useApi";

export interface UseIdiomProps {
  id?: string;
}

const useIdiom = (props: UseIdiomProps) => {
  const { id } = props;
  const url = useApi({
    paths: id === undefined ? undefined : ["idioms", id],
  });
  const queryKey = [
    {
      key: "useIdiom",
      url,
    },
  ] as const;
  const {
    data: idiom,
    refetch,
    error,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      const { url } = queryKey[0];
      if (!url) {
        return;
      }

      const response = await fetch(url, {
        method: httpMethods.GET,
      });

      const data: { idiom: Idiom } = await response.json();
      return data.idiom;
    },
  });

  return {
    idiom,
    refetch,
    error,
    isFetching,
  };
};

export default useIdiom;
