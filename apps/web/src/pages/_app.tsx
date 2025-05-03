import { AppRouter } from "@/types/api";
import { TRPCProvider } from "@/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  httpBatchStreamLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

/**
 * Import global styles, global css or polyfills here
 * i.e.: import '@/assets/theme/style.scss'
 */
import "../styles/global.css";

function makeQueryClient() {
  return new QueryClient();
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * @link https://nextjs.org/docs/advanced-features/custom-app
 */
const App = (appProps: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, pageProps } = appProps;

  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    const wsClient = createWSClient({
      url: "ws://localhost:8080/api/trpc",
    });

    return createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition(op) {
            // Check if it's a subscription operation
            return op.type === "subscription";
          },
          // When condition is true, use websocket
          true: wsLink({
            client: wsClient,
          }),
          // When condition is false, use http
          false: httpBatchStreamLink({
            url: "http://localhost:8080/api/trpc",
          }),
        }),
      ],
    });
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <Component {...pageProps} />
        </TRPCProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
