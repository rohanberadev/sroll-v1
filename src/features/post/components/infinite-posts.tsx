"use client";

import { PostTable } from "~/drizzle/schema";
import { ShowPost } from "./show-post";

export default function InfintePosts({
  posts,
}: {
  posts: (typeof PostTable.$inferSelect)[];
}) {
  return (
    <div className="flex flex-col items-center lg:gap-y-12 lg:py-4">
      {posts.map((post, index) => (
        <ShowPost key={index} post={post} />
      ))}
    </div>
  );
}
