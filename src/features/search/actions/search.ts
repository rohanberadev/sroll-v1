"use server";

import { and, eq, like, not, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/drizzle/db";
import { FollowTable, UserTable } from "~/drizzle/schema";
import { getCurrentUser } from "~/services/clerk";
import { searchUserSchema } from "../schemas/search";

export async function searchUser(unsafeData: z.infer<typeof searchUserSchema>) {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const { success, data } = searchUserSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Failed to search user",
    };
  }

  const users = await db
    .select({
      id: UserTable.id,
      username: UserTable.username,
      fullname: UserTable.fullname,
      imageUrl: UserTable.imageUrl,
      followCount: UserTable.followerCount,
      isFollowedByUser: sql<boolean>`CASE WHEN ${FollowTable.id} IS NOT NULL THEN TRUE ELSE FALSE END`,
    })
    .from(UserTable)
    .leftJoin(
      FollowTable,
      and(
        eq(FollowTable.followerUserId, userId),
        eq(FollowTable.followingUserId, UserTable.id)
      )
    )
    .where(
      and(
        like(sql`LOWER(${UserTable.fullname})`, `${data.query}%`),
        not(eq(UserTable.id, userId))
      )
    );

  return {
    error: false,
    data: users,
  };
}
