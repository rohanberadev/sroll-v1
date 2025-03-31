"use client";

import Link from "next/link";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { UserAvatar } from "~/features/user/components/user-avatar";
import { cn } from "~/lib/utils";
import { getComments } from "../db/comments";

type Comment = Awaited<ReturnType<typeof getComments>>[number];

export function CommentCard({
  comment,
  commentedBy,
  commentedById,
  commentId,
  isLikedByUser,
  isCommentedByUser,
  initialLikeCount,
}: {
  comment: string;
  commentedBy: string;
  commentedById: string;
  commentId: string;
  isLikedByUser: boolean;
  isCommentedByUser: boolean;
  initialLikeCount: number;
}) {
  const [likeState, setLikeState] = useState(isLikedByUser);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  return (
    <div
      className={cn(
        "flex max-h-[80px] min-h-[80px] w-full items-center justify-between rounded-lg border-[1px] border-gray-600 px-6",
        isCommentedByUser ? "bg-zinc-900" : ""
      )}
    >
      <div className="flex items-center gap-x-4">
        <UserAvatar />
        <div className="flex flex-col">
          <Link
            href={`/profile/${commentedBy}`}
            className="text-sm transition-all duration-300 hover:underline"
          >
            {commentedBy}
          </Link>
          <p>{comment}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-6">
        <button
          onClick={async () => {}}
          className="flex flex-col gap-y-1"
          disabled
        >
          {likeState ? (
            <GoHeartFill className="text-xl text-red-600" />
          ) : (
            <GoHeart className="text-xl" />
          )}

          <span className="text-xs">{likeCount}</span>
        </button>
        {/* <CommentInfoButton
          commentedBy={props.commentedBy}
          isCommentedByUser={props.isCommentedByUser}
        /> */}
      </div>
    </div>
  );
}
