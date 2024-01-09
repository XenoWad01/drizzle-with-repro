import { z } from "zod";
import { adminOnlyProcedure } from "../auth/procedures";
import { router } from "../config";
import { client } from "../../db/schema/client";
import { TRPCError } from "@trpc/server";
import { discount, user } from "../../db/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";


export const clientRouter = router({
  // ************************
  // * () => Create client  *
  // ************************
  create: adminOnlyProcedure.input(z.object({
    userData: z.object({
        email: z.string().email(),
        phone: z.string(),
        name: z.string(), 
        password: z.string()
    }),
    note: z.string().optional(),
    discountData: z.object({
        flatValue: z.number().positive(),
        percentage: z.number().positive()
    }).optional()
  })).mutation(async ({ ctx, input }) => {

    const userWithSameEmailOrPhone = await ctx.db.query.user.findFirst({
        where: or(
            eq(user.email, input.userData.email),
            eq(user.phone, input.userData.phone)
        )
    })

    if(userWithSameEmailOrPhone) {
        throw new TRPCError({
            message: 'Email and phone number need to be unique.',
            code: 'CONFLICT'
        })
    }


    const [newUser] = await ctx.db.insert(user).values({
        ...input.userData,
        password: await argon2.hash(input.userData.password),
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning({ id: user.id })

    const [newClient] = await ctx.db.insert(client).values({
        note: input.note,
        userId: newUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning({ id: client.id })

    await ctx.db.update(user).set({
        clientId: newClient.id
    }).where(eq(user.id, newUser.id))

    if(input.discountData) {
        const [newDiscount] = await ctx.db.insert(discount).values({
            ...input.discountData
        }).returning({ discountId: discount.id })

        await ctx.db.update(client).set({
            discountId: newDiscount.discountId
        }).where(eq(client.id, newClient.id))
    }

    const clientToReturn = await ctx.db.query.client.findFirst({
        where: eq(client.id, newClient.id),
        with: {
            user: true
        }
    })

    if(clientToReturn) {
        clientToReturn.user
        clientToReturn.user.password = 'redacted'

        return clientToReturn
    }


    throw new TRPCError({
        message: 'Something went wrong while creating client. Please contact support.',
        code: 'INTERNAL_SERVER_ERROR'
    })
  }),

});
