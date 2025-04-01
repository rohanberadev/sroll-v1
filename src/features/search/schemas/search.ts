import { z } from "zod";

export const searchUserSchema = z.object({
  query: z.string().min(1).toLowerCase(),
});
