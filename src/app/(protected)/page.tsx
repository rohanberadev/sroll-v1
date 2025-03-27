import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import InfintePosts from "~/features/post/components/infinite-posts";
import { getPostsFeed } from "~/features/post/db/posts";

export default async function HomePage() {
  // const { userId } = await getCurrentUser({});
  // if (!userId) redirect("/sign-in");
  const user = await currentUser();
  if (!user || !user.publicMetadata.dbId) redirect("/sign-in");

  return (
    <div className="flex w-full flex-col items-center lg:pt-6">
      <Suspense fallback={<p>Loading...</p>}>
        <InitialPosts userId={user?.publicMetadata.dbId} />
      </Suspense>
    </div>
  );
}

async function InitialPosts({ userId }: { userId: string }) {
  const posts = await getPostsFeed({ userId });
  return <InfintePosts posts={posts} />;
}
