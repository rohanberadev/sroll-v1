import { relations } from "drizzle-orm";
import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { CommentLikeTable } from "./commentLike";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostCommentTable = pgTable("post_comments", {
  id,
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  comment: text().notNull(),
  likeCount: bigint("like_count", { mode: "number" }).notNull().default(0),
  postId: uuid()
    .notNull()
    .references(() => PostTable.id, { onDelete: "cascade" }),
  createdAt,
});

export const PostCommentRelationship = relations(
  PostCommentTable,
  ({ one, many }) => ({
    post: one(PostTable, {
      fields: [PostCommentTable.postId],
      references: [PostTable.id],
    }),

    user: one(UserTable, {
      fields: [PostCommentTable.userId],
      references: [UserTable.id],
    }),

    likes: many(CommentLikeTable),
  })
);
