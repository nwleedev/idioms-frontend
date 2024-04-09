import { Idiom, IdiomResponse } from "~/types/idiom";

export async function fetchIdioms() {
  try {
    const apiURL = import.meta.env.VITE_API_URL_PROD;
    const response = await fetch(
      `${apiURL}/idioms?count=20&order_by=created_at`
    );
    const data: IdiomResponse = await response.json();

    return data.idioms.map(
      (response) =>
        ({
          ...response,
          createdAt: new Date(response.createdAt),
          thumbnail: `https://assets.useidioms.com/${response.thumbnail}`,
        } satisfies Idiom)
    );
  } catch (error) {
    return [] as Idiom[];
  }
}
