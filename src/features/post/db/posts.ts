import {
  and,
  asc,
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

function getPostInternal({ id }: { id: string }) {
  return db.query.PostTable.findFirst({ where: eq(PostTable.id, id) });
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
      user: {
        username: UserTable.username,
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
    .where(
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
    .orderBy(asc(PostTable.createdAt))
    .limit(pagination.pageSize)
    .offset((pagination.pageNumber - 1) * pagination.pageSize);
}

export async function updatePostOnLike({ id }: { id: string }) {
  const { rowCount } = await db
    .update(PostTable)
    .set({ likeCount: sql`${PostTable.likeCount} + 1` })
    .where(eq(PostTable.id, id));

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.posts, id });
  }

  return rowCount > 0;
}

export async function updatePostOnUnlike({ id }: { id: string }) {
  const { rowCount } = await db
    .update(PostTable)
    .set({ likeCount: sql`${PostTable.likeCount} - 1` })
    .where(eq(PostTable.id, id));

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.posts, id });
  }

  return rowCount > 0;
}
