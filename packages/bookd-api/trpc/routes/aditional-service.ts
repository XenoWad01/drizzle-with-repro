import { z } from "zod";
import { adminOnlyProcedure } from "../auth/procedures";
import { router } from "../config";
import { eq } from "drizzle-orm";
import { aditionalService, task } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const aditionalServiceRouter = router({
  create: adminOnlyProcedure
    .input(z.object({ 
        name: z.string(),
        price: z.number().positive(),
        tasks: z.array(z.object({
            name: z.string(),
            isExternal: z.boolean()
        }))
    }))
    .mutation(async ({ input, ctx }) => {

        const aditionalServiceWithSameName = await ctx.db.query.aditionalService.findFirst({
            where: eq(aditionalService.name, input.name)
        })

        if(aditionalServiceWithSameName) {
            throw new TRPCError({
                message: 'Aditional Service name must be unique.',
                code: 'BAD_REQUEST'
            })
        }
        const [createdAditionalService] = await ctx.db.insert(aditionalService).values({
            name: input.name,
            price: input.price,
        }).returning({ id: aditionalService.id })

        input.tasks.forEach(async (taskData) => {
            await ctx.db.insert(task).values({
                ...taskData,
                aditionalServiceId: createdAditionalService.id
            })
        })

        return await ctx.db.query.aditionalService.findFirst({
            where: eq(aditionalService.id, createdAditionalService.id),
            with: {
                tasks: true
            }
        })

    }),
});
