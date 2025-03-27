"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/drizzle/db";
import { PostLikeTable, PostTable } from "~/drizzle/schema";
import { deletePostLike, insertPostLike } from "../db/like";
import { canAccessPost } from "../permissions/posts";

export async function togglePostLike(unsafeData: { postId: string }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = unsafeData;

  if (!data || !data.postId || typeof data.postId !== "string") {
    return {
      error: true,
      message: "Failed to toggle like on post",
    };
  }

  const isAllowed = await canAccessPost({ id: data.postId, userId });

  if (!isAllowed) {
    return {
      error: true,
      message: "Not allowed to access this post",
    };
  }

  const existingPostLike = await db.query.PostLikeTable.findFirst({
    where: and(
      eq(PostLikeTable.postId, data.postId),
      eq(PostLikeTable.userId, userId)
    ),
  });

  // like the post
  if (!existingPostLike) {
    await db
      .update(PostTable)
      .set({ likeCount: sql`${PostTable.likeCount} + 1` })
      .where(eq(PostTable.id, data.postId));

    try {
      await insertPostLike({ postId: data.postId, userId });
    } catch (e) {
      await db
        .update(PostTable)
        .set({ likeCount: sql`${PostTable.likeCount} - 1` })
        .where(eq(PostTable.id, data.postId));

      return {
        error: true,
        message: "Failed to like post",
      };
    }

    return {
      error: false,
      message: "Successfully like the post",
    };
  }
  // unlike the post
  else {
    await db
      .update(PostTable)
      .set({ likeCount: sql`${PostTable.likeCount} - 1` })
      .where(eq(PostTable.id, data.postId));

    try {
      await deletePostLike({ postId: data.postId, userId });
    } catch (e) {
      await db
        .update(PostTable)
        .set({ likeCount: sql`${PostTable.likeCount} + 1` })
        .where(eq(PostTable.id, data.postId));

      return {
        error: true,
        message: "Failed to unlike post",
      };
    }

    return {
      error: false,
      message: "Successfully unlike the post",
    };
  }
}
