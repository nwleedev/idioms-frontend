import { PassThrough } from "node:stream";

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ModalsProvider } from "./contexts/modal";
import { SpeechProvider } from "./contexts/speech";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  if (import.meta.env.DEV) {
    console.log("context", loadContext);
  }
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const queryClient = new QueryClient({});
    const { pipe, abort } = renderToPipeableStream(
      <QueryClientProvider client={queryClient}>
        <ModalsProvider>
          <SpeechProvider>
            <RemixServer
              context={remixContext}
              url={request.url}
              abortDelay={ABORT_DELAY}
            />
          </SpeechProvider>
        </ModalsProvider>
      </QueryClientProvider>,
      {
        onAllReady() {
          const body = new PassThrough();

          responseHeaders.set("content-type", "text/html");
          responseHeaders.set(
            "cache-control",
            "public, max-age=604800, s-max-age=604800, must-revalidate"
          );

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const queryClient = new QueryClient({});
    const { pipe, abort } = renderToPipeableStream(
      <QueryClientProvider client={queryClient}>
        <ModalsProvider>
          <SpeechProvider>
            <RemixServer
              context={remixContext}
              url={request.url}
              abortDelay={ABORT_DELAY}
            />
          </SpeechProvider>
        </ModalsProvider>
      </QueryClientProvider>,
      {
        onShellReady() {
          const body = new PassThrough();

          responseHeaders.set("content-type", "text/html");
          responseHeaders.set(
            "cache-control",
            "public, max-age=604800, s-max-age=604800, must-revalidate"
          );

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
