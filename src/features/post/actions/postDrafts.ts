"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "~/services/clerk";
import { upsertPostDraft } from "../db/postDrafts";
import { postDraftDetailsSchema } from "../schemas/postDrafts";

export async function savePostDraft(
  unsafeData: z.infer<typeof postDraftDetailsSchema>
) {
  const user = await getCurrentUser({});
  if (!user.userId || !user.clerkUserId) return redirect("/sign-in");

  const { data, success } = postDraftDetailsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Failed to save post draft",
    };
  }

  const postDraft = await upsertPostDraft({ ...data, userId: user.userId });

  return { error: false, message: postDraft.id };
}
