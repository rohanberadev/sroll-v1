import { eq, sql } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { UserTable } from "~/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "~/lib/cache";

export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({ target: [UserTable.clerkUserId], set: data });

  if (!newUser) throw new Error("Failed to insert user");

  revalidateDbCache({ tag: CACHE_TAGS.users, id: newUser.id });

  return newUser;
}

export async function updateUser(
  { clerkUserId }: { clerkUserId: string },
  data: Partial<typeof UserTable.$inferSelect>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();

  if (!updatedUser) throw new Error("Failed to update user");

  revalidateDbCache({ tag: CACHE_TAGS.users, id: updatedUser.id });

  return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {}

export async function updateUserOnFollow({
  followerUserId,
  followingUserId,
}: {
  followerUserId: string;
  followingUserId: string;
}) {
  await Promise.all([
    db
      .update(UserTable)
      .set({ followerCount: sql`${UserTable.followerCount} + 1` })
      .where(eq(UserTable.id, followingUserId)),
    db
      .update(UserTable)
      .set({ followerCount: sql`${UserTable.followingCount} + 1` })
      .where(eq(UserTable.id, followerUserId)),
  ]);

  revalidateDbCache({ tag: CACHE_TAGS.users, id: followerUserId });
  revalidateDbCache({ tag: CACHE_TAGS.users, id: followingUserId });
}

export async function updateUserOnUnfollow({
  followerUserId,
  followingUserId,
}: {
  followerUserId: string;
  followingUserId: string;
}) {
  await Promise.all([
    db
      .update(UserTable)
      .set({ followerCount: sql`${UserTable.followerCount} - 1` })
      .where(eq(UserTable.id, followerUserId)),
    db
      .update(UserTable)
      .set({ followerCount: sql`${UserTable.followingCount} - 1` })
      .where(eq(UserTable.id, followerUserId)),
  ]);

  revalidateDbCache({ tag: CACHE_TAGS.users, id: followerUserId });
  revalidateDbCache({ tag: CACHE_TAGS.users, id: followingUserId });
}

function getUserProfiles({ id }: { id: string }) {}
