import { relations, sql } from "drizzle-orm";
import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";

export const postVisibilty = ["public", "follower", "private"] as const;
export type PostVisibilty = (typeof postVisibilty)[number];
export const postVisibiltyEnum = pgEnum("post_visibility", postVisibilty);

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

export const PostRelationship = relations(PostTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PostTable.userId],
    references: [UserTable.id],
  }),
}));
