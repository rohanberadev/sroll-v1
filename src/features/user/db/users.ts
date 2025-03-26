import { eq } from "drizzle-orm";
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
