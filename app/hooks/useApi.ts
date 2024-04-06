import { useMemo } from "react";

export interface UseApiProps {
  paths?: string[];
}

const useApi = (props: UseApiProps) => {
  const { paths } = props;

  const url = useMemo(() => {
    let url = import.meta.env.VITE_API_URL_DEV;
    if (import.meta.env.PROD) {
      url = import.meta.env.VITE_API_URL_PROD;
    }
    return url;
  }, []);

  if (!paths) {
    return null;
  }
  return [url.toString(), ...paths].join("/");
};

export default useApi;
