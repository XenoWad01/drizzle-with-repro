import { pgTable, varchar } from "drizzle-orm/pg-core";
import {
  BrandedID,
  buildIsValidFunc,
  defaultTimestamps,
  prefixedUlid,
} from "../utils";
import { z } from "zod";

export const statusPrefix = "sts";

export type statusID = BrandedID<"statusID">;

export const isStatusID = buildIsValidFunc<statusID>(statusPrefix);

export const status = pgTable("status", {
  id: prefixedUlid(statusPrefix).$type<statusID>(),

  name: varchar("name").notNull(),
  color: varchar("color").notNull(),

  ...defaultTimestamps,
});


export const zStatusID = z
  .custom<statusID>()
  .refine((value) => isStatusID(value));
