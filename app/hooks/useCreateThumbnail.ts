import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import queryKeys from "~/lib/query-keys";

interface CreateThumbnailArgs {
  prompt: string;
}

const useCreateThumbnail = () => {
  const mutationFn = async (args: CreateThumbnailArgs) => {
    const url = queryKeys.createThumbnail().join("/");
    const response = await fetch(url, {
      method: httpMethods.POST,
      body: JSON.stringify(args),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    return {
      source: data.image as string,
      createdAt: new Date(),
    };
  };
  const { data, mutate, mutateAsync, status, error, reset, isPending } =
    useMutation({
      mutationFn,
    });

  useEffect(() => {
    if (error === undefined || error === null) {
      return;
    }
    console.error(error);
  }, [error]);

  return { data, mutate, mutateAsync, status, reset, isPending };
};

export default useCreateThumbnail;
