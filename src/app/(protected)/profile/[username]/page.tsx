import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/drizzle/db";
import { UserTable } from "~/drizzle/schema";
import { PublicPostsGrid } from "~/features/post/components/post-grids";
import { ProfileCard } from "~/features/profile/components/profile-card";
import ProfileTabs from "~/features/profile/components/profile-post-tabs";
import { getCurrentUser } from "~/services/clerk";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getProfileUser(username);
  const isProfileOwner = (await getCurrentUser({})).userId === user.id;

  return (
    <div className="h-full w-full lg:flex lg:items-center lg:justify-center lg:px-4 ">
      <div className="h-full w-full lg:flex lg:min-w-[650px] lg:max-w-[850px] lg:flex-col lg:items-center lg:justify-between lg:gap-y-2">
        <ProfileCard user={user} isProfileOwner={isProfileOwner} />
        {isProfileOwner ? (
          <ProfileTabs userId={user.id} />
        ) : (
          <PublicPostsGrid userId={user.id} />
        )}
      </div>
    </div>
  );
}

async function getProfileUser(username: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.username, username),
  });

  if (!user) redirect("/not-found");

  return user;
}
