import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { httpMethods } from "../constants/http";
import { IdiomPage, IdiomResponse, IdiomsPageParam } from "../types/idiom";
import useApi from "./useApi";

interface UseIdiomsProps {
  count?: number;
  hasThumbnail?: boolean;
}

const useIdioms = (props: UseIdiomsProps) => {
  const { count = 10, hasThumbnail = false } = props;
  const url = useApi({
    paths: hasThumbnail ? ["idioms"] : ["idioms", "admin"],
  });
  const queryKey = [
    {
      key: "useIdioms",
      count,
      url,
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
      const { count, url } = queryKey[0];
      const params = new URLSearchParams();
      if (pageParam !== undefined) {
        const { cursor } = pageParam;
        params.append(cursor.key, cursor.token);
      }
      params.append("count", count.toString());
      const response = await fetch(url + "?" + params, {
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
    return data.pages[pageSize].idioms.length === count;
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

export default useIdioms;
