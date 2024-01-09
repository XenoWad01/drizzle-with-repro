import { TRPCError } from "@trpc/server";
import { t } from "../config";

export const publicProcedure = t.procedure;

export const authorizedProcedure = publicProcedure.use(
  t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You are not authorized to make this call. [({should-attempt-refresh-access-token})]",
      });
    }

    return next({
      // typescript again is unable to understand that ctx.user is now proven to be there,
      // only types it right if I do this ... typescript cmon man wtf...
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

export const strictlyPublicProcedure = publicProcedure.use(({ next, ctx }) => {
  if (ctx.user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This endpoint is strictly public.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      db: ctx.db,
    },
  });
});

export const adminOnlyProcedure = authorizedProcedure.use(({ next, ctx }) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not an admin.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
