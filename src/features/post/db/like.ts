import { and, eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { PostLikeTable } from "~/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "~/lib/cache";

export async function insertPostLike({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const [newPostLike] = await db
    .insert(PostLikeTable)
    .values({ postId, userId })
    .returning();

  if (!newPostLike) throw new Error("Failed to insert post like");

  revalidateDbCache({ tag: CACHE_TAGS.posts, userId, id: postId });

  return newPostLike;
}

export async function deletePostLike({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const [deletedPostLike] = await db
    .delete(PostLikeTable)
    .where(
      and(eq(PostLikeTable.postId, postId), eq(PostLikeTable.userId, userId))
    )
    .returning();

  if (!deletedPostLike) throw new Error("Failed to delete post like");

  return deletedPostLike;
}
