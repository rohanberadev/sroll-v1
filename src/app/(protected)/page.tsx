import { redirect } from "next/navigation";
import { Suspense } from "react";
import InfintePosts from "~/features/post/components/infinite-posts";
import { getPostsFeed } from "~/features/post/db/posts";
import { getCurrentUser } from "~/services/clerk";

export default async function HomePage() {
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex w-full flex-col items-center">
      <Suspense fallback={<p>Loading...</p>}>
        <InitialPosts userId={userId} />
      </Suspense>
    </div>
  );
}

async function InitialPosts({ userId }: { userId: string }) {
  const posts = await getPostsFeed({
    userId,
    pagination: { pageNumber: 1, pageSize: 10 },
  });
  return <InfintePosts posts={posts} />;
}
