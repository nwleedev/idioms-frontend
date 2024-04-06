import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { httpMethods } from "~/constants/http";
import IdiomPage, { css as idiomPageCss } from "~/pages/Idiom";
import { Idiom } from "~/types/idiom";

export async function loader(args: LoaderFunctionArgs) {
  const id = args.params.id as string;
  const response = await fetch(`http://localhost:8081/idioms/${id}`, {
    method: httpMethods.GET,
  });
  const data: { idiom: Idiom } = await response.json();
  return json({ idiom: data.idiom });
}

export const links: LinksFunction = () => [...idiomPageCss];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.idiom.idiom} - Use Idioms` },
    {
      name: "description",
      content: `${data?.idiom.meaningBrief} - Use Idioms`,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://useidioms.com",
    },
    { property: "og:title", content: data?.idiom.idiom },
    { property: "og:url", content: `https://useidioms.com/${data?.idiom.id}` },
    { property: "og:description", content: data?.idiom.meaningBrief },
    {
      property: "og:image",
      content: `https://static.useidioms.com/${data?.idiom.thumbnail}`,
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `${data?.idiom.idiom} - Use Idioms` },
    {
      name: "twitter:description",
      content: `${data?.idiom.meaningBrief} - Use Idioms`,
    },
    {
      name: "twitter:image",
      content: `https://static.useidioms.com/${data?.idiom.thumbnail}`,
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://useidioms.com",
        name: `${data?.idiom.idiom} - Use Idioms`,
        description: `${data?.idiom.meaningBrief} - Use Idioms`,
      },
    },
  ];
};

export default function Component() {
  const { idiom } = useLoaderData<typeof loader>();

  return (
    <IdiomPage idiom={{ ...idiom, createdAt: new Date(idiom.createdAt) }} />
  );
}
