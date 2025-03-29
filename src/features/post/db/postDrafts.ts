import { eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { PostDraftTable } from "~/drizzle/schemas/postDraft";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "~/lib/cache";

export async function upsertPostDraft(
  data: typeof PostDraftTable.$inferInsert
) {
  const [newPostDraft] = await db
    .insert(PostDraftTable)
    .values(data)
    .onConflictDoUpdate({
      target: [PostDraftTable.id],
      set: {
        caption: data.caption,
        imageUrls: data.imageUrls,
        visibilty: data.visibilty,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!newPostDraft) throw new Error("Failed to insert post draft");

  revalidateDbCache({
    tag: CACHE_TAGS.postDrafts,
    userId: newPostDraft.userId,
    id: newPostDraft.id,
  });

  return newPostDraft;
}

export async function getPostDraft({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const cacheFn = dbCache(getPostDraftInternal, {
    tags: [
      getGlobalTag(CACHE_TAGS.postDrafts),
      getIdTag(id, CACHE_TAGS.postDrafts),
      getUserTag(userId, CACHE_TAGS.postDrafts),
    ],
  });

  return cacheFn({ id });
}

export async function deletePostDraft({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const [deletedPostDraft] = await db
    .delete(PostDraftTable)
    .where(eq(PostDraftTable.id, id))
    .returning();

  if (!deletedPostDraft) throw new Error("Failed to delete post draft");

  revalidateDbCache({ tag: CACHE_TAGS.postDrafts, userId, id });

  return deletedPostDraft;
}

function getPostDraftInternal({ id }: { id: string }) {
  return db.query.PostDraftTable.findFirst({
    where: eq(PostDraftTable.id, id),
  });
}
