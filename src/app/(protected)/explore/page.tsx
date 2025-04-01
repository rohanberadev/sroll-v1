import { TopPostsGrid } from "~/features/post/components/post-grids";

export default function ExplorePage() {
  return (
    <div className="flex h-full w-full flex-col gap-6 lg:w-[700px]">
      <h1 className="text-2xl font-bold max-lg:hidden">Explore Posts</h1>
      <div className="h-full w-full rounded-md border-[1px] border-gray-800 max-lg:border-none flex justify-center items-center">
        <TopPostsGrid />
      </div>
    </div>
  );
}
