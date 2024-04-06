import { LinksFunction } from "@remix-run/node";
import Main, { css as mainCss } from "~/pages/Main";

export const links: LinksFunction = () => [...mainCss];

export default function Home() {
  return <Main />;
}
