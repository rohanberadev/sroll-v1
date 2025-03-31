"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/drizzle/db";
import { UserTable } from "~/drizzle/schema";
import { getCurrentUser } from "~/services/clerk";
import { deletePostDraft, upsertPostDraft } from "../db/postDrafts";
import {
  getPost as getPostDb,
  getPublicPostsofUser as getPublicPostsofUserDb,
  insertPost,
} from "../db/posts";
import { canAccessPost } from "../permissions/posts";

export async function getPost(unsafeData: { id: string }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (!unsafeData || !unsafeData.id || typeof unsafeData.id !== "string") {
    return {
      error: true,
      message: "Failed to fetch post",
    };
  }

  const { id } = unsafeData;
  const isAllowed = await canAccessPost({ id, userId });

  if (!isAllowed) {
    return {
      error: true,
      message: "Not allow to view post",
    };
  }

  const post = await getPostDb({ id });

  if (!post) {
    return {
      error: true,
      message: "Post not found",
    };
  }

  return post;
}

export async function createPostFromDraft(unsafeData: { postDraftId: string }) {
  const user = await getCurrentUser({});
  if (!user.clerkUserId || !user.userId) redirect("/sign-in");

  const errorMesssage = "Failed to create post";

  if (
    !unsafeData ||
    !unsafeData.postDraftId ||
    typeof unsafeData.postDraftId !== "string"
  ) {
    return {
      error: true,
      message: errorMesssage,
    };
  }
  const { postDraftId } = unsafeData;

  const postDraft = await deletePostDraft({
    id: postDraftId,
    userId: user.userId,
  });

  try {
    const post = await insertPost({
      userId: postDraft.userId,
      imageUrls: postDraft.imageUrls,
      visibilty: postDraft.visibilty,
      caption: postDraft.caption,
    });

    return post;
  } catch (error) {
    await upsertPostDraft(postDraft);
    return {
      error: true,
      message: errorMesssage,
    };
  }
}

export async function getPublicPostsOfUser({ userId }: { userId: string }) {
  const { userId: currentUserId } = await getCurrentUser({});
  if (!currentUserId) redirect("/sign-in");

  const foundUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
    columns: { id: true },
  });

  if (!foundUser) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const posts = await getPublicPostsofUserDb({ userId });

  return { error: false, data: posts };
}
