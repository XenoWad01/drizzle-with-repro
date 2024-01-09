import { FC, useCallback, useEffect } from "react";
import { useAuthStore } from "../../services/stores/authStore";
import { trpc } from "../../services/trpc";
import { config } from "../../config";

export const Home: FC = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const { mutate: logOut } = trpc.auth.logout.useMutation();

  const { data } = trpc.booking.myBookings.useQuery();
  
  useEffect(() => {




  }, [])
  
  const logOutTheUser = useCallback(() => {
    setLogin(false);
    localStorage.removeItem("accessToken");

    if (config.env === "local") {
      localStorage.removeItem("refreshToken");
    } else {
      logOut();
    }
  }, [logOut]);

  return (
    <>
      Home page
      <button onClick={logOutTheUser}>Log out</button>
      {data?.bookings.map((booking) => (
        <p key={booking.id}>Booking ID: {booking.id}</p>
      ))}
    </>
  );
};
