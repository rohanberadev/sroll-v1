"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  updatePostOnCreateComment,
  updatePostOnDeleteComment,
} from "~/features/post/db/posts";
import { getCurrentUser } from "~/services/clerk";
import { getComments as getCommentsDb, insertComment } from "../db/comments";
import { canAccessComment } from "../permissions/comments";
import { commentDetailsSchema, getCommentsSchema } from "../schemas/comments";

export async function createComment(
  unsafeData: z.infer<typeof commentDetailsSchema>
) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const { success, data } = commentDetailsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Failed to create comment",
    };
  }

  const isAllowed = await canAccessComment({ postId: data.postId, userId });

  if (!isAllowed) {
    return {
      error: true,
      message: "Not allowed to comment on this post",
    };
  }

  await updatePostOnCreateComment({ id: data.postId });

  try {
    const comment = await insertComment({ ...data, userId });
    return { error: false, data: comment };
  } catch (error) {
    await updatePostOnDeleteComment({ id: data.postId });

    return {
      error: true,
      message: "Failed to create comment",
    };
  }
}

export async function getComments(
  unsafeData: z.infer<typeof getCommentsSchema>
) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const { success, data } = getCommentsSchema.safeParse(unsafeData);

  const errorMessage = "Failed to fetch comments";

  if (!success) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isAllowed = await canAccessComment({ postId: data.postId, userId });

  if (!isAllowed) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const comments = await getCommentsDb({ postId: data.postId, userId });

  return {
    error: false,
    data: comments,
  };
}
