// import ProfileInfoButton from "@/components/button/ProfileInfoButton";
// import Avatar from "@/components/user/Avatar";
import Link from "next/link";
import { UserTable } from "~/drizzle/schema";
import { FollowButton } from "~/features/follow/components/follow-button";
import { UserAvatar } from "~/features/user/components/user-avatar";
import { cn } from "~/lib/utils";
import { ProfileInfoDialog } from "./profile-info-dropdown";

export function ProfileCard({
  user,
  isProfileOwner,
}: {
  user: typeof UserTable.$inferSelect;
  isProfileOwner: boolean;
}) {
  return (
    <div className="relative flex w-full items-center gap-x-6 rounded-t-lg border-gray-600 p-6 max-lg:border-b-[1px] lg:border-[1px]">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <UserAvatar
          avatarContainerStyles="w-[80px] lg:w-[130px] h-auto rounded-full border-[4px] border-gray-200"
          avatarImageUrl={user.imageUrl ?? undefined}
        />
        <span className="text-sm lg:text-xl">{user.username}</span>
      </div>
      <div
        className={cn(
          "flex w-full flex-col gap-y-4 p-6 lg:px-12",
          isProfileOwner ? "pt-4" : ""
        )}
      >
        <div className="flex w-full items-center justify-between px-4 max-lg:gap-x-6 max-lg:pt-4 lg:gap-x-12 lg:px-6">
          <Link
            href={`/profile/${user.username}/followers`}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-sm md:text-lg lg:text-xl">Followers</h1>
            <p className="text-sm md:text-lg lg:text-xl">
              {user.followerCount}
            </p>
          </Link>
          <Link
            href={`/profile/${user.username}/following`}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-sm md:text-lg lg:text-xl">Following</h1>
            <p className="text-sm md:text-lg lg:text-xl">
              {user.followingCount}
            </p>
          </Link>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-sm md:text-lg lg:text-xl">Posts</h1>
            <p className="text-sm md:text-lg lg:text-xl">{user.postCount}</p>
          </div>
        </div>

        <FollowButton
          className={cn(
            "transition-colors duration-300",
            isProfileOwner ? "hidden" : ""
          )}
          userId={user.id}
        />
      </div>

      {isProfileOwner && (
        <ProfileInfoDialog
          username={user.username}
          triggerClassName="absolute top-3 right-4 md:top-4 md:right-4"
        />
      )}
    </div>
  );
}
