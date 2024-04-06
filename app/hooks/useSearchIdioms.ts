import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { httpMethods } from "~/constants/http";
import { IdiomPage, IdiomResponse, IdiomsPageParam } from "~/types/idiom";
import useApi from "./useApi";

interface UseSearchIdiomsProps {
  count?: number;
  keyword?: string;
}

const useSearchIdioms = (props: UseSearchIdiomsProps) => {
  const { keyword, count = 10 } = props;
  const apiUrl = useApi({
    paths: ["idioms/search"],
  });
  const queryKey = [
    {
      key: "useSearchIdioms",
      apiUrl,
      count,
      keyword,
    },
  ] as const;
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
      const { apiUrl, keyword, count } = queryKey[0];
      if (!apiUrl || !keyword) {
        return;
      }
      const params = new URLSearchParams();
      if (pageParam !== undefined) {
        const { cursor } = pageParam;
        params.append(cursor.key, cursor.token);
      }
      params.append("count", count.toString());
      params.append("keyword", keyword);
      const response = await fetch(apiUrl + "?" + params, {
        method: httpMethods.GET,
        headers: {
          "content-type": "application/json",
        },
      });
      const data: IdiomResponse = await response.json();
      return {
        idioms: data.idioms,
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
          key: "previousToken",
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
