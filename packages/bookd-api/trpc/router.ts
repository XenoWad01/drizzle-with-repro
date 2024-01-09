import { router } from "./config";
import { bookingRouter } from "./routes/booking";
import { authRouter } from "./routes/auth";
import { roomRouter } from "./routes/room";
import { clientRouter } from "./routes/client";
import { petRouter } from "./routes/pet";
import { aditionalServiceRouter } from "./routes/aditional-service";
import { roomTypeRouter } from "./routes/room-type";

export const appRouter = router({
  booking: bookingRouter,
  auth: authRouter,
  room: roomRouter,
  client: clientRouter,
  pet: petRouter,
  aditionalService: aditionalServiceRouter,
  roomType: roomTypeRouter
});

export type AppRouter = typeof appRouter;
