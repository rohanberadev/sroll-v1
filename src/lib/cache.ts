import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

export type ValidCacheTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>
  | ReturnType<typeof getPostTag>;

export const CACHE_TAGS = {
  posts: "posts",
  users: "users",
  postDrafts: "postDrafts",
  follows: "follows",
  postComments: "postComments",
} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

export function getPostTag(postId: string, tag: keyof typeof CACHE_TAGS) {
  return `post:${postId}-${CACHE_TAGS[tag]}` as const;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

export function clearFullCache() {
  revalidateTag("*");
}

export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidCacheTags[] }
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }));
}

export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  revalidateTag(getGlobalTag(tag));

  if (userId) {
    revalidateTag(getUserTag(userId, tag));
  }

  if (id) {
    revalidateTag(getIdTag(id, tag));
  }
}
