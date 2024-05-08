import { useSearchParams } from "@remix-run/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { httpMethods } from "~/constants/http";
import queryKeys, { invalidKey, isInvalidKey } from "~/lib/query-keys";
import { IdiomPage, IdiomResponse, IdiomsPageParam } from "~/types/idiom";

interface UseSearchIdiomsProps {
  count?: number;
  keyword?: string;
}

const useSearchIdioms = (props: UseSearchIdiomsProps) => {
  const { keyword, count = 10 } = props;
  const [params] = useSearchParams();
  const queryKey =
    keyword && keyword.length > 1
      ? queryKeys.idiomSearch(keyword, params)
      : invalidKey;
  const {
    data,
    error,
    isFetching,
    isFetched,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam, queryKey }) => {
      if (isInvalidKey(queryKey)) {
        return;
      }
      const [api, path, keyword, count, orderBy, orderDirection] = queryKey;
      const url = [api, path].join("/");
      const params = new URLSearchParams();
      if (pageParam !== undefined) {
        const { cursor } = pageParam;
        params.append(cursor.key, cursor.token);
      }
      params.append("keyword", keyword);
      params.append("count", count);
      params.append("orderBy", orderBy);
      params.append("orderDirection", orderDirection);
      const response = await fetch(url + "?" + params, {
        method: httpMethods.GET,
        headers: {
          "content-type": "application/json",
        },
      });
      const data: IdiomResponse = await response.json();
      return {
        idioms: data.idioms,
        count: parseInt(count),
        nextToken: data.cursor.next,
        previousToken: data.cursor.previous,
      } satisfies IdiomPage;
    },
    initialPageParam: undefined as IdiomsPageParam | undefined,
    getNextPageParam: (currentData) => {
      if (!currentData) {
        return;
      }
      return {
        cursor: {
          key: "nextToken",
          token: currentData.nextToken,
        },
      };
    },
    getPreviousPageParam: (currentData) => {
      if (!currentData) {
        return;
      }
      return {
        cursor: {
          key: "prevToken",
          token: currentData.previousToken,
        },
      };
    },
  });

  const hasNextPage = useMemo(() => {
    if (data === undefined) {
      return false;
    }
    const pageSize = data.pages.length - 1;
    return data.pages[pageSize]?.idioms.length === count;
  }, [count, data]);

  useEffect(() => {
    if (error === undefined || error === null) {
      return;
    }
    console.error(error);
  }, [error]);

  return {
    data,
    error,
    isFetching,
    isFetched,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
    queryKey,
  };
};

export default useSearchIdioms;
