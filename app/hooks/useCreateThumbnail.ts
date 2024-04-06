import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import useApi from "./useApi";

interface CreateThumbnailArgs {
  prompt: string;
}

const useCreateThumbnail = () => {
  const apiUrl = useApi({
    paths: ["idioms/thumbnail/draft"],
  });
  const mutationFn = async (args: CreateThumbnailArgs) => {
    if (!apiUrl) {
      return;
    }
    debugger;
    const response = await fetch(apiUrl, {
      method: httpMethods.POST,
      body: JSON.stringify(args),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    return {
      source: data.image as string,
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
