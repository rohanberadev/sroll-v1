"use client";

import { getPostsFeed } from "../db/posts";
import { ShowPost } from "./show-post";

export default function InfintePosts({
  posts,
}: {
  posts: Awaited<ReturnType<typeof getPostsFeed>>;
}) {
  return (
    <div className="flex flex-col items-center lg:gap-y-12">
      {posts.map((post, index) => (
        <ShowPost key={index} post={post} />
      ))}
    </div>
  );
}
