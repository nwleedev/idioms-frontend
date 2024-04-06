import {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import Search, { css as searchCss } from "~/pages/Search";

export const links: LinksFunction = () => [...searchCss];

export const meta: MetaFunction = ({ location }) => {
  const keyword = new URLSearchParams(location.search).get("keyword") as string;
  return [
    { title: `Searching ${keyword} - Use Idioms` },
    {
      name: "description",
      content: `Searching ${keyword} - Idioms with practical examples`,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://useidioms.com",
    },
    { property: "og:title", content: `Searching ${keyword} - Use Idioms` },
    {
      property: "og:url",
      content: `https://useidioms.com/search?keyword=${keyword}`,
    },
    {
      property: "og:description",
      content: `Searching ${keyword} - Idioms with practical examples`,
    },
    {
      property: "og:image",
      content: `https://useidioms.com/logo.png`,
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `Searching ${keyword} - Use Idioms` },
    {
      name: "twitter:description",
      content: `Searching ${keyword} - Idioms with practical examples`,
    },
    {
      name: "twitter:image",
      content: `https://useidioms.com/logo.png`,
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://useidioms.com",
        name: `Use Idioms`,
        description: `Idioms with practical examples - Use Idioms`,
      },
    },
  ];
};

export const loader: LoaderFunction = (args: LoaderFunctionArgs) => {
  const keyword = new URL(args.request.url).searchParams.get(
    "keyword"
  ) as string;
  if (keyword.length < 2) {
    return redirect("/");
  }
  return json({});
};

export default function SearchPage() {
  return <Search />;
}
