import { TRPCClientError } from "@trpc/client";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import { AppRouter } from "@bookd/bookd-api/trpc";
import { trpcVanilla } from ".";
import { config } from "../../config";

export const onAllErrorResponseIntercept = async (e: unknown) => {
  console.log('ON ERROR WTF')
  const error = e as TRPCClientError<AppRouter>;

  if (error.message.includes("[({should-attempt-refresh-access-token})]")) {
    // we should refresh the accessToken with the refresh token if it's present
    // if this call fails we remove the refreshToken as it's invalid
    // if we reach that point we have to relog

    localStorage.removeItem("accessToken");

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await trpcVanilla.auth.refreshAccessToken.mutate();

      if (config.env === "local" && newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      // set logged in
      localStorage.setItem("accessToken", accessToken);
      useAuthStore.getState().setLogin(true);

      return true;
    } catch (e) {
      // at this point we are sure our refreshToken is invalid,
      if (config.env === "local") {
        localStorage.removeItem("refreshToken");
      }

      // Toast something for UX
      toast.error("Credentials expired");

      // We can also log the user out from the ui. as at this point we tried the refresh token and it didnt work.
      useAuthStore.getState().setLogin(false);
    }
  } else {
    toast.error(
      error.message.split("[({should-attempt-refresh-access-token})]")[0],
    );
  }
};
