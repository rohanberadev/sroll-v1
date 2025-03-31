import { relations, sql } from "drizzle-orm";
import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { postVisibiltyEnum } from "../enums/posts";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { PostCommentTable } from "./postComment";
import { PostLikeTable } from "./postLike";
import { PostSaveTable } from "./postSave";
import { PostShareTable } from "./postShare";
import { PostViewTable } from "./postView";
import { UserTable } from "./user";

export const PostTable = pgTable("posts", {
  id,
  caption: text().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  imageUrls: text("image_urls")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  visibilty: postVisibiltyEnum().notNull().default("public"),
  likeCount: bigint("like_count", { mode: "number" }).notNull().default(0),
  shareCount: bigint("share_count", { mode: "number" }).notNull().default(0),
  commentCount: bigint("comment_count", { mode: "number" })
    .notNull()
    .default(0),
  viewCount: bigint("view_count", { mode: "number" }).notNull().default(0),
  deletedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PostRelationship = relations(PostTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [PostTable.userId],
    references: [UserTable.id],
  }),

  likes: many(PostLikeTable),

  views: many(PostViewTable),

  shares: many(PostShareTable),

  comments: many(PostCommentTable),

  saves: many(PostSaveTable),
}));
