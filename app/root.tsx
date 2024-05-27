import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Suspense, lazy } from "react";

import { LinksFunction } from "@remix-run/node";
import indexCss from "~/index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexCss },
];

const LocationListener = lazy(() => import("./components/LocationListener"));

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <Meta />
        <Links />
        <title>Use Idioms</title>
      </head>
      <body translate="no">
        <div id="root">
          <Outlet />
        </div>
        <div id="modal"></div>
        <Suspense>
          {typeof window !== "undefined" && <LocationListener />}
        </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
