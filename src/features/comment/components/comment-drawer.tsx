"use client";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";

import { SendHorizontal, X } from "lucide-react";
import { FaRegComment } from "react-icons/fa";

import { useEffect, useState } from "react";
import { PostVisibilty } from "~/drizzle/schema";
import { createComment, getComments } from "../actions/comments";
import { getComments as getCommentsDb } from "../db/comments";
import { CommentCard } from "./comment-card";

type Comment = Awaited<ReturnType<typeof getCommentsDb>>[number];

export function CommentDrawer({
  className,
  initialCommentCount,
  username,
  postId,
  postVisibilty,
}: {
  className?: string;
  initialCommentCount: number;
  username: string;
  postId: string;
  postVisibilty: PostVisibilty;
}) {
  const [commentValue, setCommentValue] = useState("");
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  return (
    <Drawer>
      <DrawerTrigger className="flex flex-col items-center gap-[0.15rem] cursor-pointer">
        <FaRegComment className={className} />
        <span className="text-xs">{commentCount}</span>
      </DrawerTrigger>
      <DrawerContent className="h-[650px] w-full rounded-none border-l-[0px] border-r-[0px] border-gray-800 bg-black text-gray-400 max-lg:h-full">
        <DrawerHeader>
          <DrawerTitle>Comment Section of this post</DrawerTitle>
          <DrawerDescription>
            You are currently in a comment section of {username}
            {"'s"} post.
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-full overflow-y-auto p-8">
          <Comments postId={postId} />
        </div>
        <DrawerFooter className="flex flex-row">
          <Input
            className="h-16 w-full border-gray-600 text-4xl"
            placeholder="Enter your comment on this post..."
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />
          <Button
            className="flex h-16 w-16 items-center justify-center bg-blue-600"
            onClick={async () => {
              const { error, data } = await createComment({
                comment: commentValue,
                postId: postId,
              });
              setCommentValue("");
            }}
            // disabled={}
          >
            <SendHorizontal size={48} color="white" />
          </Button>
          <DrawerClose asChild className="absolute right-4 top-4">
            <button>
              <X className="text-red-600" size={32} />
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Comments({ postId }: { postId: string }) {
  const [loadingComment, setLoadingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    async function initComments() {
      setLoadingComment(true);
      const { error, message, data } = await getComments({ postId });
      if (!error) {
        setComments(data!);
      } else {
        console.error(message);
      }
      setLoadingComment(false);
    }

    if (comments.length === 0 && postId) {
      initComments();
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-y-8">
      {loadingComment ? (
        <p>Loading...</p>
      ) : comments?.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-950 p-4">
          <p className="text-2xl text-gray-600">No comments in this post.</p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
