import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { UserRole, UserTable } from "~/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag } from "~/lib/cache";

const client = await clerkClient();

export async function getCurrentUser({ allData = false }) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // if (userId != null && !sessionClaims?.dbId) {
  //   redirect("/api/clerk/syncUsers");
  // }

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user: allData && sessionClaims?.dbId ? await getUser(userId) : undefined,
    redirectToSignIn,
  };
}

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

function getUser(id: string) {
  const cacheFn = dbCache(getUserInternal, {
    tags: [getIdTag(id, CACHE_TAGS.users)],
  });

  return cacheFn({ id });
}

function getUserInternal({ id }: { id: string }) {
  return db.query.UserTable.findFirst({ where: eq(UserTable.clerkUserId, id) });
}
