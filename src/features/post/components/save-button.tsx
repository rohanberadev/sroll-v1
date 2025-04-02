"use client";

import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Button } from "~/components/ui/button";

export function SaveButton(props: { isSavedByUser: boolean; postId: string }) {
  const [isPostSavedByUser, setIsPostSavedByUser] = useState(
    props.isSavedByUser
  );

  async function onClick() {
    setIsPostSavedByUser((prev) => !prev);
    // const newState = await savePost.mutateAsync({ postId: props.postId });
    // setIsPostSavedByUser(newState);
  }

  return (
    <Button
      className="bg-transparent"
      // disabled={savePost.isPending}
      onClick={onClick}
    >
      {isPostSavedByUser ? (
        <BsBookmarkFill className="h-5 w-5 cursor-pointer" />
      ) : (
        <BsBookmark className="h-5 w-5 cursor-pointer" />
      )}
    </Button>
  );
}
