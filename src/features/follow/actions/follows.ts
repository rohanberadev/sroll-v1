"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/drizzle/db";
import { UserTable } from "~/drizzle/schema";
import {
  updateUserOnFollow,
  updateUserOnUnfollow,
} from "~/features/user/db/users";
import { getCurrentUser } from "~/services/clerk";
import { deleteFollow, insertFollow } from "../db/follows";

export async function followUser(unsafeData: { id: string }) {
  const user = await getCurrentUser({});
  if (!user.userId || !user.clerkUserId) redirect("/sign-in");

  if (!unsafeData || !unsafeData.id || typeof unsafeData.id !== "string") {
    return {
      error: true,
      message: "Failed to follow user",
    };
  }

  const foundUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, unsafeData.id),
    columns: {
      id: true,
    },
  });

  if (!foundUser) {
    return {
      error: true,
      message: "Failed to follow user",
    };
  }

  await updateUserOnFollow({
    followerUserId: user.userId,
    followingUserId: foundUser.id,
  });

  try {
    await insertFollow({
      followerUserId: user.userId,
      followingUserId: foundUser.id,
    });

    return {
      error: false,
      message: "Successfully follow the user",
    };
  } catch (error) {
    updateUserOnUnfollow({
      followerUserId: user.userId,
      followingUserId: foundUser.id,
    });
    return {
      error: true,
      message: "Failed to follow user",
    };
  }
}

export async function unfollowUser(unsafeData: { id: string }) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  if (
    !unsafeData ||
    !unsafeData.id ||
    z.string().uuid().safeParse(unsafeData.id)
  ) {
    return {
      error: true,
      message: "Failed to unfollow user",
    };
  }

  const foundUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, unsafeData.id),
    columns: {
      id: true,
    },
  });

  if (!foundUser) {
    return {
      error: true,
      message: "Failed to unfollow user",
    };
  }

  await updateUserOnUnfollow({
    followerUserId: userId,
    followingUserId: foundUser.id,
  });

  try {
    await deleteFollow({
      followerUserId: userId,
      followingUserId: foundUser.id,
    });

    return {
      error: false,
      message: "Successfully unfollow the user",
    };
  } catch (error) {
    updateUserOnFollow({
      followerUserId: userId,
      followingUserId: foundUser.id,
    });
    return {
      error: true,
      message: "Failed to unfollow user",
    };
  }
}
