import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { httpMethods } from "~/constants/http";
import { IdiomInput } from "~/types/idiom";
import useApi from "./useApi";

const useCreateIdiomInputs = () => {
  const apiUrl = useApi({ paths: ["idioms/inputs"] });
  const mutationFn = async (args: IdiomInput[]) => {
    if (!apiUrl) {
      return;
    }
    const response = await fetch(apiUrl, {
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
