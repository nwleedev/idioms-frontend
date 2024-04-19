import { LoaderFunction } from "@remix-run/node";
import { createSitemap } from "~/lib/sitemap.server";

export const loader: LoaderFunction = async () => {
  const content = await createSitemap();

  return new Response(content, {
    status: 200,
    headers: {
      "content-type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
