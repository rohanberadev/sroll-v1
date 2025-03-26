import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostCommentTable = pgTable(
  "post_comments",
  {
    id,
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    postId: uuid()
      .notNull()
      .references(() => PostTable.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [unique("post_user").on(table.postId, table.userId)]
);

export const PostLikeRelationship = relations(PostCommentTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostCommentTable.postId],
    references: [PostTable.id],
  }),

  user: one(UserTable, {
    fields: [PostCommentTable.userId],
    references: [UserTable.id],
  }),
}));
