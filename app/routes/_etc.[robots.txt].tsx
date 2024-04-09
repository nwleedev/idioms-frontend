import { LoaderFunction } from "@remix-run/node";
import { robotsTxt } from "~/lib/robots.server";

export const loader: LoaderFunction = () => {
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "content-type": "text/plain",
      encoding: "UTF-8",
      "cache-control": "max-age=604800, s-maxage=604800",
    },
  });
};
