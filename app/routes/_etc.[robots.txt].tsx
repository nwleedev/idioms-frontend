import { LoaderFunction } from "@remix-run/node";
import { robotsTxt } from "~/lib/robots.server";

export const loader: LoaderFunction = () => {
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "content-type": "text/plain",
      encoding: "UTF-8",
      "cache-control":
        "public, max-age=604800, s-max-age=604800, must-revalidate",
    },
  });
};
