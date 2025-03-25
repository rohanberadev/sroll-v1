import { eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { FollowTable } from "~/drizzle/schemas/follow";

export function getFollowerUsers({ userId }: { userId: string }) {
  return db.query.FollowTable.findMany({
    where: eq(FollowTable.followingUserId, userId),
    with: { follower: true },
    columns: {
      followerUserId: false,
      followingUserId: false,
      id: false,
      createdAt: false,
      updatedAt: false,
    },
  });
}

export function getFollowingUsers({ userId }: { userId: string }) {
  return db.query.FollowTable.findMany({
    where: eq(FollowTable.followerUserId, userId),
    with: { following: true },
    columns: {
      followerUserId: false,
      followingUserId: false,
      id: false,
      createdAt: false,
      updatedAt: false,
    },
  });
}
