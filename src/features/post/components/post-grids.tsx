"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { cn } from "~/lib/utils";

import { IKImage } from "imagekitio-next";
import { useEffect, useState } from "react";
import { FaComment } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { env } from "~/data/env/client";
import { PostTable } from "~/drizzle/schema";
import { getPublicPostsOfUser } from "../actions/posts";
import { getPublicPostsofUser } from "../db/posts";

type PublicPosts = Awaited<ReturnType<typeof getPublicPostsofUser>>[number];
// type AllowedPosts =

export function AllowedPostsGrid({
  userId,
  initialPosts,
}: {
  userId: string;
  initialPosts?: PublicPosts[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initPosts() {
      const data = await getPublicPostsOfUser({ userId });
    }

    if (!posts) {
    }
  }, [posts, initialPosts]);

  return (
    <div className="grid w-full grid-cols-3">
      {posts?.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <PostGridBox post={post} />
        </Link>
      ))}
    </div>
  );
}

export function PublicPostsGrid({
  userId,
  initialPosts,
}: {
  userId: string;
  initialPosts?: PublicPosts[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initPosts() {
      setLoading(true);
      const { data, error } = await getPublicPostsOfUser({ userId });
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }

    if (!posts) {
      initPosts();
    }
  }, [posts, initialPosts]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid w-full grid-cols-3">
      {posts?.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <PostGridBox post={post} />
        </Link>
      ))}
    </div>
  );
}

function PostGridBox({ post }: { post: typeof PostTable.$inferSelect }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      className="relative select-none"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={() => console.log("clicked")}
    >
      <AspectRatio
        ratio={1 / 1}
        className={cn(
          "m-[1px] cursor-pointer transition-all duration-300 hover:opacity-60",
          hover ? "opacity-60" : ""
        )}
      >
        <IKImage
          urlEndpoint={env.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT}
          src={post.imageUrls[0]!}
          fill
          alt="image"
        />
      </AspectRatio>
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 z-40 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
          hover ? "flex items-center gap-x-8 lg:gap-x-12" : ""
        )}
        onHoverStart={() => setHover(true)}
      >
        <div className="flex flex-col items-center">
          <GoHeartFill className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          <span className="text-white max-lg:text-xs">{post.likeCount}</span>
        </div>
        <div className="flex flex-col items-center">
          <FaComment className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          <span className="text-white max-lg:text-xs">{post.commentCount}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
