import { useSearchParams } from "@remix-run/react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import queryKeys from "~/lib/query-keys";
import { Idiom, IdiomPage } from "~/types/idiom";

interface UseCreateExamplesProps {
  idiom?: Idiom;
}
const useCreateExamples = (props: UseCreateExamplesProps) => {
  const { idiom } = props;
  const [params] = useSearchParams();

  const mutationKey = queryKeys.createExamples(idiom?.id);
  const mutationFn = async () => {
    if (!mutationKey || !idiom) {
      return;
    }
    const url = mutationKey.join("/");
    const body = {
      id: idiom.id,
      idiom: idiom.idiom,
      meaning: idiom.meaningBrief,
    };

    const response = await fetch(url, {
      method: httpMethods.POST,
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    const data: { idiom: Idiom } = await response.json();
    return data;
  };
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, status, error, reset } = useMutation({
    mutationFn: mutationFn,
    onMutate(data) {
      data;
    },
    onSuccess(data) {
      const idiomsQueryKey = queryKeys.idioms(false, params);
      const idiomsCache =
        queryClient.getQueryData<InfiniteData<IdiomPage, unknown>>(
          idiomsQueryKey
        );
      if (
        idiomsCache === undefined ||
        data === undefined ||
        data.idiom === undefined
      ) {
        return;
      }
      const { pages, pageParams } = idiomsCache;
      const updatePages = pages.map((page) => {
        const { idioms, count, nextToken, previousToken } = page;
        return {
          idioms: idioms.map((idiom) => {
            if (idiom.id === data.idiom.id) {
              return {
                ...idiom,
                meaningBrief: data.idiom.meaningBrief,
                meaningFull: data.idiom.meaningFull,
                examples: data.idiom.examples,
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
      queryClient.setQueryData(idiomsQueryKey, updatedCache);
      if (!idiom) {
        return;
      }
      const idiomQueryKey = queryKeys.idiom(idiom.id);
      const idiomData = queryClient.getQueryData<Idiom>(idiomQueryKey);
      if (idiomData) {
        idiomData.meaningBrief = data.idiom.meaningBrief;
        idiomData.meaningFull = data.idiom.meaningFull;
        idiomData.examples = data.idiom.examples;
        queryClient.setQueryData(idiomQueryKey, idiomData);
      }
    },
  });

  useEffect(() => {
    if (error === undefined || error === null) {
      return;
    }
    console.error(error);
  }, [error]);

  return { mutate, mutateAsync, status, reset };
};

export default useCreateExamples;
