import { z } from "zod";
import { adminOnlyProcedure } from "../auth/procedures";
import { router } from "../config";
import { eq } from "drizzle-orm";
import { roomType } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const roomTypeRouter = router({
  create: adminOnlyProcedure
    .input(z.object({ 
        name: z.string(),
        price: z.number().positive()
    }))
    .mutation(async ({ input, ctx }) => {

        const roomTypeWithSameName = await ctx.db.query.roomType.findFirst({
            where: eq(roomType.name, input.name)
        })

        if(roomTypeWithSameName) {
            throw new TRPCError({
                message: 'Room type name must be unique.',
                code: 'BAD_REQUEST'
            })
        }
      return await ctx.db.insert(roomType).values({
        ...input
      }).returning()
    }),
});
