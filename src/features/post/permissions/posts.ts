import { and, eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { FollowTable, PostTable } from "~/drizzle/schema";

export async function canSeePost({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const post = await db.query.PostTable.findFirst({
    where: eq(PostTable.id, id),
    columns: {
      userId: true,
      visibilty: true,
    },
  });

  if (!post) return false;

  if (post.visibilty === "public") return true;
  if (post.visibilty === "private" && post.userId === userId) return true;
  if (post.visibilty === "follower") {
    const isFollowingUser = await db.query.FollowTable.findFirst({
      where: and(
        eq(FollowTable.followerUserId, userId),
        eq(FollowTable.followingUserId, post.userId)
      ),
      columns: {
        id: true,
      },
    });

    if (isFollowingUser) return true;
  }

  return false;
}
