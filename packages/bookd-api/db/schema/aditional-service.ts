import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import {
  BrandedID,
  buildIsValidFunc,
  defaultTimestamps,
  prefixedUlid,
} from "../utils";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { task } from "./task";

export const aditionalServicePrefix = "adsv";

export type aditionalServiceID = BrandedID<"aditionalServiceID">;

export const isAditionalServiceID = buildIsValidFunc<aditionalServiceID>(
  aditionalServicePrefix,
);

export const aditionalService = pgTable("aditionalService", {
  id: prefixedUlid(aditionalServicePrefix).$type<aditionalServiceID>(),

  name: varchar("name").unique().notNull(),
  price: integer("price").notNull(), // bigint 13,55 => 1355

  ...defaultTimestamps,
});

export const aditionalServiceRelations = relations(
  aditionalService,
  ({ many }) => ({
    tasks: many(task),
  }),
);

export const zAditionalServiceID = z
  .custom<aditionalServiceID>()
  .refine((value) => isAditionalServiceID(value));
