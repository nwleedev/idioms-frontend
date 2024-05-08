import { QueryKey } from "@tanstack/react-query";

const queryKeys = {
  idioms: (
    hasThumbnail: boolean = false,
    params: URLSearchParams = new URLSearchParams()
  ) => {
    if (hasThumbnail) {
      return [
        api(),
        "idioms",
        params.get("count") ?? "30",
        params.get("orderBy") ?? "publishedAt",
        params.get("orderDirection") ?? "desc",
      ] as const;
    } else {
      return [
        api(),
        "idioms/admin",
        params.get("count") ?? "30",
        params.get("orderBy") ?? "publishedAt",
        params.get("orderDirection") ?? "desc",
      ] as const;
    }
  },
  idiomSearch: (
    keyword: string,
    params: URLSearchParams = new URLSearchParams()
  ) => {
    return [
      api(),
      "idioms",
      keyword,
      params.get("count") ?? "30",
      params.get("orderBy") ?? "createdAt",
      params.get("orderDirection") ?? "desc",
    ] as const;
  },
  idiom: (id: string) => [api(), "idioms", id] as const,
  idiomRelated: (id: string) => [api(), `idioms`, id, `related`] as const,
  createDescription: (id: string) =>
    [api(), "idioms", id, "description"] as const,
  createThumbnail: () => [api(), "idioms/thumbnail/draft"] as const,
  uploadThumbnail: (type: "file" | "url") =>
    [api(), "idioms/thumbnail", type === "file" ? "file" : "url"] as const,
  createInputs: () => [api(), "idioms/inputs"] as const,
};

export const api = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL_PROD;
  } else {
    return import.meta.env.VITE_API_URL_DEV;
  }
};

export const invalidKey = [undefined] as const;
export const isInvalidKey = (
  queryKey: QueryKey
): queryKey is typeof invalidKey => {
  return queryKey.length === 1 && queryKey[0] === undefined;
};

export default queryKeys;
