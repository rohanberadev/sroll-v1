"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { FollowButton } from "~/features/follow/components/follow-button";
import { UserAvatar } from "~/features/user/components/user-avatar";
import { cn } from "~/lib/utils";
import { searchUser } from "../actions/search";

type UserType = NonNullable<
  Awaited<ReturnType<typeof searchUser>>["data"]
>[number];

export function SearchUser() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function search() {
      const { error, data } = await searchUser({ query: debouncedSearch });
      if (!error && data) {
        setUsers(data);
      }
    }

    if (debouncedSearch.length > 0) {
      search();
    }
  }, [debouncedSearch]);

  return (
    <div className="flex h-full w-full flex-col lg:w-[700px] justify-center items-center">
      <div className="w-full border-gray-800 max-lg:border-b-[1px] lg:mb-4">
        <Input
          placeholder="Search New People..."
          className="rounded-sm border-gray-600 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-none border-[1px] border-gray-800 max-lg:rounded-b-md lg:min-h-[calc(100vh-150px)]">
        {/* {isLoading ? (
          <ClipLoader size={32} color="white" className="mt-8" />
        ) : isSuccess ? (
          users.map((user, index) =>
            user ? <UserCard key={index} user={user} /> : null,
          )
        ) : null} */}

        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserType }) {
  return (
    <div
      className={cn(
        "flex h-[100px] w-full items-center justify-between border-b-[1px] border-gray-600 px-8"
        // user.isProfileOwner ? "bg-stone-900" : ""
      )}
    >
      <div className="flex items-center gap-x-8">
        <UserAvatar avatarImageUrl={user.imageUrl!} />
        <Link
          href={`/profile/${user.username}`}
          className="transition-all duration-300 hover:underline"
        >
          {user.username}
        </Link>
      </div>
      <div>
        {user.isFollowedByUser ? null : <FollowButton userId={user.id} />}
      </div>
    </div>
  );
}
