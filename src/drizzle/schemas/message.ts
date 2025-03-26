import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";

export const MessageTable = pgTable("messages", {
  id,
  content: text().notNull(),
  sentByUserId: uuid()
    .notNull()
    .references(() => UserTable.id),
  recievedByUserId: uuid()
    .notNull()
    .references(() => UserTable.id),
  readAt: timestamp({ withTimezone: true }),
  deletedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const MessageRelationship = relations(MessageTable, ({ one }) => ({
  sender: one(UserTable, {
    fields: [MessageTable.sentByUserId],
    references: [UserTable.id],
  }),

  reciever: one(UserTable, {
    fields: [MessageTable.recievedByUserId],
    references: [UserTable.id],
  }),
}));
