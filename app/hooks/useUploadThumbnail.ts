import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import { Idiom, IdiomPage, ThumbnailResponse } from "~/types/idiom";
import useApi from "./useApi";
import useIdioms from "./useIdioms";

interface UseUploadThumbnailProps<Type extends "file" | "url"> {
  idiom: Idiom;
  type: Type;
}

type UploadThumbnailArgs<Type extends "file" | "url"> = Type extends "file"
  ? {
      file: File;
      url?: undefined;
    }
  : {
      file?: undefined;
      url: string;
    };

const useUploadThumbnail = <Type extends "file" | "url">(
  props: UseUploadThumbnailProps<Type>
) => {
  const { idiom, type } = props;
  const apiUrl = useApi({
    paths: ["idioms/thumbnail", type === "file" ? "file" : "url"],
  });
  const mutationFn = async (args: UploadThumbnailArgs<Type>) => {
    if (!apiUrl) {
      return;
    }
    const formData = new FormData();
    formData.append("idiomId", idiom.id);
    if (type === "file" && args.file) {
      formData.append("thumbnail", args.file);
    } else if (type === "url" && args.url) {
      formData.append("imageUrl", args.url);
    }

    const response = await fetch(apiUrl, {
      method: httpMethods.POST,
      body: formData,
    });
    const data: ThumbnailResponse = await response.json();
    return data;
  };
  const { queryKey } = useIdioms({ count: 100 });
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, status, error, reset } = useMutation({
    mutationFn: mutationFn,
    onMutate(data) {
      data;
    },
    onSuccess(data) {
      const idiomsCache =
        queryClient.getQueryData<InfiniteData<IdiomPage, unknown>>(queryKey);
      if (idiomsCache === undefined || data === undefined) {
        return;
      }
      const { pages, pageParams } = idiomsCache;
      const updatePages = pages.map((page) => {
        const { idioms, nextToken, previousToken } = page;
        return {
          idioms: idioms.map((idiom) => {
            if (idiom.id === data.idiomId) {
              return {
                ...idiom,
                thumbnail: data.thumbnail,
              };
            }
            return idiom;
          }),
          nextToken,
          previousToken,
        } satisfies IdiomPage;
      });
      const updatedCache = {
        pageParams: pageParams,
        pages: updatePages,
      } satisfies InfiniteData<IdiomPage, unknown>;
      queryClient.setQueryData(queryKey, updatedCache);
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

export default useUploadThumbnail;
