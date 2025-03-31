"use client";

import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { env } from "~/data/env/client";
import { PostVisibilty, postVisibilty } from "~/drizzle/schema";
import { authenticator } from "~/services/imagekit/authenticator";
import { savePostDraft } from "../actions/postDrafts";
import { createPostFromDraft } from "../actions/posts";

export function CreatePostForm() {
  const [captionValue, setCaptionValue] = useState("");
  const [images, setImages] = useState<{ url: string; id: string }[]>([]);
  const [postVisibiltyValue, setPostVisibilityValue] =
    useState<PostVisibilty>("public");
  const [postDraftId, setPostDraftId] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const postDraft = localStorage.getItem("post_draft");
    if (!postDraft) {
      localStorage.setItem("post_draft", JSON.stringify({}));
    }
  }, []);

  function onReset() {
    setCaptionValue("");
    setImages([]);
    setPostVisibilityValue("public");
  }

  async function handleSavePostDraft(data: {
    imageUrls?: string[];
    caption?: string;
    visibility: PostVisibilty;
  }) {
    setSaving(true);

    const { error, message } = await savePostDraft({
      id: postDraftId,
      ...data,
    });

    setSaving(false);

    if (!error) {
      setPostDraftId(message);
    } else {
      return message;
    }
  }

  async function onImageUploadSuccess(res: IKUploadResponse) {
    const error = await handleSavePostDraft({
      imageUrls: [...images.map((image) => image.url), res.url],
      caption: captionValue,
      visibility: postVisibiltyValue,
    });

    if (error) {
      console.log(error);
    } else {
      setImages((prev) => [...prev, { id: res.fileId, url: res.url }]);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <label className="ml-1 text-sm text-gray-400">Enter caption</label>
        <Input
          placeholder="Enter your caption"
          className="border-gray-600"
          value={captionValue}
          onChange={(e) => setCaptionValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="ml-1 text-sm text-gray-400">Media</label>
        <div className="mt-1 flex h-[350px] w-full select-none items-center gap-x-4 overflow-x-auto rounded-sm border-[1px] border-gray-600 p-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative flex h-full min-w-[200px] max-w-[200px] items-center justify-center rounded-sm border-[1px] border-gray-600"
            >
              <IKImage
                urlEndpoint={env.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT}
                src={image.url}
                className="object-contain"
                fill
                alt="image"
              />
              <button className="absolute right-0 top-0 p-2">
                <Trash2Icon className="text-red-600 hover:text-red-400" />
              </button>
            </div>
          ))}

          <ImageKitProvider
            publicKey={env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
            urlEndpoint={env.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT}
            authenticator={authenticator}
          >
            <IKUpload
              id="image-upload"
              fileName="posts/test-upload.png"
              className="hidden"
              onSuccess={onImageUploadSuccess}
            />
          </ImageKitProvider>

          <button
            type="button"
            className="flex h-full min-w-[200px] cursor-pointer items-center justify-center rounded-sm border-[1px] border-dashed border-gray-600"
            disabled={images.length >= 5}
            onClick={() => {
              const imageUpload = document.getElementById("image-upload");
              imageUpload?.click();
            }}
          >
            <div className="flex flex-col items-center justify-center gap-y-2">
              <IoAddSharp className="h-12 w-12 text-gray-400" />
              <span className="text-xs text-gray-400">
                Add your photos here.
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label className="ml-1 text-sm text-gray-400">Visibility</label>
        <Select
          value={postVisibiltyValue}
          onValueChange={async (value) => {
            setPostVisibilityValue(value as PostVisibilty);
            await savePostDraft({ visibility: value as PostVisibilty });
          }}
        >
          <SelectTrigger className="mt-1 w-[180px] border-gray-600">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-black text-gray-400">
            <SelectItem value={postVisibilty[0]}>All</SelectItem>
            <SelectItem value={postVisibilty[1]}>Follower</SelectItem>
            <SelectItem value={postVisibilty[2]}>Private</SelectItem>
          </SelectContent>
        </Select>

        <p className="mt-2 text-xs text-gray-600">
          This is your visibility type for your post.
        </p>
      </div>

      <div className="flex items-center gap-x-4">
        <Button variant={"destructive"} onClick={onReset}>
          Reset
        </Button>
        <Button
          variant={"secondary"}
          disabled={!postDraftId || saving}
          onClick={async () => {
            if (postDraftId) {
              setSaving(true);
              await createPostFromDraft({ postDraftId });
              setSaving(false);
            }
          }}
        >
          Upload
        </Button>
      </div>
    </>
  );
}
