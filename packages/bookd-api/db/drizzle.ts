import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { config } from "../config";

const client = new Client({
  connectionString: config.dbConnectionString,
});

client.connect();
export const db = drizzle(client, {
  schema: schema,
  // logger: true
});
