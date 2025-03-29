import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostViewTable = pgTable(
  "post_views",
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
  (table) => [unique("post_view_user").on(table.postId, table.userId)]
);

export const PostViewRelationship = relations(PostViewTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostViewTable.postId],
    references: [PostTable.id],
  }),

  user: one(UserTable, {
    fields: [PostViewTable.userId],
    references: [UserTable.id],
  }),
}));
