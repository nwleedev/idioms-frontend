import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Home, { css as homeCss } from "~/pages/Home";
import { Idiom } from "~/types/idiom";

export const links: LinksFunction = () => [...homeCss];

export const loader: LoaderFunction = async () => {
  const response = await fetch(`http://localhost:8081/idioms/main`);
  const data: { idioms: Idiom[] } = await response.json();

  return json({ idioms: data.idioms });
};

export const meta: MetaFunction = () => {
  return [
    { title: `Use Idioms` },
    {
      name: "description",
      content: "Idioms with practical examples - Use Idioms",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://useidioms.com",
    },
    { property: "og:title", content: "Use Idioms" },
    { property: "og:url", content: `https://useidioms.com` },
    {
      property: "og:description",
      content: "Idioms with practical examples - Use Idioms",
    },
    {
      property: "og:image",
      content: `https://useidioms.com/logo.png`,
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `Use Idioms` },
    {
      name: "twitter:description",
      content: `Idioms with practical examples - Use Idioms`,
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

export default function HomePage() {
  const { idioms } = useLoaderData<typeof loader>();

  return <Home idioms={idioms} />;
}
