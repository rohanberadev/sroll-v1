"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/drizzle/db";
import { FollowTable } from "~/drizzle/schema";
import { getCurrentUser } from "~/services/clerk";
import { deletePostDraft, upsertPostDraft } from "../db/postDrafts";
import {
  getPost as getPostDb,
  getPublicAndFollowerPostsOfUser,
  getPublicPostsofUser as getPublicPostsofUserDb,
  getTopPosts as getTopPostsDb,
  insertPost,
} from "../db/posts";
import { canAccessPost } from "../permissions/posts";

export async function getPost(unsafeData: { id: string }) {
  const { userId } = await getCurrentUser({});
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

  const post = await getPostDb({ id, userId });

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

export async function getPublicPostsOfUser() {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const posts = await getPublicPostsofUserDb({ userId });

  return { error: false, data: posts };
}

export async function getTopPosts(unsafeData: {
  pagination: { pageNumber: number; pageSize: number };
}) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const { success, data } = z
    .object({
      pagination: z.object({
        pageNumber: z.number().default(1),
        pageSize: z.number().default(10),
      }),
    })
    .safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Failed to fetch posts",
    };
  }

  const posts = await getTopPostsDb({ ...data, userId });

  return {
    error: false,
    data: posts,
    nextPageNumber: data.pagination.pageNumber + 1,
  };
}

export async function getAllowedPostsOfUser(unsafeData: { id: string }) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const { data, success } = z
    .object({ id: z.string().min(1).uuid() })
    .safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Failed to fetch posts",
    };
  }

  const isFollower = await db.query.FollowTable.findFirst({
    where: and(
      eq(FollowTable.followerUserId, userId),
      eq(FollowTable.followingUserId, data.id)
    ),
    columns: {
      id: true,
    },
  });

  if (isFollower) {
    const posts = await getPublicAndFollowerPostsOfUser({ userId: data.id });
    return { error: false, data: posts };
  } else {
    const posts = await getPublicPostsofUserDb({ userId: data.id });
    return { error: false, data: posts };
  }
}
