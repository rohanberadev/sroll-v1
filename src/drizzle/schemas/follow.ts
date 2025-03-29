import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";

export const FollowTable = pgTable(
  "follows",
  {
    id,
    followerUserId: uuid("follower_user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    followingUserId: uuid("following_user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [unique("follower_following").on(t.followerUserId, t.followingUserId)]
);

export const FollowRelationship = relations(FollowTable, ({ one }) => ({
  follower: one(UserTable, {
    fields: [FollowTable.followerUserId],
    references: [UserTable.id],
  }),

  following: one(UserTable, {
    fields: [FollowTable.followingUserId],
    references: [UserTable.id],
  }),
}));
