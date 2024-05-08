import { useQuery } from "@tanstack/react-query";
import { httpMethods } from "~/constants/http";
import queryKeys, { invalidKey, isInvalidKey } from "~/lib/query-keys";
import { IdiomResponse } from "~/types/idiom";

export interface UseRelatedIdiomsProps {
  idiomId?: string;
}

const useRelatedIdioms = (props: UseRelatedIdiomsProps) => {
  const { idiomId } = props;
  const queryKey = idiomId ? queryKeys.idiomRelated(idiomId) : invalidKey;
  const {
    data: idioms,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      if (isInvalidKey(queryKey)) {
        return;
      }
      const url = queryKey.join("/");
      const response = await fetch(url, {
        method: httpMethods.GET,
        headers: {
          "content-type": "application/json",
        },
      });
      const { idioms }: IdiomResponse = await response.json();
      return idioms;
    },
  });

  return { idioms, refetch, isFetching };
};

export default useRelatedIdioms;
