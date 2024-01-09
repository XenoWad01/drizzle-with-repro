import { trpc } from "../trpc";

export const useBookings = () => {
  const { data } = trpc.bookings.allBookings.useQuery();

  return {
    bookings: data?.bookings || [],
  };
};

export default useBookings;
