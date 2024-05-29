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

export interface UseUpdateExamplesProps {
  idiom?: Idiom;
}

type UpdateExamplesArgs = {
  id: string;
  idiom: string;
  meaningBrief: string;
  meaningFull: string;
  examples: string[];
};

export default function useUpdateExamples(props: UseUpdateExamplesProps) {
  const mutationKey = queryKeys.updateExamples(props.idiom?.id);
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  async function mutationFn(args: UpdateExamplesArgs) {
    if (!mutationKey) {
      return;
    }
    const url = mutationKey.join("/");
    const body = {
      id: args.id,
      idiom: args.idiom,
      meaningBrief: args.meaningBrief,
      meaningFull: args.meaningFull,
      examples: args.examples,
    };
    const response = await fetch(url, {
      method: httpMethods.PUT,
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });

    console.log(response.json());

    return args;
  }

  const { mutate, mutateAsync, status, error, reset } = useMutation({
    mutationFn,
    onSuccess(data) {
      const idiomsQueryKey = queryKeys.idioms(false, params);
      const idiomsCache =
        queryClient.getQueryData<InfiniteData<IdiomPage, unknown>>(
          idiomsQueryKey
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
                meaningBrief: data.meaningBrief,
                meaningFull: data.meaningFull,
                examples: data.examples,
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
      const idiomQueryKey = queryKeys.idiom(data.id);
      let idiomData = queryClient.getQueryData<Idiom>(idiomQueryKey);
      if (idiomData) {
        idiomData = {
          ...idiomData,
          meaningBrief: data.meaningBrief,
          meaningFull: data.meaningFull,
          examples: data.examples,
        };
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
}
