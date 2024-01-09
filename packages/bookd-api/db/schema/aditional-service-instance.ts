import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import {
  BrandedID,
  buildIsValidFunc,
  defaultTimestamps,
  prefixedUlid,
} from "../utils";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { booking, bookingID } from "./booking";
import { taskInstance } from "./task-instance";

export const aditionalServiceInstancePrefix = "adsvinst";

export type aditionalServiceInstanceID = BrandedID<"aditionalServiceInstanceID">;

export const isAditionalServiceInstanceID = buildIsValidFunc<aditionalServiceInstanceID>(
  aditionalServiceInstancePrefix,
);

export const aditionalServiceInstance = pgTable("aditionalServiceInstance", {
  id: prefixedUlid(aditionalServiceInstancePrefix).$type<aditionalServiceInstanceID>(),

  name: varchar("name").notNull(),
  price: integer("price").notNull(), // bigint 13,55 => 1355

  bookingId: varchar("bookingId")
    .$type<bookingID>()
    .notNull()
    .references(() => booking.id),

  ...defaultTimestamps,
});

export const aditionalServiceInstanceRelations = relations(
  aditionalServiceInstance,
  ({ one, many }) => ({
    taskInstances: many(taskInstance),
    booking: one(booking, {
      fields: [aditionalServiceInstance.bookingId],
      references: [booking.id],
    }),
  }),
);

export const zAditionalServiceInstanceID = z
  .custom<aditionalServiceInstanceID>()
  .refine((value) => isAditionalServiceInstanceID(value));
