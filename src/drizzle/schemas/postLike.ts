import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelper";
import { PostTable } from "./post";
import { UserTable } from "./user";

export const PostLikeTable = pgTable(
  "post_likes",
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

export const PostLikeRelationship = relations(PostLikeTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostLikeTable.postId],
    references: [PostTable.id],
  }),

  user: one(UserTable, {
    fields: [PostLikeTable.userId],
    references: [UserTable.id],
  }),
}));
