import { z } from "zod";
import {
  authorizedProcedure,
  strictlyPublicProcedure,
} from "../auth/procedures";
import { router } from "../config";
import { TRPCError } from "@trpc/server";
import { refreshToken, session, user } from "../../db/schema";
import { safetyProcedure } from "../auth/safety";
import argon2 from "argon2";
import { config } from "../../config";

export const authRouter = router({
  // *************
  // * () => Login
  // *************
  login: strictlyPublicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userAgent) {
        throw new TRPCError({
          message: "No user agent.",
          code: "BAD_REQUEST",
        });
      }

      const foundUser = await ctx.db.query.user.findFirst({
        where: (user, { eq, and }) => and(eq(user.phone, input.phoneNumber)),
      });

      if (!foundUser) {
        throw new TRPCError({
          message: "Bad credentials",
          code: "UNAUTHORIZED",
        });
      }

      const passwordMatched = await argon2.verify(
        foundUser.password,
        input.password,
      );

      if (!passwordMatched) {
        throw new TRPCError({
          message: "Bad credentials",
          code: "UNAUTHORIZED",
        });
      }

      // either get the session
      let theSession = await ctx.db.query.session.findFirst({
        where: (session, { eq, and }) =>
          and(
            eq(session.userId, foundUser.id),
            eq(session.userAgent, ctx.userAgent!),
          ),
      });

      // or create it if non existent
      if (!theSession) {
        [theSession] = await ctx.db
          .insert(session)
          .values({
            userId: foundUser.id,
            userAgent: ctx.userAgent!,
          })
          .returning();
      }

      // set refreshToken cookie and create the token
      const rToken = await ctx.setRefreshTokenCookie(foundUser.id);

      // create new refreshToken in the db with sessionID and the generated token
      await ctx.db.insert(refreshToken).values({
        sessionId: theSession.id,
        token: rToken,
      });

      const accessToken = ctx.generateAccessToken(foundUser.id);

      return {
        accessToken,
        refreshToken: config.env === "local" ? rToken : undefined,
      };
    }),

  // ****************************
  // * () => Log out
  // ****************************
  logout: authorizedProcedure.input(z.undefined()).mutation(async ({ ctx }) => {
    ctx.unsetRefreshTokenCookie();
  }),

  // ****************
  // * () => Register
  // ****************
  register: strictlyPublicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO REGISTRATION LMAO

      if (!ctx.userAgent) {
        throw new TRPCError({
          message: "No user agent.",
          code: "BAD_REQUEST",
        });
      }

      const hashedPassword = await argon2.hash(input.password);

      // create user
      const [{ userId }] = await ctx.db
        .insert(user)
        .values({
          name: `${input.firstName} ${input.lastName}`,
          email: input.email,
          phone: input.phoneNumber, // TODO probably some validations too that its the right format
          password: hashedPassword,
        })
        .returning({ userId: user.id });

      // if we found a user with the provided credentials we set access & refresh token cookies and return

      // create new session with userId and userAgent
      const [newSession] = await ctx.db
        .insert(session)
        .values({
          userId,
          userAgent: ctx.userAgent!,
        })
        .returning();

      // set refreshToken cookie and create the token
      const rToken = await ctx.setRefreshTokenCookie(userId);

      // create new refreshToken in the db with sessionID and the generated token
      await ctx.db.insert(refreshToken).values({
        sessionId: newSession.id,
        token: rToken,
      });

      // generate new accessToken
      const accessToken = ctx.generateAccessToken(userId);

      // and return it
      return {
        accessToken,
      };
    }),

  // ****************************
  // * () => Refresh access token
  // ****************************
  refreshAccessToken: strictlyPublicProcedure
    .input(z.undefined())
    .mutation(async ({ ctx }) => {
      const refreshTokenFromCookie = ctx.getRefreshTokenFromCookie();

      if (!ctx.userAgent) {
        throw new TRPCError({
          message: "No user agent.",
          code: "BAD_REQUEST",
        });
      }
      if (!refreshTokenFromCookie) {
        throw new TRPCError({
          message: "Refresh token missing.",
          code: "BAD_REQUEST",
        });
      }

      const userId = await ctx.verifyAndGetUserIdFromRefreshToken(
        refreshTokenFromCookie,
      );

      if (!userId) {
        throw new TRPCError({
          message: "Refresh token invalid.",
          code: "BAD_REQUEST",
        });
      }

      const foundUser = await ctx.db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
      });

      if (!foundUser) {
        throw new TRPCError({
          message: "Refresh token invalid.",
          code: "BAD_REQUEST",
        });
      }

      // Will nuke all the user's sessions and throw an error if it detects 'malicious' activity
      // or unregistered refreshTokens
      const { foundSession } = await safetyProcedure(
        userId,
        ctx.userAgent!,
        refreshTokenFromCookie,
      );

      // We can now return the access token, but make sure to 'rotate' the refresh token as well
      // but we make sure to create it with the same expiry as the last refresh token.
      // ALSO make sure to create new refresh token in the db for our user and userAgent

      const rtoken = await ctx.setRefreshTokenCookie(
        foundUser.id,
        foundSession.id,
      );

      await ctx.db.insert(refreshToken).values({
        sessionId: foundSession.id,
        token: rtoken,
      });

      const aToken = ctx.generateAccessToken(foundUser.id);
      return {
        accessToken: aToken,
        refreshToken: config.env === "local" ? rtoken : undefined,
      };
    }),
});
