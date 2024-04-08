import { LinksFunction } from "@remix-run/node";
import SettingsPage, { css } from "~/pages/Settings";

export const links: LinksFunction = () => [...css];

export default function Settings() {
  return <SettingsPage />;
}
