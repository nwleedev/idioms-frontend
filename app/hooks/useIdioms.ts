import { useSearchParams } from "@remix-run/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import queryKeys from "~/lib/query-keys";
import { httpMethods } from "../constants/http";
import { IdiomPage, IdiomResponse, IdiomsPageParam } from "../types/idiom";

interface UseIdiomsProps {
  hasThumbnail?: boolean;
}

const useIdioms = (props: UseIdiomsProps) => {
  const { hasThumbnail = false } = props;
  const [params] = useSearchParams();
  const queryKey = queryKeys.idioms(hasThumbnail, params);

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
      const [api, path, count, orderBy, orderDirection] = queryKey;
      const url = [api, path].join("/");
      const params = new URLSearchParams();
      if (pageParam !== undefined) {
        const { cursor } = pageParam;
        params.append(cursor.key, cursor.token);
      }
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
      return {
        cursor: {
          key: "nextToken",
          token: currentData.nextToken,
        },
      };
    },
    getPreviousPageParam: (currentData) => {
      return {
        cursor: {
          key: "prevToken",
          token: currentData.previousToken,
        },
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
  });

  const hasNextPage = useMemo(() => {
    if (data === undefined) {
      return false;
    }
    const pageSize = data.pages.length - 1;
    return data.pages[pageSize].idioms.length === data.pages[pageSize].count;
  }, [data]);

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

export default useIdioms;
