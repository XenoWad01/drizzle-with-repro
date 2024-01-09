import express from "express";
import { appRouter, createContext } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { logFire } from "./utils/console-log-fire";
import { config } from "./config";
import { seedAll } from "./seeds/seedAll";


(async () => {
  console.log("🌱 Seeding db...")
  await seedAll()
})()

// Init express app
const app = express();

let allowHeaders = ["Set-Cookie", "Authorization"];

if (config.env === "local") {
  // local only allowed headers
  allowHeaders = [...allowHeaders, "X-Refresh-Token"];
}
app.use(
  cors({
    origin: config.env === "local" ? true : ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: allowHeaders,
  }),
);

// Add trpc as middleware to all of our requests going to the /trpc base route
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// Listen on port for incoming requests
app.listen(config.port);

logFire(config.protocol, config.domain, config.port, config.env);

