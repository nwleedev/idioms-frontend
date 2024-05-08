import { LinksFunction, json, redirect } from "@remix-run/node";
import Admin, { css as adminCss } from "~/pages/Admin";

export const links: LinksFunction = () => [...adminCss];

export async function loader() {
  if (process.env.NODE_ENV === "development") {
    return json({});
  }
  return redirect("/");
}

export default function AdminPage() {
  return <Admin />;
}
