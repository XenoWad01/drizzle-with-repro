import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import {
  BrandedID,
  buildIsValidFunc,
  defaultTimestamps,
  prefixedUlid,
} from "../utils";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { aditionalServiceInstance, aditionalServiceInstanceID } from "./aditional-service-instance";

export const taskInstancePrefix = "tskinst";

export type taskInstanceID = BrandedID<"taskInstanceID">;

export const isTaskInstanceID = buildIsValidFunc<taskInstanceID>(taskInstancePrefix);

export const taskInstance = pgTable("taskInstance", {
  id: prefixedUlid(taskInstancePrefix).$type<taskInstanceID>(),

  name: varchar("name").notNull(),
  done: boolean("done").default(false),
  note: varchar("note"),
  isExternal: boolean("isExternal").default(false).notNull(),

  aditionalServiceInstanceId: varchar("aditionalServiceInstanceId")
    .$type<aditionalServiceInstanceID>()
    .references(() => aditionalServiceInstance.id),

  ...defaultTimestamps,
});

export const taskInstanceRelations = relations(taskInstance, ({ one }) => ({
  aditionalServiceInstance: one(aditionalServiceInstance, {
    fields: [taskInstance.aditionalServiceInstanceId],
    references: [aditionalServiceInstance.id],
  }),
}));

export const zTaskInstanceID = z.custom<taskInstanceID>().refine((value) => isTaskInstanceID(value));
