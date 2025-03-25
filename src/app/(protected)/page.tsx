import { PostTable } from "~/drizzle/schema";
import InfintePosts from "~/features/post/components/infinite-posts";

export default async function HomePage() {
  const userId = "123";

  const posts = [
    {
      id: "123",
      caption: "hey",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "123",
      imageUrls: [
        "https://images.unsplash.com/photo-1742850541164-8eb59ecb3282?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1741850820782-d01d62e2a4cc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1742218762991-4ab5c4519195?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      visibilty: "public",
      likeCount: 0,
      shareCount: 0,
      commentCount: 0,
      viewCount: 0,
      deletedAt: null,
    },
  ] as (typeof PostTable.$inferSelect)[];

  return (
    <div className="flex w-full flex-col items-center lg:pt-6">
      <InfintePosts posts={posts} />
    </div>
  );
}
