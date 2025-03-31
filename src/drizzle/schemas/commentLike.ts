import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostCommentTable } from "./postComment";
import { UserTable } from "./user";

export const CommentLikeTable = pgTable(
  "comment_likes",
  {
    id,
    commentId: uuid()
      .notNull()
      .references(() => PostCommentTable.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [unique("comment_like_user").on(table.commentId, table.userId)]
);

export const CommentLikeRelationship = relations(
  CommentLikeTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [CommentLikeTable.userId],
      references: [UserTable.id],
    }),

    comment: one(PostCommentTable, {
      fields: [CommentLikeTable.commentId],
      references: [PostCommentTable.id],
    }),
  })
);
