import { useQuery } from "@tanstack/react-query";
import { httpMethods } from "~/constants/http";
import queryKeys from "~/lib/query-keys";
import { Idiom } from "~/types/idiom";

export interface UseIdiomProps {
  id?: string;
}

const useIdiom = (props: UseIdiomProps) => {
  const { id } = props;
  const queryKey = id ? queryKeys.idiom(id) : [undefined];
  const {
    data: idiom,
    refetch,
    error,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      if (!queryKey) {
        return;
      }
      const url = queryKey.join("/");

      const response = await fetch(url, {
        method: httpMethods.GET,
      });

      const data: { idiom: Idiom } = await response.json();
      return data.idiom;
    },
    staleTime: 10 * 1000,
  });

  return {
    idiom,
    refetch,
    error,
    isFetching,
  };
};

export default useIdiom;
