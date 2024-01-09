import { FC, useEffect } from "react";
import { trpc, queryClient, trpcClient } from "./services/trpc/index.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router.tsx";
import "@bookd/bookd-ui/styles/base.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./services/stores/authStore.ts";

export const App: FC = () => {
  const setIsLoggedIn = useAuthStore((s) => s.setLogin)
  useEffect(() => {
    if(localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')) {
      setIsLoggedIn(true)
    }
  }, [])
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          toastOptions={{
            className: "",
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "white",
              background: "#424242",
            },
          }}
        />
        <AppRouter />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
