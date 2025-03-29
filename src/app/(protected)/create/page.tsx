import { CreatePostForm } from "~/features/post/components/create-post-form";

export default function CreatePage() {
  return (
    <div className="flex flex-col w-full h-full gap-y-8">
      <h1 className="text-left text-xl font-bold">Create your new post</h1>
      <CreatePostForm />
    </div>
  );
}
