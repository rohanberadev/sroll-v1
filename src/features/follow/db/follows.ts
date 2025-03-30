import { and, eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { FollowTable } from "~/drizzle/schemas/follow";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getUserTag,
  revalidateDbCache,
} from "~/lib/cache";

export async function insertFollow(data: typeof FollowTable.$inferInsert) {
  const [newFollow] = await db.insert(FollowTable).values(data).returning();

  if (!newFollow) throw new Error("Failed to insert follow");

  revalidateDbCache({
    tag: CACHE_TAGS.follows,
    userId: newFollow.followerUserId,
  });
  revalidateDbCache({
    tag: CACHE_TAGS.follows,
    userId: newFollow.followingUserId,
  });

  return newFollow;
}

export async function deleteFollow({
  followerUserId,
  followingUserId,
}: {
  followerUserId: string;
  followingUserId: string;
}) {
  const [deletedFollow] = await db
    .delete(FollowTable)
    .where(
      and(
        eq(FollowTable.followerUserId, followerUserId),
        eq(FollowTable.followingUserId, followingUserId)
      )
    )
    .returning();

  if (!deletedFollow) throw new Error("Failed to delete follow");

  revalidateDbCache({
    tag: CACHE_TAGS.follows,
    userId: deletedFollow.followerUserId,
  });
  revalidateDbCache({
    tag: CACHE_TAGS.follows,
    userId: deletedFollow.followingUserId,
  });

  return deletedFollow;
}

export async function getFollowerUsers({ userId }: { userId: string }) {
  const cacheFn = dbCache(getFollowerUsersInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.follows),
      getUserTag(userId, CACHE_TAGS.follows),
    ],
  });

  return cacheFn({ userId });
}

export async function getFollowingUsers({ userId }: { userId: string }) {
  const cacheFn = dbCache(getFollowingUsersInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.follows),
      getUserTag(userId, CACHE_TAGS.follows),
    ],
  });

  return cacheFn({ userId });
}

function getFollowerUsersInternal({ userId }: { userId: string }) {
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

function getFollowingUsersInternal({ userId }: { userId: string }) {
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
