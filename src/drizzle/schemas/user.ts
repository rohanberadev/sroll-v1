import { relations } from "drizzle-orm";
import { bigint, index, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { FollowTable } from "./follow";
import { MessageTable } from "./message";
import { PostTable } from "./post";
import { PostSaveTable } from "./postSave";

export const userRole = ["user", "admin"] as const;
export type UserRole = (typeof userRole)[number];
export const userRoleEnum = pgEnum("user_role", userRole);

export const UserTable = pgTable(
  "users",
  {
    id,
    username: text().notNull().unique(),
    fullname: text(),
    clerkUserId: text().notNull().unique(),
    bio: text(),
    email: text().notNull(),
    imageUrl: text("image_url"),
    role: userRoleEnum().notNull().default("user"),
    followerCount: bigint("follower_count", { mode: "number" })
      .notNull()
      .default(0),
    followingCount: bigint("following_count", { mode: "number" })
      .notNull()
      .default(0),
    postCount: bigint("post_count", { mode: "number" }).notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("clerk_user_id_idx").on(table.clerkUserId),
    index("username_idx").on(table.username),
  ]
);

export const UserRelationship = relations(UserTable, ({ many }) => ({
  posts: many(PostTable),

  follows: many(FollowTable),

  messages: many(MessageTable),

  savePosts: many(PostSaveTable),
}));
