import * as trpcExpress from "@trpc/server/adapters/express";
import cookie, { CookieSerializeOptions } from "cookie";
import jwt from "jsonwebtoken";
import { userID, user } from "../../db/schema/user";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import ms from "ms";
import { config } from "../../config";
import { sessionID } from "../../db/schema/session";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // **********************************
  // * () => Cookie operation helpers *
  // **********************************
  const getCookies = () => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return {};
    return cookie.parse(cookieHeader);
  };

  const getCookie = (name: string) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return;
    const cookies = cookie.parse(cookieHeader);
    return cookies[name];
  };

  const appendCookies = (
    items: Array<{
      name: string;
      value: string;
      options?: CookieSerializeOptions;
    }>,
  ) => {
    items.forEach(({ name, value, options }) => {
      res.appendHeader("Set-Cookie", cookie.serialize(name, value, options));
    });
  };

  // if we pass sessionId in we will set the expiry to the last issued token on the session
  const setRefreshTokenCookie = async (
    userId: userID,
    sessionId?: sessionID,
  ) => {
    // in seconds
    const defaultExpiresATInSeconds =
      Math.floor(Date.now() / 1000) + ms(config.token.refresh.expiresIn) / 1000;
    let fromDbExpiresATInSeconds: number | undefined;

    if (sessionId) {
      const foundSession = await db.query.session.findFirst({
        where: (session, { eq }) => eq(session.id, sessionId),
      });

      const lastIssuedRefreshToken = await db.query.refreshToken.findFirst({
        where: (refreshToken, { eq }) =>
          eq(refreshToken.sessionId, foundSession!.id),
        orderBy: (refreshToken, { desc }) => [desc(refreshToken.createdAt)],
      });

      await new Promise((resolve) => {
        try {
          jwt.verify(
            lastIssuedRefreshToken!.token,
            config.token.refresh.secret,
            async (_err, decoded) => {
              const d = decoded as jwt.JwtPayload;
              if (d && d?.exp) {
                fromDbExpiresATInSeconds = d.exp;
              }
            },
          );
        } catch (e) {
          /* empty */
        }
        resolve(undefined);
      });
    }

    console.log(
      "putting in exp:",
      fromDbExpiresATInSeconds
        ? fromDbExpiresATInSeconds
        : defaultExpiresATInSeconds,
    );
    console.log(
      "which means as a date: ",
      new Date(
        1000 *
          (fromDbExpiresATInSeconds
            ? fromDbExpiresATInSeconds
            : defaultExpiresATInSeconds),
      ),
    );
    // jwt wants expiresIn (iat) in seconds
    const refreshToken = jwt.sign(
      {
        userId,
        exp: fromDbExpiresATInSeconds
          ? fromDbExpiresATInSeconds
          : defaultExpiresATInSeconds,
      },
      config.token.refresh.secret,
    );

    if (config.env !== "local") {
      appendCookies([
        {
          name: "refreshToken",
          value: refreshToken,
          options: {
            expires: new Date(
              1000 *
                (defaultExpiresATInSeconds
                  ? defaultExpiresATInSeconds
                  : defaultExpiresATInSeconds),
            ),
            httpOnly: true,
            domain: config.domain,
            secure: true,
            path: "/",
            sameSite: "lax",
          },
        },
      ]);
    }

    return refreshToken;
  };

  const unsetRefreshTokenCookie = () => {
    const pastDate = new Date(new Date().getDate() - 100);

    if (config.env !== "local") {
      appendCookies([
        {
          name: "refreshToken",
          value: "",
          options: {
            expires: pastDate,
            domain: config.domain,
            path: "/",
          },
        },
      ]);
    }
  };

  // ***************************
  // * () => JWT/token helpers *
  // ***************************
  const verifyAndGetUserIdFromRefreshToken = async (
    refreshToken: string,
  ): Promise<userID | undefined> => {
    return await new Promise((resolve) => {
      let result = undefined;
      try {
        jwt.verify(
          refreshToken,
          config.token.refresh.secret,
          async (err, decoded) => {
            const d = decoded as { userId: string };
            if (!err) {
              result = d.userId as userID | undefined;
            }
          },
        );
      } catch (e) {
        /* empty */
      }
      resolve(result);
    });
  };

  const verifyAndGetUserIdFromAccessToken = async (
    accessToken: string,
  ): Promise<userID | undefined> => {
    return await new Promise((resolve) => {
      let result = undefined;
      try {
        jwt.verify(
          accessToken,
          config.token.access.secret,
          async (err, decoded) => {
            const d = decoded as { userId: string };
            if (!err) {
              result = d.userId as userID | undefined;
            }
          },
        );
      } catch (e) {
        /* empty */
      }
      resolve(result);
    });
  };

  const generateAccessToken = (userId: userID): string => {
    const defaultExpiresATInSeconds =
      Math.floor(Date.now() / 1000) + ms(config.token.access.expiresIn) / 1000;
    return jwt.sign(
      {
        userId,
        exp: defaultExpiresATInSeconds,
      },
      config.token.access.secret,
    );
  };
  const getRefreshTokenFromCookie = () => {
    if (config.env !== "local") {
      return getCookie("refreshToken");
    } else {
      return req.headers["x-refresh-token"] as string | undefined;
    }
  };

  // Get access token from cookies
  const accessToken = req.headers.authorization;

  let foundUserWithClient = undefined;
  // Now lets verify/decode it to see what's inside
  if (accessToken) {
    const foundUserId = await verifyAndGetUserIdFromAccessToken(accessToken);

    if (!foundUserId) {
      // didnt find no userID so we return without it
    } else {
      // found userID so we attempt to find user from db then return it with client for convenience
      const userId = foundUserId;
      foundUserWithClient = await db.query.user.findFirst({
        where: eq(user.id, userId),
        with: {
          client: true,
        },
      });
    }
  }

  return {
    getCookie,
    getCookies,
    appendCookies,
    setRefreshTokenCookie,
    verifyAndGetUserIdFromRefreshToken,
    verifyAndGetUserIdFromAccessToken,
    getRefreshTokenFromCookie,
    unsetRefreshTokenCookie,
    db,
    generateAccessToken,
    userAgent: req.headers["user-agent"],
    user: foundUserWithClient,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
