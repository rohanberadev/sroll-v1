"use client";

import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { cn } from "~/lib/utils";
import { togglePostLike } from "../actions/like";

export function LikeButton({
  className,
  active,
  activeColor,
  initialLikeCount,
  postId,
}: {
  className?: string;
  active?: boolean;
  activeColor?: string;
  initialLikeCount: number;
  postId: string;
}) {
  const [isLiked, setIsLiked] = useState(active ? true : false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
    const { like, error } = await togglePostLike({ postId });
    setLoading(false);
    if (!error && like) {
      setIsLiked(like);
    }
  }

  if (isLiked) {
    return (
      <div className="flex flex-col items-center">
        <button onClick={onClick} disabled={loading}>
          <GoHeartFill className={cn(className, activeColor)} />
        </button>

        <span className="text-xs">{likeCount}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button onClick={onClick} disabled={loading}>
        <GoHeart className={className} />
      </button>
      <span className="text-xs">{likeCount}</span>
    </div>
  );
}
