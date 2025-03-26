import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostShareTable = pgTable(
  "post_shares",
  {
    id,
    postId: uuid()
      .notNull()
      .references(() => PostTable.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id),
    createdAt,
  },
  (table) => [unique("post_user").on(table.postId, table.userId)]
);

export const PostShareRelationship = relations(PostShareTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostShareTable.postId],
    references: [PostTable.id],
  }),

  user: one(UserTable, {
    fields: [PostShareTable.userId],
    references: [UserTable.id],
  }),
}));
