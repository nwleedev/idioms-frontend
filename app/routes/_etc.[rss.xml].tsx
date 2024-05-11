import { LoaderFunction } from "@remix-run/node";
import { Feed } from "feed";
import { fetchIdioms } from "~/lib/idioms.server";

export const loader: LoaderFunction = async () => {
  const idioms = await fetchIdioms();
  const feed = new Feed({
    title: "Use Idioms",
    description: "Idioms with practical examples - Use Idioms",
    id: "https://useidioms.com",
    link: "https://useidioms.com",
    favicon: "https://useidioms.com/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()} useidioms.com`,
  });
  idioms.forEach((idiom) => {
    feed.addItem({
      title: idiom.idiom,
      id: `https://useidioms.com/${idiom.id}`,
      link: `https://useidioms.com/${idiom.id}`,
      description: idiom.meaningBrief,
      content: idiom.meaningFull,
      date: idiom.publishedAt,
      image: idiom.thumbnail,
    });
  });

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      "content-type": "application/xml",
      encoding: "UTF-8",
      "cache-control":
        "public, max-age=86400, s-max-age=86400, must-revalidate",
    },
  });
};
