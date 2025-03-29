import { z } from "zod";
import { postVisibilty } from "~/drizzle/schema";

export const postDraftDetailsSchema = z.object({
  id: z.string().uuid().optional(),
  caption: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  visibility: z.enum(postVisibilty),
});
