import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import queryKeys from "~/lib/query-keys";
import { IdiomInput } from "~/types/idiom";

const useCreateIdiomInputs = () => {
  const mutationFn = async (args: IdiomInput[]) => {
    const url = queryKeys.createInputs().join("/");
    const response = await fetch(url, {
      method: httpMethods.POST,
      body: JSON.stringify(args),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    return {
      rows: data.rows as number,
    };
  };
  const { data, mutate, mutateAsync, status, error, reset } = useMutation({
    mutationFn,
  });

  useEffect(() => {
    if (error === undefined || error === null) {
      return;
    }
    console.error(error);
  }, [error]);

  return { data, mutate, mutateAsync, status, reset };
};

export default useCreateIdiomInputs;
