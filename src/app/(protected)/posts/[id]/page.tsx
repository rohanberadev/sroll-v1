import { redirect } from "next/navigation";
import { ShowPost } from "~/features/post/components/show-post";
import { getPost } from "~/features/post/db/posts";
import { canAccessPost } from "~/features/post/permissions/posts";
import { getCurrentUser } from "~/services/clerk";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await getCurrentUser({});
  if (!userId) redirect("/sign-in");

  const isAllowed = canAccessPost({ id, userId });
  if (!isAllowed) redirect("/not-found");

  const [post] = await getPost({ id, userId });

  if (!post) redirect("/not-found");

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ShowPost post={post} />
    </div>
  );
}
