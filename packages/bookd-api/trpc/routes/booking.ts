import { z } from "zod";
import { adminOnlyProcedure, authorizedProcedure, publicProcedure } from "../auth/procedures";
import { router } from "../config";
import { clientID, zClientID } from "../../db/schema/client";
import { TRPCError } from "@trpc/server";
import { zAditionalServiceID } from "../../db/schema/aditional-service";
import { booking, status } from "../../db/schema";
import { eq } from "drizzle-orm";

import { createAditionalServiceInstancesFromAditionalServiceIds } from "../../services/aditionalService";

export const bookingRouter = router({
  // *************************
  // * () => Create booking  *
  // *************************
  create: adminOnlyProcedure.input(z.object({
    startDate: z.string(),
    endDate: z.string(),
    note: z.string().optional(),
    upfrontPaymentDueAt: z.string(),
    upfrontPaymentPrice: z.number().positive(),
    aditionalServices: z.array(zAditionalServiceID).optional(),
    clientId: zClientID
  })).mutation(async ({ ctx, input }) => {



    // TODO maybe do some validations 
    // TODO such that we cannot create overlapping bookings 
    // TODO at the same time in the same room
    
    // now create the booking
    
    const awaitingPaymentStatus = await ctx.db.query.status.findFirst({
      where: eq(status.name, 'UPFRONT_PAYMENT_PENDING')
    })
    const [newBooking] = await ctx.db.insert(booking).values({
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      note: input.note,
      upfrontPaymentDueAt: new Date(input.upfrontPaymentDueAt),
      upfrontPaymentPrice: input.upfrontPaymentPrice,
      clientId: input.clientId,
      statusId: awaitingPaymentStatus!.id
    }).returning({ id: booking.id })

    if (input.aditionalServices?.length) {
      await createAditionalServiceInstancesFromAditionalServiceIds(newBooking.id, input.aditionalServices)
    }
    
    const bookinFromDb = await ctx.db.query.booking.findFirst({
      where: eq(booking.id, newBooking.id),
      with: {
        status: true,
        petInRooms: {
          with: {
            pet: true,
            room: true,
          }
        },

        aditionalServiceInstances: {
          with: {
            taskInstances: true
          }
        }
      }
    })

    console.log("Now why in gods name does this return [] when in studio there clearely are task-instances????? ", bookinFromDb?.aditionalServiceInstances[0].taskInstances)
    return bookinFromDb
  }),

  // ***********************
  // * () => All Bookings  *
  // ***********************
  allBookings: publicProcedure.input(z.undefined()).query(async ({ ctx }) => {
    const foundBookings = await ctx.db.query.booking.findMany();

    return {
      bookings: foundBookings,
    };
  }),

  // **********************
  // * () => My Bookings  *
  // **********************
  myBookings: authorizedProcedure
    .input(z.undefined())
    .query(async ({ ctx }) => {
      if (!ctx.user.clientId) {
        throw new TRPCError({
          message: "Please contact support",
          code: "BAD_REQUEST",
        });
      }

      const foundClient = await ctx.db.query.client.findFirst({
        where: (client, { eq }) => eq(client.id, ctx.user.clientId as clientID),
        with: {
          bookings: true,
        },
      });

      return {
        bookings: foundClient?.bookings || [],
      };
    }),
});
