import { RemixBrowser } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { ModalsProvider } from "./contexts/modal";
import { SpeechProvider } from "./contexts/speech";

startTransition(() => {
  const queryClient = new QueryClient({});
  hydrateRoot(
    document,
    <QueryClientProvider client={queryClient}>
      <ModalsProvider>
        <SpeechProvider>
          <RemixBrowser />
        </SpeechProvider>
      </ModalsProvider>
    </QueryClientProvider>
  );
});
