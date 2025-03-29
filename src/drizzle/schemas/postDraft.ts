import { relations, sql } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { postVisibiltyEnum } from "./post";
import { UserTable } from "./user";

export const PostDraftTable = pgTable("post_drafts", {
  id,
  caption: text().notNull().default("Unititled Post Caption"),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  imageUrls: text("image_urls")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  visibilty: postVisibiltyEnum().notNull().default("public"),
  createdAt,
  updatedAt,
});

export const PostDraftRelationship = relations(PostDraftTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PostDraftTable.userId],
    references: [UserTable.id],
  }),
}));
