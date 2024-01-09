import { inArray } from "drizzle-orm";
import { db } from "../../db";

import { TRPCError } from "@trpc/server";
import { userID } from "../../db/schema/user";
import { refreshToken, refreshTokenID } from "../../db/schema/refresh-token";

// In case of emergency we just drop all the user's sessions and they will have to relog
// This will only happen in the case of suspicious activity
export const pullThePlug = async (userId: userID) => {
  console.log("\n\nDetected bad actor, pulling the plug!!!!!!!!!!!!!!!!! ");

  let rTokenIdsToDelete: Array<refreshTokenID> = [];

  const userSessions = await db.query.session.findMany({
    where: (session, { eq }) => eq(session.userId, userId),
    with: {
      refreshTokens: true,
    },
  });

  userSessions.forEach((session) => {
    session.refreshTokens.forEach((refreshToken) => {
      rTokenIdsToDelete = [...rTokenIdsToDelete, refreshToken.id];
    });
  });

  if (rTokenIdsToDelete.length) {
    await db
      .delete(refreshToken)
      .where(inArray(refreshToken.id, rTokenIdsToDelete));
  }

  throw new TRPCError({
    message: "Refresh token invalid.",
    code: "UNAUTHORIZED",
  });
};

export const safetyProcedure = async (
  userId: userID,
  userAgent: string,
  providedToken: string,
) => {
  // Safety procedure:
  // we delete refresh tokens for the user if
  // the refreshToken is not the oldest one on the session (which is bound to userAgent)
  // we keep the sessions because they are useful for differentiating the user's devices
  console.log(
    "\n\n\n\n\nSafety mechanism running!!!!!!!!!!!!!!!!!\n Searching for bad actor... ",
  );
  let shouldNukeAllPastCreds = false;

  // get session or throw
  const foundSession = await db.query.session.findFirst({
    where: (session, { eq, and }) =>
      and(eq(session.userId, userId), eq(session.userAgent, userAgent)),
  });
  if (!foundSession) {
    shouldNukeAllPastCreds = true;
  }

  if (!shouldNukeAllPastCreds) {
    // get last issued refresh token from session with userId and userAgent and token OR throw
    const lastIssuedRefreshToken = await db.query.refreshToken.findFirst({
      where: (refreshToken, { eq }) =>
        eq(refreshToken.sessionId, foundSession!.id),
      orderBy: (refreshToken, { desc }) => [desc(refreshToken.createdAt)],
    });

    if (lastIssuedRefreshToken?.token !== providedToken) {
      shouldNukeAllPastCreds = true;
    }
  }

  if (shouldNukeAllPastCreds) {
    await pullThePlug(userId);
  }

  console.log("\nAll good, only found legitimate usage. ");

  return {
    foundSession: foundSession!,
  };
};
