import { and, eq, exists, or } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { FollowTable, PostTable } from "~/drizzle/schema";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag } from "~/lib/cache";

export function getPost({ id }: { id: string }) {
  const cacheFn = dbCache(getPostInternal, {
    tags: [getIdTag(id, CACHE_TAGS.posts)],
  });

  return cacheFn({ id });
}

export async function getPosts({ userId }: { userId: string }) {
  const cacheFn = dbCache(getPostsInternal, {
    tags: [getGlobalTag(CACHE_TAGS.posts)],
  });

  return cacheFn({ userId });
}

function getPostInternal({ id }: { id: string }) {
  return db.query.PostTable.findFirst({ where: eq(PostTable.id, id) });
}

export function getPostsInternal({ userId }: { userId: string }) {
  return db.query.PostTable.findMany({
    where: or(
      eq(PostTable.visibilty, "public"),
      and(eq(PostTable.visibilty, "private"), eq(PostTable.userId, userId)),
      and(
        eq(PostTable.visibilty, "follower"),
        exists(
          db
            .select()
            .from(FollowTable)
            .where(
              and(
                eq(FollowTable.followerUserId, userId),
                eq(FollowTable.followingUserId, PostTable.userId)
              )
            )
        )
      )
    ),
  });
}
