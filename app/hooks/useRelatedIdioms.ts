import { useQuery } from "@tanstack/react-query";
import { httpMethods } from "~/constants/http";
import { IdiomResponse } from "~/types/idiom";
import useApi from "./useApi";

export interface UseRelatedIdiomsProps {
  idiomId?: string;
}

const useRelatedIdioms = (props: UseRelatedIdiomsProps) => {
  const { idiomId } = props;
  const url = useApi({
    paths: idiomId ? [`idioms`, idiomId, `related`] : undefined,
  });
  const queryKey = [
    {
      key: "useRelatedIdioms",
      url,
    },
  ] as const;
  const {
    data: idioms,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      const { url } = queryKey[0];
      if (!url) {
        return null;
      }
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
