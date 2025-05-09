import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "~/drizzle/db";
import { PostCommentTable, UserTable } from "~/drizzle/schema";
import { CommentLikeTable } from "~/drizzle/schemas/commentLike";
import { CACHE_TAGS, dbCache, getPostTag } from "~/lib/cache";

export async function insertComment(
  data: typeof PostCommentTable.$inferInsert
) {
  const [newComment] = await db
    .insert(PostCommentTable)
    .values(data)
    .returning();

  if (!newComment) throw new Error("Failed to insert comment");

  revalidateTag(getPostTag(newComment.postId, CACHE_TAGS.postComments));

  return newComment;
}

export async function getComments({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const cacheFn = dbCache(getCommentsInternal, {
    tags: [getPostTag(postId, CACHE_TAGS.postComments)],
  });

  return cacheFn({ postId, userId });
}

export function getCommentsInternal({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  return db
    .select({
      ...getTableColumns(PostCommentTable),
      user: {
        username: UserTable.username,
        imageUrl: UserTable.imageUrl,
      },
      isCommentedByUser: sql<boolean>`CASE WHEN ${PostCommentTable.userId} = ${userId} THEN TRUE ELSE FALSE END`,
      isLikedByUser: sql<boolean>`CASE WHEN ${CommentLikeTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`,
    })
    .from(PostCommentTable)
    .leftJoin(UserTable, eq(UserTable.id, PostCommentTable.userId))
    .leftJoin(
      CommentLikeTable,
      and(
        eq(CommentLikeTable.commentId, PostCommentTable.id),
        eq(CommentLikeTable.userId, userId)
      )
    )
    .where(eq(PostCommentTable.postId, postId));
}
