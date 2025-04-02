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
import {
  getAllowedPostsOfUser,
  getPublicPostsOfUser,
  getTopPosts,
} from "../actions/posts";
import {
  getPublicPostsofUser as getPublicPostsofUserDb,
  getTopPosts as getTopPostsDb,
} from "../db/posts";

type PublicPosts = Awaited<ReturnType<typeof getPublicPostsofUserDb>>[number];
type TopPosts = Awaited<ReturnType<typeof getTopPostsDb>>[number];

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
      setLoading(true);
      const { data, error } = await getAllowedPostsOfUser({ id: userId });
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }

    if (!posts) {
      initPosts();
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

export function TopPostsGrid({
  initialPosts,
  nextPageNumber,
}: {
  initialPosts?: TopPosts[];
  nextPageNumber?: number;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);

  useEffect(() => {
    async function initPosts() {
      setLoading(false);
      const { data, error, nextPageNumber } = await getTopPosts({
        pagination: { pageNumber: 1, pageSize: 10 },
      });
      if (!error) {
        setPosts(data);
        setNextPage(nextPageNumber!);
      }
      setLoading(true);
    }

    if (!posts && !initialPosts) {
      initPosts();
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
  initialPosts,
}: {
  initialPosts?: PublicPosts[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initPosts() {
      setLoading(true);
      const { data, error } = await getPublicPostsOfUser();
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
