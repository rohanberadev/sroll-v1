import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/drizzle/db";
import { UserRole, UserTable } from "~/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag } from "~/lib/cache";

const client = await clerkClient();

export async function getCurrentUser({ allData = false }) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (userId != null && sessionClaims?.dbId == null) {
    redirect("/api/clerk/syncUsers");
  }

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.dbId,
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
  const cacheFn = dbCache(
    (id) => db.query.UserTable.findFirst({ where: eq(UserTable.id, id) }),
    {
      tags: [getUserTag(id, CACHE_TAGS.users)],
    }
  );

  return cacheFn(id);
}
