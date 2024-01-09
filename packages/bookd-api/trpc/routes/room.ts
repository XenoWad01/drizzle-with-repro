import { number, string, z } from "zod";
import { adminOnlyProcedure } from "../auth/procedures";
import { router } from "../config";
import { roomType, zRoomTypeID } from "../../db/schema/room-type";
import { eq } from "drizzle-orm";
import { room } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const roomRouter = router({
  create: adminOnlyProcedure
    .input(z.object({ 
      name: string(),
      price: number().positive().optional(),
      roomColor: string(),
      maxPetCount: number().positive(),
      note: string().optional(),
      roomNumber: number().positive(),
      roomTypeId: zRoomTypeID
    }))
    .mutation(async ({ input, ctx }) => {

      const roomWithSameNumber = await ctx.db.query.room.findFirst({
        where: eq(room.roomNumber, input.roomNumber)
      })

      if(roomWithSameNumber) {
        throw new TRPCError({
            message: 'Room number must be unique.',
            code: 'BAD_REQUEST'
        })
      }
      const foundRoomType = await ctx.db.query.roomType.findFirst({
        where: eq(roomType.id, input.roomTypeId)
      })
      if(!foundRoomType) {
        throw new TRPCError({
            message: 'Not valid roomTypeId.',
            code: 'BAD_REQUEST'
        })
      }
      const roomPrice = input.price ? input.price : foundRoomType.price


      return await ctx.db.insert(room).values({
        ...input,
        price: roomPrice
      }).returning()
    }),
});
