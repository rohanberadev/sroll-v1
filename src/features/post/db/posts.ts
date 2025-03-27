import { and, asc, eq, exists, not, or, SQL } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { FollowTable, PostLikeTable, PostTable } from "~/drizzle/schema";
import { PostSaveTable } from "~/drizzle/schemas/postSave";
import { PostViewTable } from "~/drizzle/schemas/postView";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "~/lib/cache";

export async function updatePost(
  { id }: { id: string },
  data: Partial<typeof PostTable.$inferSelect>
) {
  const updatedPost = await db.update(PostTable).set(data);

  if (updatedPost.rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.posts, id });
  }

  return updatedPost.rowCount > 0;
}

export function getPost({ id }: { id: string }) {
  const cacheFn = dbCache(getPostInternal, {
    tags: [getIdTag(id, CACHE_TAGS.posts)],
  });

  return cacheFn({ id });
}

export async function getPostsFeed({
  userId,
  pagination,
  filter,
}: {
  userId: string;
  pagination?: { pageNumber: number; pageSize: number };
  filter?: {
    orderBy: SQL<unknown>[] | SQL<unknown>;
  };
}) {
  const pageNumber = pagination?.pageNumber ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const orderBy = filter?.orderBy ?? asc(PostTable.createdAt);

  const cacheFn = dbCache(getPostsFeedInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.posts),
      getUserTag(userId, CACHE_TAGS.posts),
    ],
  });

  return cacheFn({
    userId,
    pagination: { pageNumber, pageSize },
    filter: { orderBy },
  });
}

function getPostInternal({ id }: { id: string }) {
  return db.query.PostTable.findFirst({ where: eq(PostTable.id, id) });
}

function getPostsFeedInternal({
  userId,
  pagination,
  filter,
}: {
  userId: string;
  pagination: { pageNumber: number; pageSize: number };
  filter: {
    orderBy: SQL<unknown>[] | SQL<unknown>;
  };
}) {
  return db.query.PostTable.findMany({
    where: or(
      eq(PostTable.visibilty, "public"),
      not(eq(PostTable.visibilty, "private")),
      and(
        eq(PostTable.visibilty, "follower"),
        exists(
          db
            .select()
            .from(FollowTable)
            .where(
              and(
                eq(FollowTable.followerUserId, userId),
                eq(FollowTable.followingUserId, PostTable.userId)
              )
            )
            .limit(1)
        )
      )
    ),

    limit: pagination?.pageSize,

    offset: (pagination?.pageNumber - 1) * pagination.pageSize,

    orderBy: Array.isArray(filter.orderBy)
      ? [...filter.orderBy]
      : [filter.orderBy],

    extras: {
      likedByUser: exists(
        db
          .select()
          .from(PostLikeTable)
          .where(
            and(
              eq(PostLikeTable.userId, userId),
              eq(PostLikeTable.postId, PostTable.id)
            )
          )
          .limit(1)
      ).as("liked_by_user"),

      followedByUser: exists(
        db
          .select()
          .from(FollowTable)
          .where(
            and(
              eq(FollowTable.followerUserId, userId),
              eq(FollowTable.followingUserId, PostTable.userId)
            )
          )
          .limit(1)
      ).as("followed_by_user"),

      savedByUser: exists(
        db
          .select()
          .from(PostSaveTable)
          .where(
            and(
              eq(PostSaveTable.postId, PostTable.id),
              eq(PostSaveTable.userId, userId)
            )
          )
          .limit(1)
      ).as("saved_by_user"),

      viewedByUser: exists(
        db
          .select()
          .from(PostViewTable)
          .where(
            and(
              eq(PostViewTable.postId, PostTable.id),
              eq(PostViewTable.userId, userId)
            )
          )
          .limit(1)
      ).as("viewed_by_user"),
    },
  });
}
