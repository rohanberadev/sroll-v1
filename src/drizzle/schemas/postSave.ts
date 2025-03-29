import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostSaveTable = pgTable(
  "post_saves",
  {
    id,
    postId: uuid()
      .notNull()
      .references(() => PostTable.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [unique("post_save_user").on(table.postId, table.userId)]
);

export const PostSaveRelationship = relations(PostSaveTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostSaveTable.postId],
    references: [PostTable.id],
  }),

  user: one(UserTable, {
    fields: [PostSaveTable.userId],
    references: [UserTable.id],
  }),
}));
