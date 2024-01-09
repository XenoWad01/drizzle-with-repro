import { z } from "zod";
import { adminOnlyProcedure } from "../auth/procedures";
import { router } from "../config";
import { zClientID } from "../../db/schema/client";
import { pet } from "../../db/schema";


export const petRouter = router({
  // *************************
  // * () => Add/Create pet  *
  // *************************
  addToClient: adminOnlyProcedure.input(z.object({
    clientId: zClientID,
    name: z.string(),
    breed: z.string(),
    note: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const [newPet] = await ctx.db.insert(pet).values({
        ...input
    }).returning()

    return newPet
  }),

});
