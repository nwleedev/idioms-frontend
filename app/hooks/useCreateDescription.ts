import { useSearchParams } from "@remix-run/react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { httpMethods } from "~/constants/http";
import queryKeys, { invalidKey, isInvalidKey } from "~/lib/query-keys";
import { IdiomPage } from "~/types/idiom";

export interface UseCreateDescriptionProps {
  id?: string;
}

interface DescriptionResponse {
  id: string;
  description: string;
}

const useCreateDescription = (props: UseCreateDescriptionProps) => {
  const { id } = props;
  const mutationKey = id ? queryKeys.createDescription(id) : invalidKey;
  const [params] = useSearchParams();
  const mutationFn = async () => {
    if (isInvalidKey(mutationKey)) {
      return;
    }
    const url = mutationKey.join("/");
    const response = await fetch(url, {
      method: httpMethods.PUT,
    });
    const data: DescriptionResponse = await response.json();
    return data;
  };
  const queryClient = useQueryClient();

  const { data, mutate, mutateAsync, status, error, reset } = useMutation({
    mutationFn,
    onSuccess(data) {
      const idiomQueryKey = queryKeys.idioms(false, params);
      const idiomsCache =
        queryClient.getQueryData<InfiniteData<IdiomPage, unknown>>(
          idiomQueryKey
        );
      if (idiomsCache === undefined || data === undefined) {
        return;
      }
      const { pages, pageParams } = idiomsCache;
      const updatePages = pages.map((page) => {
        const { idioms, count, nextToken, previousToken } = page;
        return {
          idioms: idioms.map((idiom) => {
            if (idiom.id === data.id) {
              return {
                ...idiom,
                description: data.description,
              };
            }
            return idiom;
          }),
          count,
          nextToken,
          previousToken,
        } satisfies IdiomPage;
      });
      const updatedCache = {
        pageParams: pageParams,
        pages: updatePages,
      } satisfies InfiniteData<IdiomPage, unknown>;
      queryClient.setQueryData(idiomQueryKey, updatedCache);
    },
  });

  return { data, mutate, mutateAsync, status, error, reset };
};

export default useCreateDescription;
