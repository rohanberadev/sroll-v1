import {
  and,
  asc,
  desc,
  eq,
  exists,
  getTableColumns,
  not,
  or,
  sql,
} from "drizzle-orm";
import { db } from "~/drizzle/db";
import {
  FollowTable,
  PostLikeTable,
  PostSaveTable,
  PostTable,
  UserTable,
} from "~/drizzle/schema";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "~/lib/cache";

export async function insertPost(data: typeof PostTable.$inferInsert) {
  const [newPost] = await db
    .insert(PostTable)
    .values(data)
    .returning({ id: PostTable.id, userId: PostTable.userId });

  if (!newPost) throw new Error("Failed to insert post");

  revalidateDbCache({
    tag: CACHE_TAGS.posts,
    id: newPost.id,
    userId: newPost.userId,
  });

  return newPost;
}

export async function updatePost(
  { id }: { id: string },
  data: Partial<typeof PostTable.$inferSelect>
) {
  const [updatedPost] = await db
    .update(PostTable)
    .set(data)
    .returning({ id: PostTable.id });

  if (!updatedPost) throw new Error("Failed to update post");

  if (updatedPost) {
    revalidateDbCache({ tag: CACHE_TAGS.posts, id });
  }

  return updatedPost;
}

export function getPost({ id, userId }: { id: string; userId: string }) {
  const cacheFn = dbCache(getPostInternal, {
    tags: [getIdTag(id, CACHE_TAGS.posts)],
  });

  return cacheFn({ id, userId });
}

export async function getPostsFeed({
  userId,
  pagination,
}: {
  userId: string;
  pagination: { pageNumber: number; pageSize: number };
}) {
  const { pageNumber, pageSize } = pagination;

  const cacheFn = dbCache(getPostsFeedInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.posts),
      getUserTag(userId, CACHE_TAGS.posts),
    ],
  });

  return cacheFn({
    userId,
    pagination: { pageNumber, pageSize },
  });
}

function getPostInternal({ id, userId }: { id: string; userId: string }) {
  return db
    .select({
      ...getTableColumns(PostTable),
      isFollowedByUser:
        sql<boolean>`CASE WHEN ${FollowTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
          "is_followed_by_user"
        ),
      isLikedByUser:
        sql<boolean>`CASE WHEN ${PostLikeTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
          "is_liked_by_user"
        ),
      isPostedByUser: sql<boolean>`CASE WHEN ${PostTable.userId} = ${userId} THEN TRUE ELSE FALSE END`,
      isSavedByUser: sql<boolean>`CASE WHEN ${PostSaveTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`,
      user: {
        username: UserTable.username,
        imageUrl: UserTable.imageUrl,
      },
    })
    .from(PostTable)
    .leftJoin(
      FollowTable,
      and(
        eq(FollowTable.followerUserId, userId),
        eq(FollowTable.followingUserId, PostTable.userId)
      )
    )
    .leftJoin(
      PostLikeTable,
      and(
        eq(PostLikeTable.userId, userId),
        eq(PostLikeTable.postId, PostTable.id)
      )
    )
    .leftJoin(UserTable, and(eq(UserTable.id, PostTable.userId)))
    .leftJoin(
      PostSaveTable,
      and(
        eq(PostSaveTable.userId, userId),
        eq(PostSaveTable.postId, PostTable.id)
      )
    )
    .where(eq(PostTable.id, id))
    .orderBy(asc(PostTable.createdAt))
    .limit(1);
}

export async function updatePostOnLike({ id }: { id: string }) {
  const [updatedPost] = await db
    .update(PostTable)
    .set({ likeCount: sql`${PostTable.likeCount} + 1` })
    .where(eq(PostTable.id, id))
    .returning({ id: PostTable.id });

  if (!updatedPost) throw new Error("Failed to update post");

  revalidateDbCache({ tag: CACHE_TAGS.posts, id: updatedPost.id });

  return updatedPost;
}

export async function updatePostOnUnlike({ id }: { id: string }) {
  const [updatedPost] = await db
    .update(PostTable)
    .set({ likeCount: sql`${PostTable.likeCount} - 1` })
    .where(eq(PostTable.id, id))
    .returning({ id: PostTable.id });

  if (!updatedPost) throw new Error("Failed to update post");

  revalidateDbCache({ tag: CACHE_TAGS.posts, id: updatedPost.id });

  return updatedPost;
}

export async function updatePostOnCreateComment({ id }: { id: string }) {
  const [updatedPost] = await db
    .update(PostTable)
    .set({ commentCount: sql`${PostTable.commentCount} + 1` })
    .where(eq(PostTable.id, id))
    .returning({ id: PostTable.id });

  if (!updatedPost) throw new Error("Failed to update post");

  revalidateDbCache({ tag: CACHE_TAGS.posts, id: updatedPost.id });

  return updatedPost;
}

