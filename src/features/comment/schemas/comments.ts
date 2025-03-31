import { z } from "zod";

export const idSchema = z.string().min(1).uuid();

export const commentDetailsSchema = z.object({
  postId: idSchema,
  comment: z.string().min(1),
});

export const getCommentsSchema = z.object({ postId: idSchema });
