import { relations } from "drizzle-orm";
import { bigint, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { FollowTable } from "./follow";
import { PostTable } from "./post";

export const userRole = ["user", "admin"] as const;
export type UserRole = (typeof userRole)[number];
export const userRoleEnum = pgEnum("user_role", userRole);

export const UserTable = pgTable("users", {
  id,
  username: text().notNull(),
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
});

export const UserRelationship = relations(UserTable, ({ many }) => ({
  posts: many(PostTable),

  follows: many(FollowTable),
}));
