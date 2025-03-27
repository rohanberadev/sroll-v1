"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPost as getPostDb } from "../db/posts";
import { canAccessPost } from "../permissions/posts";

export async function getPost({ id }: { id: string }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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
