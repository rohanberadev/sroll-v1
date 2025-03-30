"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { followUser } from "../actions/follows";

export function FollowButton({
  className,
  userId,
  isFollowing,
}: {
  className?: string;
  userId: string;
  isFollowing?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  return (
    <Button
      className={cn("bg-blue-600", className, isFollowing ? "hidden" : "")}
      onClick={async () => {
        setLoading(true);
        const { error } = await followUser({ id: userId });
        setLoading(false);
        setFollowing(!error);
      }}
      disabled={loading || isFollowing}
    >
      {loading ? <p>Please wait...</p> : following ? "Following" : "Follow"}
    </Button>
  );
}
