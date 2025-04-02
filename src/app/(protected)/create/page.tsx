import { CreatePostForm } from "~/features/post/components/create-post-form";

export default function CreatePage() {
  return (
    <div className="flex flex-col w-full h-full gap-y-8">
      <h1 className="text-2xl font-bold">Upload new post</h1>
      <CreatePostForm />
    </div>
  );
}
