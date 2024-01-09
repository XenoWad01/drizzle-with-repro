import {
  createTRPCProxyClient,
  createTRPCReact,
  httpLink,
} from "@trpc/react-query";

import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AppRouter } from "@bookd/bookd-api/trpc";
import { config } from "../../config";
import { onAllErrorResponseIntercept } from "./response-interceptors";

export const trpc = createTRPCReact<AppRouter>();

const baseUrl = "http://localhost:4000";

export const trpcVanilla = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: `${baseUrl}/trpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers: () => {
        return config.env === "local"
          ? {
              "X-Refresh-Token": localStorage.getItem("refreshToken") || "",
            }
          : {};
      },
    }),
  ],
});

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${baseUrl}/trpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      
      headers: () => {
        return config.env === "local"
          ? {
              "X-Refresh-Token": localStorage.getItem("refreshToken") || "",
              Authorization: localStorage.getItem("accessToken") || "",
            }
          : {
              Authorization: localStorage.getItem("accessToken") || "",
            };
      },
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },

  },
  queryCache: new QueryCache({
    onError: async (error) => {
      await onAllErrorResponseIntercept(error);
    },
  }),
  mutationCache: new MutationCache(),
});