export async function updatePostOnDeleteComment({ id }: { id: string }) {
  const [updatedPost] = await db
    .update(PostTable)
    .set({ commentCount: sql`${PostTable.commentCount} - 1` })
    .where(eq(PostTable.id, id))
    .returning({ id: PostTable.id });

  if (!updatedPost) throw new Error("Failed to update post");

  revalidateDbCache({ tag: CACHE_TAGS.posts, id: updatedPost.id });

  return updatedPost;
}

export async function getPublicPostsofUser({ userId }: { userId: string }) {
  const cacheFn = dbCache(getPublicPostsofUserInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.posts),
      getUserTag(userId, CACHE_TAGS.posts),
    ],
  });

  return cacheFn({ userId });
}

export async function getTopPosts({
  userId,
  pagination,
}: {
  userId: string;
  pagination: { pageNumber: number; pageSize: number };
}) {
  const cacheFn = dbCache(getTopPostsInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.posts),
      getUserTag(userId, CACHE_TAGS.posts),
    ],
  });

  return cacheFn({ userId, pagination });
}

export async function getPublicAndFollowerPostsOfUser({
  userId,
}: {
  userId: string;
}) {
  const cacheFn = dbCache(getPublicAndFollowerPostsOfUserInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.posts),
      getUserTag(userId, CACHE_TAGS.posts),
    ],
  });

  return cacheFn({ userId });
}

function getPublicAndFollowerPostsOfUserInternal({
  userId,
}: {
  userId: string;
}) {
  return db
    .select()
    .from(PostTable)
    .where(
      and(
        or(
          eq(PostTable.visibilty, "public"),
          eq(PostTable.visibilty, "follower")
        ),
        eq(PostTable.userId, userId)
      )
    )
    .orderBy(asc(PostTable.createdAt));
}

function getPublicPostsofUserInternal({ userId }: { userId: string }) {
  return db
    .select({
      ...getTableColumns(PostTable),
    })
    .from(PostTable)
    .where(and(eq(PostTable.visibilty, "public"), eq(PostTable.userId, userId)))
    .orderBy(asc(PostTable.createdAt));
  // .limit(pagination.pageSize)
  // .offset((pagination.pageNumber - 1) * pagination.pageSize);
}

function getPostsFeedInternal({
  userId,
  pagination,
}: {
  userId: string;
  pagination: { pageNumber: number; pageSize: number };
}) {
  return db
    .select({
      ...getTableColumns(PostTable),
      isFollowedByUser:
        sql<boolean>`CASE WHEN ${FollowTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
          "is_followed_by_user"
        ),
      isLikedByUser:
        sql<boolean>`CASE WHEN ${PostLikeTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
          "is_liked_by_user"
        ),
      isPostedByUser: sql<boolean>`CASE WHEN ${PostTable.userId} = ${userId} THEN TRUE ELSE FALSE END`,
      isSavedByUser: sql<boolean>`CASE WHEN ${PostSaveTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`,
      user: {
        username: UserTable.username,
        imageUrl: UserTable.imageUrl,
      },
    })
    .from(PostTable)
    .leftJoin(
      FollowTable,
      and(
        eq(FollowTable.followerUserId, userId),
        eq(FollowTable.followingUserId, PostTable.userId)
      )
    )
    .leftJoin(
      PostLikeTable,
      and(
        eq(PostLikeTable.userId, userId),
        eq(PostLikeTable.postId, PostTable.id)
      )
    )
    .leftJoin(UserTable, and(eq(UserTable.id, PostTable.userId)))
    .leftJoin(
      PostSaveTable,
      and(
        eq(PostSaveTable.userId, userId),
        eq(PostSaveTable.postId, PostTable.id)
      )
    )
    .where(
      and(
        or(
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
        not(eq(PostTable.userId, userId))
      )
    )
    .orderBy(asc(PostTable.createdAt))
    .limit(pagination.pageSize)
    .offset((pagination.pageNumber - 1) * pagination.pageSize);
}

function getTopPostsInternal({
  userId,
  pagination,
}: {
  userId: string;
  pagination: { pageNumber: number; pageSize: number };
}) {
  return db
    .select({
      ...getTableColumns(PostTable),
      user: {
        imageUrl: UserTable.imageUrl,
      },
    })
    .from(PostTable)
    .leftJoin(UserTable, and(eq(UserTable.id, PostTable.userId)))
    .where(
      and(
        or(
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
        )
      )
    )
    .orderBy(
      desc(PostTable.likeCount),
      desc(PostTable.shareCount),
      desc(PostTable.commentCount)
    )
    .limit(pagination.pageSize)
    .offset((pagination.pageNumber - 1) * pagination.pageSize);
}
