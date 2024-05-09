import { LinksFunction, MetaFunction } from "@remix-run/node";
import Main, { css as mainCss } from "~/pages/Main";

export const links: LinksFunction = () => [...mainCss];

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
      href: "https://useidioms.com/idioms",
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
  return <Main />;
}
